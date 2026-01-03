'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports

import Statistics from '@/views/admin/statistics/data_change/page';

const StaticalAnalysis = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'>Statical Analysis</Typography> */}
        <p className='text-[18px] font-medium'>Statical Analysis</p>
      </Grid>
      <Grid item xs={12}>
        <Statistics  />
        {/* hello */}
      </Grid>
    </Grid>
  )
}

export default StaticalAnalysis
