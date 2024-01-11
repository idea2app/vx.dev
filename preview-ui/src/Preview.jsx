import { Home, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import React from 'react';

export default function HomePage() {
  return (
    (<div className="flex flex-col h-screen">
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold">IDEA2APP</h1>
        </div>
        <nav className="flex space-x-4">
          <a href="#services" className="hover:text-blue-600">业务介绍</a>
          <a href="#projects" className="hover:text-blue-600">近期项目</a>
          <a href="#about" className="hover:text-blue-600">开源项目</a>
          <a href="#contact" className="hover:text-blue-600">团队成员</a>
          <a href="#contact" className="hover:text-blue-600">合作伙伴</a>
        </nav>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 text-gray-600" />
          <Twitter className="w-6 h-6 text-gray-600" />
          <Linkedin className="w-6 h-6 text-gray-600" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <section id="hero" className="mb-8">
          <div className="bg-white rounded shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">我们专注于软件开发</h2>
              <p className="mb-4">您的想法可能会很伟大，我们可以帮助您实现它。</p>
              <Button variant="solid">立即咨询 <ArrowRight className="ml-2" /></Button>
            </div>
            <AspectRatio ratio={16 / 9} className="w-1/2">
              <img
                src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&dpr=2&q=80"
                alt="Hero Image"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        </section>
        <section id="services" className="mb-8">
          <h3 className="text-xl font-bold mb-4">业务介绍</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>业务咨询</CardTitle>
              </CardHeader>
              <CardContent>
                <p>我们提供专业的咨询服务，帮助您找到最佳的解决方案。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">了解更多</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>定制化软件开发</CardTitle>
              </CardHeader>
              <CardContent>
                <p>我们提供一站式的软件开发服务，满足您的特定需求。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">了解更多</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>持续集成和交付</CardTitle>
              </CardHeader>
              <CardContent>
                <p>我们提供持续集成和交付服务，确保您的软件质量和交付速度。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">了解更多</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section id="projects" className="mb-8">
          <h3 className="text-xl font-bold mb-4">近期项目</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project cards with 'new' badge */}
            <Card>
              <CardHeader>
                <CardTitle>项目名称</CardTitle>
                <span className="text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-1">新</span>
              </CardHeader>
              <CardContent>
                <p>项目描述。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看详情</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>项目名称</CardTitle>
                <span className="text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-1">新</span>
              </CardHeader>
              <CardContent>
                <p>项目描述。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看详情</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section id="about" className="mb-8">
          <h3 className="text-xl font-bold mb-4">开源项目</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Open source project cards */}
            <Card>
              <CardHeader>
                <CardTitle>项目名称</CardTitle>
              </CardHeader>
              <CardContent>
                <p>项目描述。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看详情</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>项目名称</CardTitle>
              </CardHeader>
              <CardContent>
                <p>项目描述。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看详情</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>项目名称</CardTitle>
              </CardHeader>
              <CardContent>
                <p>项目描述。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">查看详情</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section id="contact" className="mb-8">
          <h3 className="text-xl font-bold mb-4">团队成员</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Team member cards */}
            <Card>
              <CardHeader>
                <Avatar>
                  <AvatarImage src="https://github.com/Yuyz0112.png" />
                  <AvatarFallback>WFT</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <p>成员介绍。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Avatar>
                  <AvatarImage src="https://github.com/Yuyz0112.png" />
                  <AvatarFallback>WFT</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <p>成员介绍。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Avatar>
                  <AvatarImage src="https://github.com/Yuyz0112.png" />
                  <AvatarFallback>WFT</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <p>成员介绍。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Avatar>
                  <AvatarImage src="https://github.com/Yuyz0112.png" />
                  <AvatarFallback>WFT</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <p>成员介绍。</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section id="partners" className="mb-8">
          <h3 className="text-xl font-bold mb-4">合作伙伴</h3>
          <div className="flex space-x-4">
            {/* Partner logos */}
            <img src="https://via.placeholder.com/150" alt="Partner Logo" className="h-12" />
            <img src="https://via.placeholder.com/150" alt="Partner Logo" className="h-12" />
            <img src="https://via.placeholder.com/150" alt="Partner Logo" className="h-12" />
          </div>
        </section>
      </main>
      <footer className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <span>© 2023 IDEA2APP. 版权所有。</span>
          <div className="flex space-x-4">
            <a href="#privacy" className="hover:text-blue-600">隐私政策</a>
            <a href="#terms" className="hover:text-blue-600">服务条款</a>
          </div>
        </div>
      </footer>
    </div>)
  );
}