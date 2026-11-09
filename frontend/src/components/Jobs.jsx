import React, { useEffect } from 'react'
import { Navbar } from './shared/Navbar'
import { FilterCard } from './FilterCard'
import Job from './Job';
import Pagination from './shared/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setJobPage } from '@/redux/jobSlice';

const Jobs = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const { allJobs, pagination, jobsLoading, jobPage } = useSelector((store) => store.job);

  // coming back to this page later should start from page 1 again
  useEffect(() => () => { dispatch(setJobPage(1)); }, [dispatch]);

  const changePage = (page) => {
    dispatch(setJobPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5 px-4'>
        <div className="flex flex-col md:flex-row gap-5">
          <div className='shrink-0'>
            <FilterCard />
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm text-gray-500 mb-3'>
              {jobsLoading && allJobs.length === 0 ? 'Loading jobs...' : `${pagination.total} job${pagination.total === 1 ? '' : 's'} found`}
            </p>

            {!jobsLoading && allJobs.length === 0 ? (
              <span>Job not found</span>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${jobsLoading ? 'opacity-50' : ''}`}>
                {allJobs.map((job) => (
                  <Job key={job?._id} job={job} />
                ))}
              </div>
            )}

            <Pagination page={jobPage} totalPages={pagination.totalPages} onChange={changePage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jobs
