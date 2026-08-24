import React from 'react'

import HeroSection from './HeroSection'
import { Navbar } from './shared/Navbar'
import CategoryCarousel from './CategoryCarousel'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>

         <CategoryCarousel/>
        {/* <LatestJobs/> */}
        {/* <Footer/>  */}
    </div>
  )
}

export default Home