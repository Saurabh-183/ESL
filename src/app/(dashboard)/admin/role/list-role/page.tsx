// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import ListRole from '@/views/admin/role/ListRole'

const ListGatePass = () => {

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListRole />
      </Grid>
    </Grid>
  )
}

export default ListGatePass
