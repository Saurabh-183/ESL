// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import StoreManagement from '@/views/admin/storeManagement/page'

const storeManagement = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'>Store Management</Typography> */}
        <p className='text-[18px] font-medium'> Store Management</p>
      </Grid>
      <Grid item xs={12}>
        <StoreManagement/>
      </Grid>
    </Grid>
  )
}

export default storeManagement
