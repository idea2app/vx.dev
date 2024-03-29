import { retryAsync } from "https://deno.land/x/retry@v2.0.0/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import {
  ChatCompletionMessageParam,
  CompletionUsage,
} from "https://deno.land/x/openai@v4.20.1/resources/mod.ts";
import { assert } from "https://deno.land/std@0.201.0/assert/assert.ts";
import { ChatCompletionCreateParamsBase } from "https://deno.land/x/openai@v4.20.1/resources/chat/completions.ts";
import { fromMarkdown } from "https://esm.sh/mdast-util-from-markdown@2.0.0";
import { visitParents } from "https://esm.sh/unist-util-visit-parents@6.0.1";
import { toMarkdown } from "https://esm.sh/mdast-util-to-markdown@2.1.0";
import { remove } from "https://esm.sh/unist-util-remove@4.0.0";
import { Octokit } from "npm:octokit";
import commitPlugin from "npm:octokit-commit-multiple-files";

const apiKey = Deno.env.get("OPENAI_API_KEY");
assert(apiKey, "failed to get openAI API key");

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function getCode(
  messages: ChatCompletionMessageParam[] = [],
  model: ChatCompletionCreateParamsBase["model"]
): Promise<{
  code: string;
  usage?: CompletionUsage | undefined;
  description: string;
}> {
  return await retryAsync<{
    code: string;
    usage?: CompletionUsage | undefined;
    description: string;
  }>(
    async () => {
      const chatCompletion = await openai.chat.completions.create({
        messages,
        model,
        max_tokens: 3000,
        temperature: 0,
      });

      console.log("raw output> ", chatCompletion.choices[0].message.content);

      const codeBlocks: string[] = [];
      const tree = fromMarkdown(
        chatCompletion.choices[0].message.content || ""
      );
      // deno-lint-ignore no-explicit-any
      visitParents(tree, "code", (node: any) => {
        codeBlocks.push(node.value.trim());
      });

      if (codeBlocks.length !== 1) {
        throw new Error(`invalid code blocks ${JSON.stringify(codeBlocks)}`);
      }

      remove(tree, "code");
      return {
        code: codeBlocks[0],
        usage: chatCompletion.usage,
        description: toMarkdown(tree),
      };
    },
    { delay: 100, maxTry: 3 }
  );
}

type IssueEvent = {
  action: string;
  issue: {
    body: string;
    number: number;
    labels: { name: string }[];
    user: { login: string };
    pull_request?: { url: string };
    state: string;
  };
  comment?: {
    body: string;
  };
};

const PatchedOctokit = Octokit.plugin(commitPlugin);
const ghToken = Deno.env.get("GH_TOKEN");
assert(ghToken, "failed to get github token");

export const octokit: Octokit = new PatchedOctokit({
  auth: ghToken,
});

const whitelistStr = Deno.env.get("WHITELIST");
assert(whitelistStr, "failed to get whitelist");
const whitelist = whitelistStr.split(",");

export const vxDevPrefix = `[vx.dev]`;

function isValidComment(comment: {
  body?: string;
  user?: { login: string } | null;
}) {
  return (
    !comment.body?.includes(vxDevPrefix) &&
    whitelist.some((item) => item === comment.user?.login)
  );
}

async function getConnectedPr(
  owner: string,
  repo: string,
  issueNumber: number
) {
  const connectedEvent = await octokit.graphql<{
    repository: {
      issue?: {
        timelineItems: {
          nodes: {
            id: string;
            source: { number: number; state: string };
            __typename: string;
            createdAt: string;
          }[];
        };
      };
    };
  }>(`{
    repository(owner: "${owner}", name: "${repo}") {
      issue(number: ${issueNumber}) {
        timelineItems(itemTypes: [CROSS_REFERENCED_EVENT], first: 1) {
          nodes {
            ... on CrossReferencedEvent {
              id
              createdAt
              source {
                ... on PullRequest {
                  id
                  number
                  state
                }
              }
              __typename
            }
          }
        }
      }
    }
  }`);

  let { nodes = [] } = connectedEvent.repository.issue?.timelineItems || {};
  nodes = nodes
    .filter((n) => n.source.state === "OPEN")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  return nodes[0]?.source.number;
}

async function getConnectedIssue(owner: string, repo: string, prBody: string) {
  const issueNumber = parseInt(
    prBody.match(/\[vx\.dev\] This PR implements #(\d+),/)?.[1] || ""
  );
  if (!issueNumber) {
    throw new Error("failed to get connected issue");
  }

  return (
    await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    })
  ).data;
}

