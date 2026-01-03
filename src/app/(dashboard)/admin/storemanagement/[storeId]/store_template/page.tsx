// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports

import StoreTemplate from '@/views/admin/storeManagement/storeTemplate'

const SystemTemplate = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Store Template</Typography>
      </Grid>
      <Grid item xs={12}>
        <StoreTemplate/>
      </Grid>
    </Grid>
  )
}

export default SystemTemplate
