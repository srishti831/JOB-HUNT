import {React , useState} from "react";
import { Navbar } from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {RadioGroup} from "../ui/radio-group";
import {Button} from "@/components/ui/button"
import {Link, useNavigate} from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {

    const [input , setInput]  = useState({
            fullname : "",
            email : "",
            phoneNumber : "",
            password : "",
            role : "",
            file : ""
        });
    const navigate = useNavigate();
    
    const changeEventHandler = (e) => {
        setInput({...input , [e.target.name] : e.target.value});
    
    }
    
    
    const changeFileHandler = (e) => {
        setInput({...input , file:e.target.files?.[0]})

    }

    
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname" , input.fullname);
        formData.append("email" , input.email);
        formData.append("phoneNumber" , input.phoneNumber);
        formData.append("password" , input.password);
        formData.append("role" , input.role);
        if(input.file){
            formData.append("file" , input.file);
        }

        try{
        
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData , {
                headers : {
                    "Content-Type" : "multipart/form-data"
                },
                withCredentials:true,
            });

            if(res.data.success){
                navigate("/login");
                toast.success(res.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit = {submitHandler}
          className="w-1/2 border border-gray-200 rounded-md-4 p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label className="my-2">Full Name </Label>
            <Input type="text" value = {input.fullname} name = "fullname" onChange = {changeEventHandler} placeholder="Type your full name" />
          </div>
          <div className="my-2">
            <Label className="my-2">E-mail</Label>
            <Input type="email" value = {input.email} name = "email" onChange = {changeEventHandler} placeholder="abc@gmail.com" />
          </div>
          <div className="my-2">
            <Label className="my-2">Phone Number</Label>
            <Input type="tel" value = {input.phoneNumber} name = "phoneNumber" onChange = {changeEventHandler} placeholder="" />
          </div>
          <div className="my-2">
            <Label className="my-2">Password</Label>
            <Input type="password" value = {input.password} name = "password" onChange = {changeEventHandler} placeholder="" />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup  className="flex item-center gap-4 m-5 w-fit">
              <div className="flex items-center gap-3">
               <Input
                type = "radio"
                name = "role"
                value = "student"
                checked={input.role === 'student'}
                onChange = {changeEventHandler}
                className = "cursor-pointer"
               />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center gap-3">
                 <Input
                type = "radio"
                name = "role"
                value = "recruiter"
                checked={input.role === 'recruiter'}
                onChange = {changeEventHandler}
                className = "cursor-pointer"
               />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          
            <div className = "flex items-center gap-2">
            <Label>Profile</Label>
            <Input
                accept = "image/*"
                type = "file"
                onChange = {changeFileHandler}
                className = "cursor-pointer"
            />
          </div>
        </div>

        <Button type = "submit"  className = 'w-full my-4'>Signup</Button>
        <span className = "text-sm">Already have an account? <Link to ="/login" className = "text-blue-600">Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
