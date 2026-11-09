import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Job from './Job'
import { setSavedJobs } from '@/redux/jobSlice'
import { USER_API_END_POINT } from '@/utils/constant'

// Student profile: jobs bookmarked with the "Save" button.
const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${USER_API_END_POINT}/saved`, { signal: controller.signal })
      .then((res) => { if (res.data.success) dispatch(setSavedJobs(res.data.jobs)); })
      .catch((error) => { if (!axios.isCancel(error)) console.log(error?.response?.data || error.message); });
    return () => controller.abort();
  }, [dispatch]);

  // a job un-saved from this list disappears immediately (user.savedJobs is updated by the Job card)
  const visible = (savedJobs || []).filter((job) => user?.savedJobs?.includes(job._id));

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="font-bold text-lg my-5">Saved Jobs</h1>
      {visible.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't saved any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visible.map((job) => <Job key={job._id} job={job} />)}
        </div>
      )}
    </div>
  )
}

export default SavedJobs
