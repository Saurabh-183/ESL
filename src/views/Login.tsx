"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

// Third-party
import classnames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Components
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Hooks
import { useSettings } from "@core/hooks/useSettings";

export type FormValues = {
  username: string;
  password: string;
};

const LoginV2: React.FC = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const router = useRouter();
  const { settings } = useSettings();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleClickShowPassword = () =>
    setIsPasswordShown((show) => !show);

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP;

  // -------------------- LOGIN HANDLER --------------------
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "Login failed");
        return;
      }

      // Fetch user details using access token
      const userDetails = await FetchUserDetails(result.accessToken);

      if (userDetails) {
        localStorage.setItem("ESL-User-Details", JSON.stringify(userDetails));
      }

      // Store token in cookies (Next.js API)
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: result.accessToken }),
      });

      toast.success("Login successfully");
      reset();
      router.push("/");
    } catch (error) {
      console.error("Error while login:", error);
      toast.error("Failed to login");
    }
  };

  // -------------------- USER PROFILE FETCH --------------------
  const FetchUserDetails = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/user-profile`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data.userProfile;
      } else {
        console.error("Failed to fetch user profile:", data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }

    return null;
  };

  return (
    <div className="flex bs-full justify-center p-4">
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1",
          { "border-ie": settings.skin === "bordered" }
        )}
      >
        <div className="border px-6 py-6 sm:px-8 sm:py-8 rounded-2xl shadow-sm w-[90%] sm:w-[75%] md:w-[50%] lg:w-[33%]">
          <div className="flex flex-col mb-6 text-center sm:text-start">
            <Typography className="font-semibold text-[#1A342C] text-xl">
              Welcome to SignESL!
            </Typography>
            <Typography className="text-sm font-medium">
              Continue your online business with SignESL.
            </Typography>
          </div>

          {/* FORM */}
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* USERNAME */}
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Username"
                  placeholder="Enter username"
                  error={!!errors.username}
                  helperText={errors.username && "This field is required."}
                />
              )}
            />

            {/* PASSWORD */}
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Password"
                  placeholder="············"
                  id="login-password"
                  type={isPasswordShown ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              isPasswordShown ? "tabler-eye" : "tabler-eye-off"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.password}
                  helperText={errors.password && "This field is required."}
                />
              )}
            />
            <div className="flex flex-wrap justify-end items-center gap-3">
              <Typography className="cursor-pointer hover:underline">
                Forgot password?
              </Typography>
            </div>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              className="text-white rounded-full my-4"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>

      <div className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
        <Logo />
      </div>
    </div>
  );
};

export default LoginV2;
