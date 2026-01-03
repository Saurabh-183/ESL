// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import SystemData from '@/views/admin/system_data/page'

const systemData = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'>System Data</Typography> */}
        <p className='text-[18px] font-medium'> System Data</p>
      </Grid>
      <Grid item xs={12}>
        <SystemData />
      </Grid>
    </Grid>
  )
}

export default systemData
