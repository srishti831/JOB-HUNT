import React from "react";
import LatestJobsCards from "./LatestJobsCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
    const { latestJobs } = useSelector(store => store.job);
    return (
        <div className="max-w-7xl mx-auto my-20 px-4">
            <h1 className="text-3xl font-bold">
                <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
                {
                    latestJobs.length <= 0 ? <span>No jobs available</span> : latestJobs.map((job) => <LatestJobsCards key={job._id} job={job}/>)
                }
            </div>
        </div>
    );
};

export default LatestJobs;
