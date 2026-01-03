// MUI Imports
import Grid from '@mui/material/Grid'

// Component imports
import ListCompany from '@/views/admin/company/ListCompany'

const Tables = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ListCompany />
      </Grid>
    </Grid>
  )
}

export default Tables