export async function applyPR(
  owner: string,
  repo: string,
  issueNumber: number,
  newBranch: string,
  files: Record<string, string>,
  commitMsg: string,
  labels: string[]
) {
  const baseBranch = "main";

  // deno-lint-ignore no-explicit-any
  await (octokit as any).createOrUpdateFiles({
    owner,
    repo,
    branch: newBranch,
    createBranch: true,
    // base: baseBranch,
    // forkFromBaseBranch: true,
    changes: [
      {
        message: commitMsg,
        files,
      },
    ],
  });

  let pr = (
    await octokit.rest.search.issuesAndPullRequests({
      q: `is:open is:pr base:${baseBranch} head:${newBranch}+repo:${owner}/${repo}`,
    })
  ).data.items[0];
  if (!pr) {
    pr = (
      await octokit.rest.pulls.create({
        owner,
        repo,
        head: newBranch,
        base: baseBranch,
        title: `${vxDevPrefix} implements #${issueNumber}`,
        body: `${vxDevPrefix} This PR implements #${issueNumber}, created by vx.dev.`,
      })
    ).data as any;
  }

  octokit.rest.issues.setLabels({
    owner,
    repo,
    issue_number: pr.number,
    labels,
  });

  return pr;
}

async function collectPromptAndImages(
  owner: string,
  repo: string,
  issue: { number: number; body?: string | null },
  pr: { number: number }
) {
  const prComments = (
    await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: pr.number,
    })
  ).data;
  const issueComments = (
    await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issue.number,
    })
  ).data;

  const commentsStr = issueComments
    .concat(prComments)
    .filter((c) => isValidComment(c))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((c) => c.body)
    .join("\n");

  let prompt = `${issue.body || ""}\n${commentsStr}`;
  const regex = /!\[.*?\]\((.*?)\)/g;
  const imgRegex = /<img .*?src="(.*?)".*?>/g;
  const images = [];
  let match;
  while ((match = regex.exec(prompt)) !== null) {
    images.push(match[1]);
  }

  let imgMatch;
  while ((imgMatch = imgRegex.exec(prompt)) !== null) {
    images.push(imgMatch[1]);
  }
  prompt = prompt.replace(regex, "").replace(imgRegex, "");

  return {
    prompt,
    images,
  };
}

export const lucideIcons: Record<string, unknown> = {};
try {
  const iconNodes = await (
    await fetch("https://lucide.dev/api/icon-nodes")
  ).json();
  for (const key in iconNodes) {
    const newKey = key
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    lucideIcons[newKey] = iconNodes[key];
  }
} catch {}

export async function getIssueEvent() {
  const githubEventPath = Deno.env.get("GITHUB_EVENT_PATH");
  assert(githubEventPath, "failed to get github event path");

  const githubEvent: IssueEvent = (
    await import(githubEventPath, {
      with: { type: "json" },
    })
  ).default;

  const eventName = Deno.env.get("GITHUB_EVENT_NAME");
  assert(eventName, "failed to get event name");

  return { githubEvent, eventName };
}

export async function composeWorkflow(
  label: string,
  placeholderFiles: Record<string, string>
) {
  const { githubEvent, eventName } = await getIssueEvent();

  console.log(
    githubEvent.action,
    eventName,
    githubEvent.issue,
    githubEvent.comment
  );

  const isPr = Boolean(githubEvent.issue.pull_request);

  // only accept issue with ui-gen label
  if (githubEvent.issue.labels.every((l) => l.name !== label)) {
    return;
  }

  // only accept issue/PR created by whitelist users
  if (whitelist.every((item) => item !== githubEvent.issue.user.login)) {
    return;
  }

  // ignore non-comments event in PR
  if (isPr && eventName === "issues") {
    return;
  }

  // ignore invalid comment
  if (
    eventName === "issue_comment" &&
    githubEvent.comment &&
    !isValidComment(githubEvent.comment)
  ) {
    return;
  }

  // ignore closed issue/PR
  if (githubEvent.issue.state !== "open") {
    return;
  }

  const owner = Deno.env.get("GITHUB_REPOSITORY_OWNER");
  assert(owner, "failed to get repo owner");

  let repo = Deno.env.get("GITHUB_REPOSITORY");
  assert(repo, "failed to get repo name");
  repo = repo.replace(`${owner}/`, "");

  const issue = isPr
    ? await getConnectedIssue(owner, repo, githubEvent.issue.body)
    : githubEvent.issue;

  const branch = `${label}-issue-${issue.number}`;

  let pr: { number: number } = { number: -1 };
  if (isPr) {
    // is PR event
    pr = githubEvent.issue;
  } else {
    const connectedPrNumber = await getConnectedPr(owner, repo, issue.number);
    pr = connectedPrNumber
      ? (
          await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: connectedPrNumber,
          })
        ).data
      : await applyPR(
          owner,
          repo,
          issue.number,
          branch,
          placeholderFiles,
          "[Skip CI] vx.dev: init the PR",
          [label]
        );
  }

  let { prompt, images } = await collectPromptAndImages(owner, repo, issue, pr);
  const commitMsg = JSON.stringify(
    {
      prompt,
      images,
    },
    null,
    2
  );

  return {
    commitMsg,
    prompt,
    images,
    owner,
    repo,
    branch,
    issue,
    pr,
  };
}

