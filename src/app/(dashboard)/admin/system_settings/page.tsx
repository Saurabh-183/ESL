// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import System_settings from '@/views/admin/system_settings/page'

const SystemSettings = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>System Settings</Typography>
      </Grid>
      <Grid item xs={12}>
      <System_settings/>
      </Grid>
    </Grid>
  )
}

export default SystemSettings
