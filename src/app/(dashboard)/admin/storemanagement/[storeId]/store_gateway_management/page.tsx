// MUI Imports
import Grid from "@mui/material/Grid";

import ListStoreGatewayManagement from "@/views/admin/storeManagement/ListStoreGatewayManagement";
import { Typography } from "@mui/material";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const StoreGatewayManagementPage = () => {
    const token = cookies().get('token')?.value
    if(!token){
        redirect('/login')
    }
  return (
    <Grid container spacing={6}>
        
      <Grid item xs={12}>
        <Typography variant='h5'> Store Overview</Typography>
        <ListStoreGatewayManagement ansh={token!} />
      </Grid>
    </Grid>
  );
};

export default StoreGatewayManagementPage;
