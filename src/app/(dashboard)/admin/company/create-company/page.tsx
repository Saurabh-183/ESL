// MUI Imports
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

// Component Imports
import AddCompany from '@/views/admin/company/AddCompany'

const CreateCompany = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Create Company</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddCompany />
      </Grid>
    </Grid>
  )
}

export default CreateCompany
