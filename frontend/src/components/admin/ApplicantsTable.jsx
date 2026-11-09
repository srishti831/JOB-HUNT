import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { setAllApplicants } from '@/redux/applicationSlice';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const statusColor = {
  accepted: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  pending: 'bg-gray-400 text-white',
};

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        // reflect the new status in the table without refetching
        const updated = {
          ...applicants,
          applications: applicants.applications.map((app) =>
            app._id === id ? { ...app, status: status.toLowerCase() } : app
          ),
        };
        dispatch(setAllApplicants(updated));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of users who applied for this job</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullname}</TableCell>
              <TableCell>{item?.applicant?.email}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber}</TableCell>
              <TableCell>
                {item.applicant?.profile?.resume
                  ? <a className="text-blue-600 cursor-pointer" href={item.applicant.profile.resume} target="_blank" rel="noopener noreferrer">{item.applicant.profile.resumeOriginalName || "Resume"}</a>
                  : <span>NA</span>}
              </TableCell>
              <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
              <TableCell>
                <Badge className={statusColor[item?.status] || statusColor.pending}>{item?.status}</Badge>
              </TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger className="cursor-pointer"><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status) => (
                      <div
                        onClick={() => statusHandler(status, item?._id)}
                        key={status}
                        className='flex w-fit items-center my-1 cursor-pointer'>
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicantsTable
