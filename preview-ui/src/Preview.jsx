import { Home, User, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold">Web Fullstack Team</h1>
        </div>
        <nav className="flex space-x-4">
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#projects" className="hover:text-blue-600">Projects</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-gray-600" />
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <section id="hero" className="mb-8">
          <div className="bg-white rounded shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Building the future of the web.</h2>
              <p className="mb-4">We are a remote team of fullstack developers specializing in using open source software for outsourcing projects.</p>
              <Button variant="solid">Get Started <ArrowRight className="ml-2" /></Button>
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
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Fullstack development with modern frameworks and technologies.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>UI/UX Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Creating intuitive and responsive designs for an optimal user experience.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Efficient project management to ensure timely delivery and quality.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section id="projects" className="mb-8">
          <h3 className="text-xl font-bold mb-4">Recent Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AspectRatio ratio={16 / 9} className="w-full">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&dpr=2&q=80"
                alt="Project Image"
                className="rounded-md object-cover"
              />
            </AspectRatio>
            <AspectRatio ratio={16 / 9} className="w-full">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&dpr=2&q=80"
                alt="Project Image"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        </section>
        <section id="about" className="mb-8">
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/Yuyz0112.png" />
              <AvatarFallback>WFT</AvatarFallback>
            </Avatar>
            <div>
              <p>We are a passionate team of developers who love to create and innovate. With a focus on quality and efficiency, we strive to deliver the best solutions for our clients.</p>
            </div>
          </div>
        </section>
        <section id="contact" className="mb-8">
          <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
          <p>Interested in working with us? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.</p>
          <Button variant="solid" className="mt-4">Contact Us</Button>
        </section>
      </main>
      <footer className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <span>© 2023 Web Fullstack Team. All rights reserved.</span>
          <div className="flex space-x-4">
            <a href="#privacy" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}