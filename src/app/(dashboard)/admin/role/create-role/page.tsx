// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import AddRole from '@/views/admin/role/AddRole'

const CreateUser = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Create Role</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddRole />
      </Grid>
    </Grid>
  )
}

export default CreateUser
