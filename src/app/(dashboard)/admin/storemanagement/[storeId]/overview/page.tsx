// MUI Imports
import StoreOverview from '@/views/admin/storeManagement/Overview'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports

const Overview = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'> Store Overview</Typography> */}
        <p className='text-[18px] font-medium'> Store OverView</p>
      </Grid>
      <Grid item xs={12}>
       <StoreOverview/>
      </Grid>
    </Grid>
  )
}

export default Overview
