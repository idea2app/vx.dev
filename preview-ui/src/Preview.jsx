import { Home, ShoppingCart, Clipboard, MessageSquare, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselPrevious, CarouselContent, CarouselItem, CarouselNext } from '@/components/ui/carousel';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import React from 'react';

export default function Prototype() {
  return (
    <div className="flex flex-col">
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <Home className="w-6 h-6 text-green-500" />
        <h1 className="text-xl font-bold">Idea2 商城</h1>
        <ShoppingCart className="w-6 h-6 text-green-500" />
      </div>

      {/* Search Box */}
      <div className="p-4 bg-gray-100">
        <Input placeholder="搜索您想要的..." className="w-full p-2 rounded" />
      </div>

      {/* Carousel Animation */}
      <div className="relative w-full">
        <Carousel>
          <CarouselPrevious className="absolute left-0 z-10 p-2 bg-white rounded-full shadow" />
          <CarouselContent>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                alt="Featured Product"
                className="object-cover w-full"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&dpr=2&q=80"
                alt="Featured Product"
                className="object-cover w-full"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&dpr=2&q=80"
                alt="Featured Product"
                className="object-cover w-full"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselNext className="absolute right-0 z-10 p-2 bg-white rounded-full shadow" />
        </Carousel>
      </div>

      {/* Secondary Navigation Bar */}
      <NavigationMenu>
        <NavigationMenuList className="flex justify-around p-4 bg-white">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex flex-col items-center">
              <Clipboard className="w-6 h-6 text-green-500" />
              <span className="text-xs">新品推荐</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex flex-col items-center">
              <MessageSquare className="w-6 h-6 text-green-500" />
              <span className="text-xs">热销排行</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex flex-col items-center">
              <Star className="w-6 h-6 text-green-500" />
              <span className="text-xs">本周特惠</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex flex-col items-center">
              <Clipboard className="w-6 h-6 text-green-500" />
              <span className="text-xs">会员专享</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Featured Recommendations */}
      <div className="p-4">
        <h2 className="mb-2 text-lg font-bold">精选推荐</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>蛋糕草莓甜品</CardTitle>
              <CardDescription>已售出 536件</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1606851091850-bf92f8a81419?w=800&dpr=2&q=80"
                alt="Cake"
                className="object-cover w-full rounded"
              />
            </CardContent>
            <CardFooter>
              <p className="text-xl font-bold text-green-500">¥136</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>时尚手提包</CardTitle>
              <CardDescription>限时折扣</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&dpr=2&q=80"
                alt="Handbag"
                className="object-cover w-full rounded"
              />
            </CardContent>
            <CardFooter>
              <p className="text-xl font-bold text-green-500">¥299</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>智能手环</CardTitle>
              <CardDescription>健康生活从这里开始</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&dpr=2&q=80"
                alt="Smart Band"
                className="object-cover w-full rounded"
              />
            </CardContent>
            <CardFooter>
              <p className="text-xl font-bold text-green-500">¥199</p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-white">
        <div className="flex justify-around p-4">
          <Home className="w-6 h-6 text-gray-600" />
          <Clipboard className="w-6 h-6 text-gray-600" />
          <MessageSquare className="w-6 h-6 text-gray-600" />
          <Star className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
}