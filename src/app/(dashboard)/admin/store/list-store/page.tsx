// MUI Imports
import Grid from '@mui/material/Grid'

// Component imports
import ListLocation from '@/views/admin/store/ListStore'

const LocationTable = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ListLocation/>
      </Grid>
    </Grid>
  )
}

export default LocationTable
