import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

export const Navbar = () => {

  const {user} = useSelector(store => store.auth)
  return (
    <div className="bg-white">
      <div className="flex item-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold items-center">
            Job<span className="text-[#d40d0d]">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-12 ">
          <ul className="flex font-medium items-center gap-5">
            <li><Link to = '/'>Home</Link></li>
            <li><Link to = "/jobs">Jobs</Link></li>
            <li><Link to = "/browse">Browse</Link></li>
          </ul>
          {!user ? (
            <div className = 'flex items-center gap-2'>
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to = "/signup"><Button className = "bg-[#6a4aa6] hover:bg-[#39176f]">SignUp</Button></Link>
              
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="curson-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="grayscale"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4 space-y-2">
                  <Avatar className="curson-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"

                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Srishti Singh</h4>
                    <p className="text - sm text-muted-foreground">
                      This is my profile
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Button variant='link'><Link to = "/profile">View Profile</Link></Button>
                  </div>

                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut/>
                    <Button variant="link">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};




