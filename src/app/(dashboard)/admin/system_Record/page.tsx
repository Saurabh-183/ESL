// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import System_Record from '@/views/admin/systemRecord/page'

const SystemRecord = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>System Record</Typography>
      </Grid>
      <Grid item xs={12}>
        <System_Record/>
      </Grid>
    </Grid>
  )
}

export default SystemRecord
