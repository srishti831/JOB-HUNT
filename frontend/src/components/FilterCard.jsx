import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setJobFilters } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Mumbai", "Pune", "Hyderabad", "Chennai"],
  },
  {
    filterType: "Industry",
    array: ["IT & Software", "Finance", "Healthcare", "E-commerce", "Education", "Marketing", "Manufacturing", "Consulting"],
  },
  {
    filterType: "Salary",
    array: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15-20 LPA", "20+ LPA"],
  },
  {
    filterType: "Job Type",
    array: ["Full Time", "Part Time", "Internship", "Contract", "Freelance"],
  },
  {
    filterType: "Experience",
    array: ["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"],
  },
  {
    filterType: "Work Mode",
    array: ["On-site", "Remote", "Hybrid"],
  },
  {
    filterType: "Education",
    array: ["Any Degree", "B.Tech / B.E.", "M.Tech / M.E.", "BCA / MCA", "MBA", "Diploma"],
  },
  {
    filterType: "Department",
    array: ["Engineering", "Sales", "Marketing", "Human Resources", "Finance", "Operations", "Design"],
  },
];

export const FilterCard = () => {
  const dispatch = useDispatch();
  const { jobFilters } = useSelector((store) => store.job);
  const hasFilters = Object.values(jobFilters || {}).some(Boolean);

  const changeHandler = (type, value) => {
    dispatch(setJobFilters({ ...jobFilters, [type]: value }));
  };

  return (
    <div className='w-full md:w-64 bg-white px-6 py-4 rounded-md'>
      <div className='flex items-center justify-between'>
        <h1 className='font-bold text-lg text-blue-800'>Filter Jobs</h1>
        {hasFilters && (
          <Button variant="ghost" size="xs" onClick={() => dispatch(setJobFilters({}))}>
            Clear
          </Button>
        )}
      </div>
      <hr className='mt-3' />
      {filterData.map((data) => (
        <div key={data.filterType} className='mt-3'>
          <h1 className="text-lg font-bold">{data.filterType}</h1>
          <RadioGroup
            value={jobFilters?.[data.filterType] ?? ""}
            onValueChange={(value) => changeHandler(data.filterType, value)}
          >
            {data.array.map((item) => (
              <Label key={item} className="flex items-center gap-2 my-1 cursor-pointer font-normal">
                <RadioGroupItem value={item} />
                {item}
              </Label>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )
}
