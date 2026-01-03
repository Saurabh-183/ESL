// MUI Imports
import Grid from "@mui/material/Grid";

import ListStoreDeviceManagement from "@/views/admin/storeManagement/ListStoreDeviceManagement";
import { Typography } from "@mui/material";

const StoreDeviceManagementPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
         <Typography variant='h5'> Store Device Management</Typography>
        <ListStoreDeviceManagement />
      </Grid>
    </Grid>
  );
};

export default StoreDeviceManagementPage;
