// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import ListRolePermission from '@/views/admin/role/ListRolePermission'

const ListGatePass = () => {

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListRolePermission />
      </Grid>
    </Grid>
  )
}

export default ListGatePass
