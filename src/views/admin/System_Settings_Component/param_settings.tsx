"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsForm() {
  const [autoSync, setAutoSync] = useState("");
  const [offlineTime, setOfflineTime] = useState("");
  const [retryCount, setRetryCount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handleSave = (label: string) => {
    toast.success(`${label} saved successfully`, {
      position: "top-right",
      autoClose: 1000,
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* Basic Set */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="primary">Basic Set</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Auto-Sync */}
          <Box
            sx={{ maxWidth: 500, display: "flex", alignItems: "center", mb: 3 }}
          >
            {/* Label + Dropdown */}
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Auto-Sync on Gateway Recovery
                </Typography>
                <Tooltip
                  title="Enable this to auto-sync after gateway recovers"
                  arrow
                >
                  <IconButton
                    size="small"
                    sx={{ ml: 1, p: 0 }}
                    disableRipple
                    disableFocusRipple
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <FormControl fullWidth size="small">
                <Select
                  value={autoSync}
                  onChange={(e: SelectChangeEvent) =>
                    setAutoSync(e.target.value)
                  }
                >
                  <MenuItem value="disable">Disable</MenuItem>
                  <MenuItem value="enable">Enable</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Save Button */}
            <button
              // variant="contained"
              // sx={{
              //   ml: 2,
              //   mt: 5,
              //   bgcolor: "#262262",
              //   "&:hover": {
              //     bgcolor: "#191555",
              //   },
              // }}
              onClick={() => handleSave("Auto-Sync")}
              className="bg-[#262262] text-white px-6 py-[10px] mt-6 ml-5 rounded-lg hover:cursor-pointer"
            >
              Save
            </button>
          </Box>

          {/* Tag offline time */}
          <Box
            sx={{ maxWidth: 500, display: "flex", alignItems: "center", mb: 3 }}
          >
            {/* Label with Tooltip */}
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Tag offline time setting
                </Typography>
                <Tooltip
                  title="Set duration after which a tag is marked offline"
                  arrow
                >
                  <IconButton
                    size="small"
                    sx={{ ml: 1, p: 0 }}
                    disableRipple
                    disableFocusRipple
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Dropdown */}
              <FormControl fullWidth size="small">
                <Select
                  id="offline-time-select"
                  value={offlineTime}
                  onChange={(e: SelectChangeEvent) =>
                    setOfflineTime(e.target.value)
                  }
                >
                  <MenuItem value="30">30</MenuItem>
                  <MenuItem value="60">60</MenuItem>
                  <MenuItem value="90">90</MenuItem>
                  <MenuItem value="120">120</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Unit */}
            <Typography sx={{ ml: 2, mt: 5 }}>minutes</Typography>

            {/* Save Button */}
            <button
              // variant="contained"
              // sx={{
              //   ml: 2,
              //   mt: 5,
              //   bgcolor: "#262262",
              //   "&:hover": {
              //     bgcolor: "#191555",
              //   },
              // }}
              onClick={() => handleSave("Offline Time")}
              className="bg-[#262262] text-white px-6 py-[10px] mt-6 ml-5 rounded-lg hover:cursor-pointer"
            >
              Save
            </button>
          </Box>

          {/* Retry Count */}
          <Box
            sx={{ maxWidth: 500, display: "flex", alignItems: "center", mb: 3 }}
          >
            {/* Label and Select */}
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Retry Count Setting
                </Typography>
                <Tooltip title="Number of sync retries after failure" arrow>
                  <IconButton size="small" sx={{ ml: 1, p: 0 }} disableRipple>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <FormControl fullWidth size="small">
                <Select
                  value={retryCount}
                  onChange={(e: SelectChangeEvent) =>
                    setRetryCount(e.target.value)
                  }
                >
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="twice">Twice</MenuItem>
                  <MenuItem value="three">Three Times</MenuItem>
                  <MenuItem value="four">Four Times</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Save Button */}
            <button
              // variant="contained"
              // sx={{
              //   ml: 2,
              //   mt: 5,
              //   bgcolor: "#262262",
              //   "&:hover": {
              //     bgcolor: "#191555",
              //   },
              // }}
              onClick={() => handleSave("Retry Count")}
              className="bg-[#262262] text-white px-6 py-[10px] mt-6 ml-5 rounded-lg hover:cursor-pointer"
            >
              Save
            </button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Receive Set */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="primary">Receive Set</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{ maxWidth: 500, display: "flex", alignItems: "center", mb: 3 }}
          >
            <Box sx={{ width: "100%", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2">Receiving address</Typography>
                <Tooltip title="Enter the key receiving endpoint">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={receivingAddress}
                onChange={(e) => setReceivingAddress(e.target.value)}
              />
            </Box>
            <button
              onClick={() => handleSave("Receiving Address")}
              // variant="contained"
              // sx={{ ml: 2, bgcolor: "#262262", mt: 9 }}
              className="bg-[#262262] text-white px-6 py-[10px] mt-9 ml-5 rounded-lg hover:cursor-pointer"
            >
              Save
            </button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Interface Public Key Set */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="primary">Interface Public Key Set</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{ maxWidth: 350, display: "flex", alignItems: "center", mb: 3 }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2">Fill in public key</Typography>
                <Tooltip title="Paste the system's public key here">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Please fill in the public key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </Box>
            <button
              // variant="contained"
              // sx={{
              //   ml: 2,
              //   mt: 5,
              //   bgcolor: "#262262",
              //   "&:hover": {
              //     bgcolor: "#191555",
              //   },
              // }}
              onClick={() => handleSave("Auto-Sync")}
              className="bg-[#262262] text-white px-6 py-[10px] mt-8 ml-5 rounded-lg hover:cursor-pointer"
            >
              Save
            </button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <ToastContainer />
    </Box>
  );
}
