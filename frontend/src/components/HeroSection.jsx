import { Button } from "@base-ui/react";
import React from "react";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5">
        <span className=" mx-auto px-4 py-2 rounded bg-gray-100 text-[#d40d0d] font-medium">
          No.1 Job Hunt Website
        </span>
        <h1 className="text-5xl font-bold">
          Search , Apply & <br /> Get Your
          <span className="text-[#6A38C2]"> Dream Jobs</span> </h1>
          <p>Connect with top companies, discover exciting opportunities, and take the next step toward your dream career.</p>
          <div className="flex w-[40%] shadow-lg border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
            <input
              type="text"
              placeholder="Find your dream jobs"
              className="outline-none border-none w-full"
            />
            <Button className = 'rounded-r-full bg-[#6A38C2]'>
                <Search className = 'h-6 w-6'/>
            </Button>
          </div>
       
      </div>
    </div>
  );
};

export default HeroSection;
