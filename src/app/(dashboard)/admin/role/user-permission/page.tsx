// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import UserPermission from '@/views/admin/role/UserPermission'

const CreateUser = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>User Permission</Typography>
      </Grid>
      <Grid item xs={12}>
        <UserPermission />
      </Grid>
    </Grid>
  )
}

export default CreateUser
