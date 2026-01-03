// MUI Imports
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";

// Component Imports
import System_Template from "@/views/admin/system_template/page";

const SystemTemplate = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Typography variant="h4">System Template</Typography> */}
        <p className="text-[18px] font-medium"> System Template</p>
      </Grid>
      <Grid item xs={12}>
        <System_Template />
      </Grid>
    </Grid>
  );
};

export default SystemTemplate;
