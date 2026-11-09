import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    // paginated list used by /jobs and /browse
    allJobs: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
    jobsLoading: true, // first fetch starts right after mount; avoids a flash of "no jobs"
    jobPage: 1,
    searchedQuery: "",
    jobFilters: {},
    // home page "latest jobs"
    latestJobs: [],
    // recruiter
    allAdminJobs: [],
    searchJobByText: "",
    // student
    allAppliedJobs: [],
    savedJobs: [],
    singleJob: null,
  },
  reducers: {
    setJobsResult: (state, action) => {
      state.allJobs = action.payload.jobs;
      state.pagination = action.payload.pagination;
    },
    setJobsLoading: (state, action) => {
      state.jobsLoading = action.payload;
    },
    setJobPage: (state, action) => {
      state.jobPage = action.payload;
    },
    // a new search / new filters always start again from the first page
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
      state.jobPage = 1;
    },
    setJobFilters: (state, action) => {
      state.jobFilters = action.payload;
      state.jobPage = 1;
    },
    setLatestJobs: (state, action) => {
      state.latestJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
  },
});

export const {
  setJobsResult,
  setJobsLoading,
  setJobPage,
  setSearchedQuery,
  setJobFilters,
  setLatestJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSavedJobs,
} = jobSlice.actions;
export default jobSlice.reducer;
