// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import AddUser from '@/views/admin/user/AddUser'

const CreateUser = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Create User</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddUser />
      </Grid>
    </Grid>
  )
}

export default CreateUser
