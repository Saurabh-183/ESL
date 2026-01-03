// MUI Imports
import Grid from '@mui/material/Grid'

// import Typography from '@mui/material/Typography'

// Component Imports
import ProductTable from '@/views/admin/storeManagement/StoreData'

const systemData = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'>System Data</Typography> */}
        <p className='text-[18px] font-medium'>Store Data</p>
      </Grid>
      <Grid item xs={12}>
        <ProductTable/>
      </Grid>
    </Grid>
  )
}

export default systemData
