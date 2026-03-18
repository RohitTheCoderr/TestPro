"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "@/components/sections/signup";
import Login from "@/components/sections/login";
import { Button } from "@/components/ui/button";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center h-[80vh] bg-background text-foreground">
      <div className="relative flex w-[400px] md:w-[800px] h-[600px] overflow-hidden rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-400 shadow-xl transition-colors duration-300">
        {/* Animated Form Container for small devices */}
        <div className="text-lg absolute p-2 z-40 font-bold text-gray-300 dark:text-gray-100 hover:opacity-90">
          TestPro
        </div>
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute md:hidden inset-0 p-2 flex flex-col justify-center"
            >
              <Login />
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="px-2 text-gray-500 text-sm dark:text-gray-400">
                  OR
                </span>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Don&apos;t have an account?
                </span>
                <Button
                  onClick={() => setIsLogin(false)}
                  className=" font-semibold hover:underline"
                >
                  Signup
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute md:hidden inset-0 p-2 flex flex-col justify-center"
            >
              <SignUp />
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="px-2 text-gray-500 text-sm dark:text-gray-400">
                  OR
                </span>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Already have an account?
                </span>
                <Button
                  variant="default"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* For big devices */}
        <div className="hidden md:flex">
          <div className="text-lg absolute p-2 z-40 font-bold text-gray-300 dark:text-gray-100 hover:opacity-90">
            TestPro
          </div>
          <div className="flex w-full h-full">
            {/* Signup Form */}
            <div className="w-1/2 flex items-center justify-center p-2 sm:p-4 md:p-8">
              <SignUp />
            </div>
            {/* Login Form */}
            <div className="w-1/2 flex items-center justify-center p-2 sm:p-4 md:p-8">
              <Login />
            </div>
          </div>

          {/* Sliding Overlay Content */}
          <motion.div
            initial={false}
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-white p-10 bg-gradient-to-br ${
              isLogin
                ? "from-primary to-primary"
                : "from-green-500 to-green-700"
            } bg-opacity-80 backdrop-blur-sm`}
          >
            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="mb-6 text-center">
                  Log In to continue exploring our platform.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsLogin(false)}
                  className=" hover:text-primary w-[12rem] rounded-full "
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                <p className="mb-6 text-center">
                  Sign Up to start your journey with us.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsLogin(true)}
                  className=" hover:text-green-600 w-[12rem] rounded-full "
                >
                  Log In
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
