import React from 'react'

import HeroSection from './HeroSection'
import { Navbar } from './shared/Navbar'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'
import useGetLatestJobs from '@/hooks/useGetLatestJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
  useGetLatestJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if(user?.role === 'recruiter'){
      navigate('/admin/companies');
    }
  } , []);

  return (
    <div>
        <Navbar/>
        <HeroSection/>

         <CategoryCarousel/>
        <LatestJobs/>
        <Footer/> 
    </div>
  )
}

export default Home