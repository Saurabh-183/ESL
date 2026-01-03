// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import ListUserPermission from '@/views/admin/role/ListUserPermission'

const ListGatePass = () => {

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListUserPermission />
      </Grid>
    </Grid>
  )
}

export default ListGatePass
