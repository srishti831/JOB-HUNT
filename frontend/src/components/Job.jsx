import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'

const daysAgoFunction = (mongodbTime) => {
  const createdAt = new Date(mongodbTime);
  const timeDifference = new Date() - createdAt;
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const daysAgo = daysAgoFunction(job?.createdAt);
  const isSaved = !!user?.savedJobs?.includes(job?._id);

  const toggleSave = async () => {
    if (!user) {
      toast.info("Please login to save jobs");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(`${USER_API_END_POINT}/saved/${job._id}`);
      if (res.data.success) {
        dispatch(setUser({ ...user, savedJobs: res.data.savedJobs }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      <div className="flex items-center justify-between">
        <p className='text-sm text-gray-500'>{daysAgo === 0 ? "Today" : `${daysAgo} days ago`}</p>
        <Button
          onClick={toggleSave}
          variant="outline"
          className="rounded-full"
          size="icon"
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
        >
          <Bookmark className={isSaved ? "fill-current" : ""} />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Avatar className="size-10">
          <AvatarImage src={job?.company?.logo} />
          <AvatarFallback>{job?.company?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>{job?.location}</p>
        </div>
      </div>
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
      </div>
      <div className='flex flex-wrap items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant="ghost">{job?.position} Positions</Badge>
        <Badge className='text-[#d40d0d] font-bold' variant="ghost">{job?.jobType}</Badge>
        <Badge className='text-[#7209b7] font-bold' variant="ghost">{job?.salary} LPA</Badge>
      </div>
      <div className='flex items-center gap-4 mt-4'>
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
        <Button onClick={toggleSave} className="bg-[#7209b7]">{isSaved ? "Saved" : "Save For later"}</Button>
      </div>
    </div>
  )
}

export default Job
