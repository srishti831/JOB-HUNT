import React from "react";
import LatestJobsCards from "./LatestJobsCards";

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];
const LatestJobs = () => {
    return (
        <div className="max-w-7xl mx-auto my-20">
            <h1 className="text-3xl font-bold">
                <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
            </h1>
            {/* multiple job cards display here */}
            <div className="grid grid-cols-3 gap-4 my-5">
                {
                    randomJobs.slice(0,6).map((item, index) => <LatestJobsCards />)
                }
            </div>
        </div>
    );
};

export default LatestJobs;
