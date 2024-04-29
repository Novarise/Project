import { Input } from "@/components/ui/input";
import { Button } from "./button";
import IconButton from "./icon-button";
import { Facebook, Instagram, Linkedin, Mail, Smartphone, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        <div>
          <Image src="/logo.svg" alt="Logo" className="mb-4 dark:bg-white" width={60} height={60} />
          <p>Creating a digital presence that matters.</p>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="dark:hover:text-gray-700 hover:text-gray-300"><Facebook /></Link>
            <Link href="#" className="dark:hover:text-gray-700 hover:text-gray-300"><Twitter /></Link>
            <Link href="#" className="dark:hover:text-gray-700 hover:text-gray-300"><Instagram /></Link>
            <Link href="#" className="dark:hover:text-gray-700 hover:text-gray-300"><Linkedin /></Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Shop</h5>
          <Link href="/about" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Coffee</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Merchandise</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Subscription</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Wholesale</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Company</h5>
          <Link href="/about" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >About Us</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Our Services</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Our Coffee</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Contact Us</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Partners</h5>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Web Design</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Development</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >Branding</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300" >SEO</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">Legal</h5>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300"  >Privacy Policy</Link>
          <Link href="#" className="text-md dark:hover:text-gray-700 hover:text-gray-300"  >Terms of Use</Link>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-44 bg-gray-200 dark:bg-gray-800 rounded-md">
          <div className=" rounded-md  ">
            <span className="flex text-sm mr-2 p-2">Sign up to our newsletter</span>
          </div>
          <div className="flex">
            <Input
              type="text"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-l-md py-2 px-3"
            />
            <Button className="font-bold py-2 px-4 rounded-r-md ml-2">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8">
        &copy; 2024 Store, Inc. All rights reserved.
      </div>
    </footer>
  );
};


export default Footer;