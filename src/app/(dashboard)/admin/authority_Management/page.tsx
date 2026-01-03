// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import Authority_Management from '@/views/admin/Authority_Management/page'

const AuthorityManagement = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant='h4'>Authority Management</Typography> */}
        <p className='text-[18px] font-medium'> Authority Management</p>
      </Grid>
      <Grid item xs={12}>
        <Authority_Management />
      </Grid>
    </Grid>
  )
}

export default AuthorityManagement
