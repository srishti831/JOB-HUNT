import React, { useEffect } from 'react'
import { Navbar } from './shared/Navbar'
import Job from './Job'
import Pagination from './shared/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery, setJobPage } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
  // search results only depend on the keyword, not on the sidebar filters of the /jobs page
  useGetAllJobs({ applyFilters: false });
  const { allJobs, pagination, jobsLoading, jobPage, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  // clear the search text when leaving the page
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    }
  }, [dispatch]);

  const changePage = (page) => {
    dispatch(setJobPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10 px-4'>
        <h1 className='font-bold text-xl my-10'>
          Search Results ({pagination.total}){searchedQuery ? ` for "${searchedQuery}"` : ""}
        </h1>
        {!jobsLoading && allJobs.length === 0 && <p className='text-gray-500'>No jobs found.</p>}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${jobsLoading ? 'opacity-50' : ''}`}>
          {allJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
        <Pagination page={jobPage} totalPages={pagination.totalPages} onChange={changePage} />
      </div>
    </div>
  )
}

export default Browse
