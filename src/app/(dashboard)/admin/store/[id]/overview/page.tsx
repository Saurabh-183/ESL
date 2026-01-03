// MUI Imports
import Grid from '@mui/material/Grid'

// import Typography from '@mui/material/Typography'

// Component Imports
import StoreOverview from '@/views/admin/store/[id]/overview/page'

const Overview = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'> Store Overview</Typography> */}
      </Grid>
      <Grid item xs={12}>
       <StoreOverview/>
      </Grid>
    </Grid>
  )
}

export default Overview
