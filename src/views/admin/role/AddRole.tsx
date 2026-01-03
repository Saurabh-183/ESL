"use client";

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
import { useEffect, useState } from "react";

export type FormValues = {
  roleName: string;
  isActive: boolean;
};
export interface Props {
  API_URL: string | undefined;
}

const AddRole: React.FC = () => {
  // state
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

  let API_URL = process.env.NEXT_PUBLIC_DEV_APP;
  // Hooks

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roleName: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      data.isActive = data.isActive === true;
      data.roleName = data.roleName.trim();

      const response = await fetch(`${API_URL}/admin/add-user-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json()
      if (result.message === "success" && result.status === 200) {
        toast.success("Role created successfully");
        reset(); // Reset form after successful submission
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* <Grid container spacing={6}> */}
            {/* </Grid> */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="roleName"
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Role Name*"
                    placeholder="Enter Role Name"
                    error={!!errors.roleName}
                    helperText={errors.roleName ? errors.roleName.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="isActive"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label="Active"
                    {...field}
                    error={Boolean(errors.isActive)}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </CustomTextField>
                )}
              />
              {errors.isActive && (
                <FormHelperText error>This field is required.</FormHelperText>
              )}
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

export default AddRole;
