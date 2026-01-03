// MUI Imports
import Grid from '@mui/material/Grid'

// Component imports

import Dashboard from '@/views/admin/Blue_dashboard/page'

const dashboard = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
       <Dashboard/>
      </Grid>
    </Grid>
  )
}

export default dashboard
