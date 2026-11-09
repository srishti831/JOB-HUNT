import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Navbar } from './shared/Navbar';

const JobDescription = () => {
  const params = useParams();
  const jobId = params?.id;
  const navigate = useNavigate();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch();

  // the server tells us whether the logged-in user already applied (no applicant list is sent)
  const isApplied = !!singleJob?.hasApplied;

  const applyJobHandler = async () => {
    if (!user) {
      toast.info("Please login to apply");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`);
      if (res.data.success) {
        dispatch(setSingleJob({
          ...singleJob,
          hasApplied: true,
          applicantCount: (singleJob?.applicantCount || 0) + 1,
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchSingleJob = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { signal: controller.signal });
        if (res.data.success) dispatch(setSingleJob(res.data.job));
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setNotFound(true);
        setLoading(false);
      }
    }
    fetchSingleJob();
    return () => { controller.abort(); dispatch(setSingleJob(null)); };
    // refetch when the user logs in / out so `hasApplied` stays correct
  }, [jobId, dispatch, user?._id]);

  if (!loading && (notFound || !singleJob)) {
    return (
      <div>
        <Navbar />
        <p className="max-w-7xl mx-auto my-10 px-4 text-gray-600">This job does not exist or was removed.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
              <Badge className='text-blue-700 font-bold' variant="ghost">{singleJob?.position} Positions</Badge>
              <Badge className='text-[#d40d0d] font-bold' variant="ghost">{singleJob?.jobType}</Badge>
              <Badge className='text-[#7209b7] font-bold' variant="ghost">{singleJob?.salary} LPA</Badge>
            </div>
          </div>

          {user?.role !== 'recruiter' && (
            <Button
              onClick={isApplied ? undefined : applyJobHandler}
              disabled={isApplied || loading}
              className={`rounded-lg text-amber-50 ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5a575d]'}`}>
              {isApplied ? 'Already Applied' : 'Apply Now'}
            </Button>
          )}
        </div>
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">Job Description</h1>
        <div className="my-4">
          <h1 className="font-bold my-1">Role : <span className="pl-4 font-normal text-gray-800">{singleJob?.title}</span></h1>
          <h1 className="font-bold my-1">Company : <span className="pl-4 font-normal text-gray-800">{singleJob?.company?.name}</span></h1>
          <h1 className="font-bold my-1">Location : <span className="pl-4 font-normal text-gray-800">{singleJob?.location}</span></h1>
          <h1 className="font-bold my-1">Description : <span className="pl-4 font-normal text-gray-800">{singleJob?.description}</span></h1>
          <h1 className="font-bold my-1">Requirements : <span className="pl-4 font-normal text-gray-800">{singleJob?.requirements?.join(", ")}</span></h1>
          <h1 className="font-bold my-1">Experience : <span className="pl-4 font-normal text-gray-800">{singleJob?.experienceLevel} yrs</span></h1>
          <h1 className="font-bold my-1">Salary : <span className="pl-4 font-normal text-gray-800">{singleJob?.salary} LPA</span></h1>
          <h1 className="font-bold my-1">Total Applicants : <span className="pl-4 font-normal text-gray-800">{singleJob?.applicantCount ?? 0}</span></h1>
          <h1 className="font-bold my-1">Posted Date : <span className="pl-4 font-normal text-gray-800">{singleJob?.createdAt?.split("T")[0]}</span></h1>
        </div>
      </div>
    </div>
  )
}

export default JobDescription
