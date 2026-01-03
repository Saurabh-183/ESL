"use client";

// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";

// Third-party Imports
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

// Components Imports
import CustomTextField from "@core/components/mui/TextField";

// Styled Component Imports
import type { companyObjType } from "../store/AddStore";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import { useParams, useRouter } from "next/navigation";

export type locationObjType = {
  id: number;
  locationName: string;
};

type FormValues = {
  counterCode: string;
  locationId: locationObjType | null;
  companyId: companyObjType | null;
  description: string;
  isActive: string
};

const AddCounter: React.FC = () => {
  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      counterCode: "",
      companyId: null,
      locationId: null,
      description: "",
      isActive: '1'
    },
  });
  
  

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP;

  const onSubmit = async (data: FormValues) => {
    try {
      const newData: any = { ...data };

      newData.locationId = newData.locationId?.id;
      newData.companyId = newData.companyId?.id;

      const response = await fetch(`${API_URL}/admin/create-counter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        toast.success("Counter created successfully");
        reset(); // Reset form after successful submission
      } else {
        toast.error("Failed to create counter");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const [allCompanies, setAllCompanies] = useState([]);
  const [location, setLocations] = useState([]);
  const [counterInfo, setCounterInfo] = useState({})
  const [token, setToken] = useState('')
  
  useEffect(() => {
    fetchToken()
  }, [])

  const fetchToken = async () => {
    try {
      const response = await fetch('/api/login', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setToken(result.token)
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    if (token !== "") {
      fetchAllCompanies();
    }
  }, [token]);

  useEffect(() => {
    if (watch("companyId") !== null) {
      fetchAllLocation();
    }
  }, [watch("companyId")]);

  const params:any = useParams();

  useEffect(()=>{
    if(params.id){
      fetchCounterById(+params.id[0])
    }
  },[params.id])


  const fetchAllCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/company-list`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setAllCompanies(data);
      } else {
        console.error("Failed to fetch Companies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCounterById = async (id:number) => {
    try {
      const response = await fetch(`${API_URL}/admin/counter-detail-list?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setValue("counterCode",data.counterCode)
        setValue("description",data.description)
        setValue("companyId", {id: data.company.id,companyName:data.company.name });
        setValue("locationId", {id: data.location.id,locationName:data.location.name });
        setCounterInfo(data);
      } else {
        console.error("Failed to fetch Companies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllLocation = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/location-list?companyId=${watch("companyId")?.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const newData = data.map((ele: any) => {
          return { id: ele.id, locationName: ele.locationName };
        });

        setLocations(newData);
      } else {
        console.error("Failed to fetch locations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="counterCode"
                control={control}
                rules={{ required: true, maxLength: 6 }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Counter Code*"
                    placeholder="Enter Counter Code"
                    inputProps={{ maxLength: 6 }} // HTML-level restriction
                    error={Boolean(errors.counterCode)}
                    helperText={
                      errors.counterCode?.type === "required"
                        ? "This field is required."
                        : errors.counterCode?.type === "maxLength"
                          ? "Maximum 6 characters allowed."
                          : ""
                    }
                  />
                )}
              />
            </Grid>
   
            <Grid item xs={12} sm={6}>
              <Controller
                name="companyId"
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={allCompanies}
                    id="autocomplete-controlled"
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue("companyId", newvalue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option: any) => option.companyName || ""}
                    renderInput={(params) => (
                      <CustomTextField
                        placeholder="Select Company"
                        {...params}
                        label="Company*"
                        {...(watch("companyId") === null &&
                          errors.companyId && {
                            error: true,
                            helperText: "This field is required.",
                          })}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="locationId"
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={location}
                    id="autocomplete-controlled"
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue("locationId", newvalue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option: any) => option.locationName || ""}
                    renderInput={(params) => (
                      <CustomTextField
                        placeholder="Select Store"
                        {...params}
                        label="Store*"
                        {...(watch("locationId") === null &&
                          errors.locationId && {
                            error: true,
                            helperText: "This field is required.",
                          })}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='isActive'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Active' {...field} error={Boolean(errors.isActive)}>
                    <MenuItem value='1'>Yes</MenuItem>
                    <MenuItem value='0'>No</MenuItem>
                  </CustomTextField>
                )}
              />
              {errors.isActive && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "This field is required.",
                  validate: (value) =>
                    value.trim() !== "" || "This field is required.",
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    rows={5}
                    multiline
                    label="Description"
                    placeholder="Enter Description"
                    className="w-full mt-1"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} className="flex gap-4">
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button
                variant="tonal"
                color="secondary"
                type="reset"
                onClick={() => reset()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCounter;
