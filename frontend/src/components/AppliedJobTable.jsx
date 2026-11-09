import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'

const statusColor = {
  accepted: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  pending: 'bg-gray-400 text-white',
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const withdraw = async (applicationId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      const res = await axios.delete(`${APPLICATION_API_END_POINT}/${applicationId}`);
      if (res.data.success) {
        dispatch(setAllAppliedJobs(allAppliedJobs.filter((a) => a._id !== applicationId)));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // applications whose job no longer exists are hidden
  const rows = (allAppliedJobs || []).filter((a) => a?.job);

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                You haven't applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                <TableCell>{appliedJob?.job?.title}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name}</TableCell>
                <TableCell>
                  <Badge className={statusColor[appliedJob?.status] || statusColor.pending}>
                    {appliedJob?.status?.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {appliedJob?.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={() => withdraw(appliedJob._id)}>Withdraw</Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable
