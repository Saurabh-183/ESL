// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import AddPermission from '@/views/admin/role/AddPermission'

const CreateUser = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Create Permission</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddPermission />
      </Grid>
    </Grid>
  )
}

export default CreateUser
