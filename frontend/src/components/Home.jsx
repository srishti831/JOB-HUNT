import React from 'react'

import HeroSection from './HeroSection'
import { Navbar } from './shared/Navbar'
import CategoryCaraousel from './CategoryCaraousel'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>

         <CategoryCaraousel/>
        {/* <LatestJobs/> */}
        {/* <Footer/>  */}
    </div>
  )
}

export default Home