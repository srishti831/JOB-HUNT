import React from 'react'
import { Navbar } from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'

const skills = ["HTML", "CSS", "Javascript", "React.js"]
const isResume = true;
const Profile = () => {
  return (

    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className='flex items-center gap-4'>
            <Avatar className="h-24 w-24">
              <AvatarImage src="data:image/webp;base64,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" />
            </Avatar>
            <div >
              <h1 className='font-medium text-xl'>Full Name</h1>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos labore distinctio impedit magnam et quae delectus facilis quasi cum, quibusdam quo inventore saepe recusandae aliquid fugit? Dolorem similique iure laborum.</p>
            </div>
          </div>

          <Button className='text-right' variant="outline"><Pen /></Button>

        </div>
        <div className='my-5'>
          <div className="flex items-center gap-3">
            <Mail />
            <span>srishti@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>821361924</span>
          </div>

        </div>
        <div className="my-5">
          <h1>Skills</h1>
          <div className='flex items-center gap-1'>
            {
              skills.length != 0 ? skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
            }
          </div>


        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label classNmae="text-md font-bols">Resume</Label>
          {
            isResume ? <a target='blank' href="https://youtube.com/@patelmernstack" className="text-blue-500 w-full hover:underline cursor-pointer">Patel mern stack</a> : <span>NA</span>
          }
        </div>
       

      </div>
       <div className="max-w-4xl mx-auto bg-white rounded-2xl">
          <h1 className = "font-bold text-lg my-5">Applied Jobs</h1>
         <AppliedJobTable/>
        </div>
    </div>
  )
}

export default Profile