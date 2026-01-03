// MUI Imports
import Grid from '@mui/material/Grid'

// Component imports
import ListUser from '@/views/admin/user/ListUser'

const UserTables = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ListUser />
      </Grid>
    </Grid>
  )
}

export default UserTables
