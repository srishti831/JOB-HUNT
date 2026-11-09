import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setJobsResult, setJobsLoading } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import { buildJobParams } from "@/utils/jobFilter";

// Loads one page of jobs for the current search keyword (+ sidebar filters when applyFilters).
// Each new request cancels the previous one, so a slow old response can never overwrite a newer one.
const useGetAllJobs = ({ limit = 12, applyFilters = true } = {}) => {
  const dispatch = useDispatch();
  const { searchedQuery, jobFilters, jobPage } = useSelector((store) => store.job);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      dispatch(setJobsLoading(true));
      try {
        const params = buildJobParams({
          filters: applyFilters ? jobFilters : {},
          keyword: searchedQuery,
          page: jobPage,
          limit,
        });
        const res = await axios.get(`${JOB_API_END_POINT}/getAllJobs?${params}`, { signal: controller.signal });
        if (res.data.success) {
          dispatch(setJobsResult({ jobs: res.data.jobs, pagination: res.data.pagination }));
        }
        dispatch(setJobsLoading(false));
      } catch (error) {
        if (axios.isCancel(error)) return; // superseded by a newer request
        console.log(error?.response?.data || error.message);
        dispatch(setJobsLoading(false));
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [dispatch, searchedQuery, jobFilters, jobPage, limit, applyFilters]);
};

export default useGetAllJobs;