export const shadcnRules = [
  {
    matcher: "^Avatar.*",
    source: "@/components/ui/avatar",
  },
  {
    matcher: "^AspectRatio",
    source: "@/components/ui/aspect-ratio",
  },
  {
    matcher: "^Badge",
    source: "@/components/ui/badge",
  },
  {
    matcher: "^Button",
    source: "@/components/ui/button",
  },
  {
    matcher: "^Card.*",
    source: "@/components/ui/card",
  },
  {
    matcher: "^Checkbox",
    source: "@/components/ui/checkbox",
  },
  {
    matcher: "^Collapsible.*",
    source: "@/components/ui/collapsible",
  },
  {
    matcher: "^Menubar.*",
    source: "@/components/ui/menubar",
  },
  {
    matcher: "^Select.*",
    source: "@/components/ui/select",
  },
  {
    matcher: "^RadioGroup.*",
    source: "@/components/ui/radio-group",
  },
  {
    matcher: "^Textarea",
    source: "@/components/ui/textarea",
  },
  {
    matcher: "^ToggleGroup.*",
    source: "@/components/ui/toggle-group",
  },
  {
    matcher: "^Toggle",
    source: "@/components/ui/toggle",
  },
  {
    matcher: "^Skeleton",
    source: "@/components/ui/skeleton",
  },
  {
    matcher: "^Slider",
    source: "@/components/ui/slider",
  },
  {
    matcher: "^Tooltip.*",
    source: "@/components/ui/tooltip",
  },
  {
    matcher: "^Label",
    source: "@/components/ui/label",
  },
  {
    matcher: "^Input",
    source: "@/components/ui/input",
  },
  {
    matcher: "^ScrollArea",
    source: "@/components/ui/scroll-area",
  },
  {
    matcher: "^Switch",
    source: "@/components/ui/switch",
  },
  {
    matcher: "^Dialog.*",
    source: "@/components/ui/dialog",
  },
  {
    matcher: "^Sheet.*",
    source: "@/components/ui/sheet",
  },
  {
    matcher: "^Separator",
    source: "@/components/ui/separator",
  },
  {
    matcher: "^NavigationMenu.*",
    source: "@/components/ui/navigation-menu",
  },
  {
    matcher: "^HoverCard.*",
    source: "@/components/ui/hover-card",
  },
  {
    matcher: "^DropdownMenu.*",
    source: "@/components/ui/dropdown-menu",
  },
  {
    matcher: "^Accordion.*",
    source: "@/components/ui/accordion",
  },
  {
    matcher: "^AlertDialog.*",
    source: "@/components/ui/alert-dialog",
  },
  {
    matcher: "^Alert.*",
    source: "@/components/ui/alert",
  },
  {
    matcher: "^Table.*",
    source: "@/components/ui/table",
  },
  {
    matcher: "^Tabs.*",
    source: "@/components/ui/tabs",
  },
  {
    matcher: "^Popover.*",
    source: "@/components/ui/popover",
  },
  {
    matcher: "^Calendar",
    source: "@/components/ui/calendar",
  },
  {
    matcher: "^Command.*",
    source: "@/components/ui/command",
  },
  {
    matcher: "^ContextMenu.*",
    source: "@/components/ui/context-menu",
  },
  {
    matcher: "^Carousel.*",
    source: "@/components/ui/carousel",
  },
  {
    matcher: "^Drawer.*",
    source: "@/components/ui/drawer",
  },
  {
    matcher: "^Pagination.*",
    source: "@/components/ui/pagination",
  },
  {
    matcher: "^Resizable.*",
    source: "@/components/ui/resizable",
  },
  {
    matcher: "^ResponsiveBar",
    source: "@nivo/bar",
  },
  {
    matcher: "^ResponsiveLine",
    source: "@nivo/line",
  },
  {
    matcher: "^ResponsivePie",
    source: "@nivo/pie",
  },
  {
    matcher: "^ResponsiveScatterPlot",
    source: "@nivo/scatterplot",
  },
  {
    matcher: "^ResponsiveHeatMap",
    source: "@nivo/heatmap",
  },
];
