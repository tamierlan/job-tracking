import React, { useState } from 'react';
import {
  CircularProgress,
  Button,
  IconButton,
  makeStyles,
  Box,
  Grid,
  FilledInput,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  skillChip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    fontSize: '14.5px',
    borderRadius: '5px',
    fontWeight: 600,
    border: `1px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: '#fff'
    }
  },
  included: {
    backgroundColor: theme.palette.secondary.main,
    color: '#fff'
  }
}))

const initState = {
  title: '',
  type: 'Full time',
  companyName: '',
  companyUrl: '',
  location: 'Remote',
  link: '',
  description: '',
  skills: []
}

export default (props) => {
  const [ loading, setLoading ] = useState(false);
  const [ jobDetails, setJobDetails ] = useState(initState);

  const handleChange = e => {
    e.persist();
    setJobDetails(oldState => ({ ...oldState, [e.target.name]: e.target.value }))
  }

  const addRemoveSkill = skill => {
    jobDetails.skills.includes(skill)
    ?
    setJobDetails(oldState => ({ ...oldState, skills: oldState.skills.filter(s => s !== skill) }))
    :
    setJobDetails(oldState => ({ ...oldState, skills: oldState.skills.concat(skill) }))
  }

  const handleSubmit = async () => {
    for (const field in jobDetails) {
      if (typeof jobDetails[field] === 'string' && !jobDetails[field]) return;
    }
    if (!jobDetails.skills.length) return;

    setLoading(true)
    await props.postJob(jobDetails);
    setTimeout(() => closeModal(), 700)
  }

  const closeModal = () => {
    setJobDetails(initState)
    setLoading(false)
    props.closeModal()
  }

  const skills = [
    'JavaScript',
    'React',
    'Node',
    'Vue',
    'Firebase',
    'MongoDB',
    'SQL'
  ]

  const classes = useStyles();
  return (
    <Dialog open={props.newJobModal} fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          Post Job
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid spacing={2} container>

          <Grid item xs={6}>
            <FilledInput
              onChange={handleChange}
              name='title'
              value={jobDetails.title}
              autoComplete='off'
              fullWidth placeholder='Job title'
              disableUnderline />
          </Grid>

          <Grid item xs={6}>
            <Select
              onChange={handleChange}
              name='type'
              value={jobDetails.type}
              fullWidth
              variant='filled'
              disableUnderline>
                <MenuItem value='Full time'>Full time</MenuItem>
                <MenuItem value='Part time'>Part time</MenuItem>
                <MenuItem value='Contact'>Contact</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6}>
            <FilledInput
              onChange={handleChange}
              name='companyName'
              value={jobDetails.companyName}
              autoComplete='off'
              fullWidth
              placeholder='Company name'
              disableUnderline />
          </Grid>

          <Grid item xs={6}>
            <FilledInput
              onChange={handleChange}
              name='companyUrl'
              value={jobDetails.companyUrl}
              autoComplete='off'
              fullWidth
              placeholder='Company URL'
              disableUnderline />
          </Grid>

          <Grid item xs={6}>
            <Select
              onChange={handleChange}
              name='location'
              value={jobDetails.location}
              fullWidth
              variant='filled'
              disableUnderline>
                <MenuItem value='Remote'>Remote</MenuItem>
                <MenuItem value='In-office'>In-office</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6}>
            <FilledInput
              onChange={handleChange}
              name='link'
              value={jobDetails.link}
              autoComplete='off'
              fullWidth
              placeholder='Job Link'
              disableUnderline />
          </Grid>

          <Grid item xs={12}>
            <FilledInput
              onChange={handleChange}
              name='description'
              value={jobDetails.description}
              autoComplete='off'
              fullWidth
              placeholder='Job description'
              disableUnderline
              multiline
              rows={3} />
          </Grid>

        </Grid>
        <Box mt={2}>
          <Typography>Skills</Typography>
          <Box display='flex'>
            {skills.map(skill => (
              <Box onClick={() => addRemoveSkill(skill)} className={`${classes.skillChip} ${jobDetails.skills.includes(skill) && classes.included}`} key={skill}>{skill}</Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box color='red' width='100%' display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='caption'>Required fields</Typography>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            variant='contained'
            disableElevation
            color='primary'>
            { loading
              ?
              <CircularProgress color='secondary' size={22} />
              :
              'Post job'
            }
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
