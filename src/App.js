import React, { useState, useEffect } from "react";
import { Close as CloseIcon } from '@material-ui/icons';
import { Box, ThemeProvider, Grid, CircularProgress, Button } from "@material-ui/core";
import theme from './theme/theme';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import JobCard from './components/Job/JobCard';
import NewJobNodal from './components/Job/NewJobModal';
import ViewJobModal from './components/Job/ViewJobModal';
import { firestore, app } from './firebase/config';

export default () => {
  const [ jobs, setJobs ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ customSearch, setCustomSearch ] = useState(false)
  const [ newJobModal, setNewJobModal ] = useState(false);
  const [ viewJob, setViewJob ] = useState({});

  const fetchJobs = async () => {
    setCustomSearch(false)
    setLoading(true)
    const req = await firestore
    .collection('jobs')
    .orderBy('postedOn', 'desc')
    .get();
    const tempJobs = req.docs.map((job) => ({...job.data(), id: job.id, postedOn: job.data().postedOn.toDate()}))
    setJobs(tempJobs);
    setTimeout(() => setLoading(false), 600)
  };

  const fetchJobsCustom = async jobSearch =>  {
    setLoading(true);
    setCustomSearch(true);
    const req = await firestore
    .collection('jobs')
    .orderBy('postedOn', 'desc')
    .where('location', '==', jobSearch.location)
    .where('type', '==', jobSearch.type)
    .get();
    const tempJobs = req.docs.map((job) => ({...job.data(), id: job.id, postedOn: job.data().postedOn.toDate()}))
    setJobs(tempJobs);
    setTimeout(() => setLoading(false), 600)
  }

  const postJob = async jobDetails => {
    await firestore.collection('jobs').add({
      ...jobDetails,
      postedOn: app.firestore.FieldValue.serverTimestamp()
    });
    fetchJobs();
  }

  useEffect(() => {
    fetchJobs();
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Header openNewJobModal={() => setNewJobModal(true)} />
      <NewJobNodal
        closeModal={() => setNewJobModal(false)}
        newJobModal={newJobModal}
        postJob={postJob} />
      <ViewJobModal job={viewJob} closeModal={() => setViewJob({})} />
      <Box mb={3}>
        <Grid container justify='center'>
          <Grid item xs={10}>
            <SearchBar fetchJobsCustom={fetchJobsCustom} />
            {
              loading
              ?
                <Box display='flex' justifyContent='center'><CircularProgress /></Box>
              :
                <>
                  { customSearch &&
                    <Box my={2} display='flex' justifyContent='flex-end'>
                      <Button onClick={fetchJobs}>
                        <CloseIcon size={20} />
                        Custom Search
                      </Button>
                    </Box>
                  }
                  {jobs.map(job => <JobCard open={() => setViewJob(job)} key={job.id} {...job} />)}
                </>
            }
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
};
