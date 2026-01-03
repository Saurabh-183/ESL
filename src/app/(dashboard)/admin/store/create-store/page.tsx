// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import AddStore from '@/views/admin/store/AddStore'

const CreateLocation = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Create Store</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddStore />
      </Grid>
    </Grid>
  )
}

export default CreateLocation
