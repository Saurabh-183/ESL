"use client";

// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import DialogCloseButton from "../DialogCloseButton";
import CustomTextField from "@core/components/mui/TextField";
import type { CompanyTypes } from "@/views/admin/company/ListCompany";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";

type EditCompanyProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: CompanyTypes;
  API_URL: string | undefined;
  UpdateCompany: any;
};

const EditCompany = ({
  open,
  setOpen,
  data,
  API_URL,
  UpdateCompany,
}: EditCompanyProps) => {
  // States
  const [userData, setUserData] = useState<CompanyTypes>(data);
  const [states, setStates] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data) {
      setUserData(data);
      fetchState(data);
    }
  }, [data, open]);

  const fetchState = async (newdata: any) => {
    try {
      const response = await fetch(`${API_URL}/admin/state-list`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const newData = data.map((ele: any) => {
          if (
            ele.id === +newdata.companyState ||
            ele.stateName === newdata.companyState
          ) {
            setUserData({ ...newdata, companyState: ele });
          }

          return { id: ele.id, stateName: ele.stateName };
        });

        setStates(newData);
      } else {
        console.error("Failed to fetch locations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth="md"
      scroll="body"
      sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className="tabler-x" />
      </DialogCloseButton>
      <DialogTitle
        variant="h4"
        className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16"
      >
        Update Company
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const newData: any = { ...userData };

          newData.companyState = newData.companyState.stateName;

          UpdateCompany(newData);
        }}
      >
        <DialogContent className="overflow-visible pbs-0 sm:pli-16">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Company Name"
                placeholder="Enter Company Name"
                value={userData?.companyName}
                onChange={(e) =>
                  setUserData({ ...userData, companyName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Company Address 1"
                placeholder="Enter Company Address 1"
                value={userData?.companyAddress1}
                onChange={(e) =>
                  setUserData({ ...userData, companyAddress1: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Company Address 2"
                placeholder="Enter Company Address 2"
                value={userData?.companyAddress2}
                onChange={(e) =>
                  setUserData({ ...userData, companyAddress2: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Company City"
                placeholder="Enter Company City"
                value={userData?.companyCity}
                onChange={(e) =>
                  setUserData({ ...userData, companyCity: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                fullWidth
                options={states}
                id="autocomplete-controlled"
                value={userData?.companyState}
                onChange={(e: any, newvalue: any) => {
                  setUserData({ ...userData, companyState: newvalue });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.stateName === value.stateName ||
                  option.stateName === value
                }
                getOptionLabel={(option: any) => option.stateName || ""}
                renderInput={(params) => (
                  <CustomTextField
                    placeholder="Select State"
                    {...params}
                    label="State"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Active"
                value={userData?.isActive}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    isActive: e.target.value == "true",
                  })
                }
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit">
            Update
          </Button>
          <Button
            variant="tonal"
            color="secondary"
            type="reset"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCompany;
