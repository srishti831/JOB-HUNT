import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from './shared/Navbar'
import { Button } from './ui/button'

const NotFound = () => (
  <div>
    <Navbar />
    <div className="max-w-xl mx-auto text-center my-24">
      <h1 className="text-6xl font-bold text-[#6A38C2]">404</h1>
      <p className="my-4 text-gray-600">The page you are looking for doesn't exist.</p>
      <Link to="/"><Button>Go to Home</Button></Link>
    </div>
  </div>
)

export default NotFound
