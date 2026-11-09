import React, { useState } from 'react'
import { Navbar } from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const fields = [
  { label: "Title", name: "title", type: "text" },
  { label: "Description", name: "description", type: "text" },
  { label: "Requirements (comma separated)", name: "requirements", type: "text" },
  { label: "Salary (LPA)", name: "salary", type: "number" },
  { label: "Location", name: "location", type: "text" },
  { label: "Experience Level (years)", name: "experience", type: "number" },
  { label: "No of Positions", name: "position", type: "number" },
];

const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract", "Freelance"];

const PostJob = () => {
  useGetAllCompanies();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.companyId) {
      toast.error("Please select a company");
      return;
    }
    if (!input.jobType) {
      toast.error("Please select a job type");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const companyItems = (companies || []).map((c) => ({ value: c._id, label: c.name }));

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center w-full px-4 my-5'>
        <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {fields.map((f) => (
              <div key={f.name}>
                <Label>{f.label}</Label>
                <Input
                  type={f.type}
                  min={f.type === "number" ? 0 : undefined}
                  name={f.name}
                  value={input[f.name]}
                  onChange={changeEventHandler}
                  className="my-1"
                />
              </div>
            ))}
            <div>
              <Label>Job Type</Label>
              <select
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="my-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>Select a job type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {companyItems.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select items={companyItems} value={input.companyId || null} onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full my-1">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companyItems.map((company) => (
                        <SelectItem key={company.value} value={company.value}>
                          {company.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {loading
            ? <Button disabled className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button>
            : <Button type="submit" className="w-full my-4" disabled={companyItems.length === 0}>Post New Job</Button>}
          {companyItems.length === 0 && (
            <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a job</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default PostJob
