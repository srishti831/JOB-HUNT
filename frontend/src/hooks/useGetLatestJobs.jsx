import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLatestJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

// Home page: only the 6 newest jobs are fetched (instead of the whole collection).
const useGetLatestJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getAllJobs?limit=6`, { signal: controller.signal });
        if (res.data.success) dispatch(setLatestJobs(res.data.jobs));
      } catch (error) {
        if (!axios.isCancel(error)) console.log(error?.response?.data || error.message);
      }
    };
    fetchLatest();
    return () => controller.abort();
  }, [dispatch]);
};

export default useGetLatestJobs;
