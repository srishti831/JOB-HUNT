import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Mumbai", "Pune", "Hyderabad", "Chennai", "Gurgaon", "Noida"],
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
    return (
        <div className = 'w-64  bg-white px-6 py-4 rounded-md'>
            <h1 className = 'font-bold text-lg text-blue-800'>Filter Jobs</h1>
            <hr className = 'mt-3'/>
            <RadioGroup>
                {
                    filterData.map((data, index) => (
                        <div>
                            <h1 className = "text-lg font-bold">{data.filterType}</h1>
                            {
                                data.array.map((item , index) => {
                                    return (
                                        <div className = "flex items-center space-x-2 my-2">
                                            <RadioGroupItem value = {item}/>
                                            <Label>{item}</Label>
                                            </div>
                                    )
                                })
                            }
                            </div>
                    ))
        
                }
            </RadioGroup>
        </div>
    )
}
