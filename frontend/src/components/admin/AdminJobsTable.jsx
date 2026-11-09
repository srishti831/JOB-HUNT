import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filterJobs = (allAdminJobs || []).filter((job) => {
    if (!searchJobByText) return true;
    const q = searchJobByText.toLowerCase();
    return job?.title?.toLowerCase().includes(q) || job?.company?.name?.toLowerCase().includes(q);
  });

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job and all of its applications? This cannot be undone.")) return;
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/${jobId}`);
      if (res.data.success) {
        dispatch(setAllAdminJobs(allAdminJobs.filter((j) => j._id !== jobId)));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No jobs found. Click "New Job" to post one.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>{job?.applicantCount ?? 0}</TableCell>
                <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger className="cursor-pointer"><MoreHorizontal /></PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className='flex items-center gap-2 w-fit cursor-pointer'>
                        <Eye className='w-4' />
                        <span>Applicants</span>
                      </div>
                      <div
                        onClick={() => deleteJob(job._id)}
                        className='flex items-center gap-2 w-fit cursor-pointer text-red-600 mt-2'>
                        <Trash2 className='w-4' />
                        <span>Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable
