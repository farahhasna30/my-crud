"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "./action";
import { useActionState } from "react";

export default function Home() {
  const [_, action, pending] = useActionState(loginAction, null);

  return (
    <main className="flex justify-center items-center min-h-screen px-4 py-8 relative z-10">
      <Card className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl bg-white border border-gray-100 relative z-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl"></div>

        <CardHeader className="text-center space-y-3 mb-6 pt-10">
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Hellow Food Lover!
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
            Welcome to Our Website of Meals. Explore hundreds of easy and tasty
            recipes made just for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-0 pb-6">
          <form action={action} className="space-y-6 w-full">
            <div>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 text-base"
                  placeholder="Enter your username"
                  type="text"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold text-lg py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              disabled={pending}
            >
              Let's explore
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
