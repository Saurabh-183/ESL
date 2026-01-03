"use client";

import React, { useState } from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AiOutlineCloudUpload,
  AiOutlineReload,
  AiOutlineColumnHeight,
  AiOutlineMore,
  AiOutlineLink,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { FiBattery } from "react-icons/fi";
import { WiBarometer } from "react-icons/wi";
import { Button } from "@/components/ui/Button";

type Device = {
  id: number;
  mac: string;
  size: string;
  rssi: number;
  battery: number;
  status: "Online" | "Offline";
  dataId: string;
};

export default function DeviceManagement() {
  const [rows, setRows] = useState<Device[]>([
    {
      id: 1,
      mac: "khft0100003f",
      size: "4.2",
      rssi: -50,
      battery: 95,
      status: "Offline",
      dataId: "1234",
    },
    {
      id: 2,
      mac: "c300002623e4",
      size: "3.5",
      rssi: -90,
      battery: 60,
      status: "Offline",
      dataId: "23",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deviceType, setDeviceType] = useState("ESL");
  const [selected, setSelected] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newMac, setNewMac] = useState("");


  const filteredRows = rows.filter((r) => {
    const matchSearch =
      r.mac.toLowerCase().includes(search.toLowerCase()) ||
      r.dataId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchDevice = deviceType === "ESL" || r.size === deviceType;
    return matchSearch && matchStatus && matchDevice;
  });

  const handleSelection = (ids: GridRowSelectionModel) => {
    if (Array.isArray(ids)) setSelected(ids.map(Number));
  };

  const handleDeleteClick = (id?: number) => {
    setIsBulkDelete(!id); 
    setDeleteTargetId(id ?? null);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      setRows((prev) => prev.filter((r) => !selected.includes(r.id)));
      toast.error(`${selected.length} row(s) deleted`);
      setSelected([]);
    } else if (deleteTargetId !== null) {
      setRows((prev) => prev.filter((r) => r.id !== deleteTargetId));
      toast.error("Row deleted");
    }

    setOpenConfirmDialog(false);
    setDeleteTargetId(null);
  };

  const handleMore = (action: string) => {
    if (selected.length !== 1)
      return toast.warning("Select exactly one device");
    toast.info(`${action} action triggered`);
  };

  const handleAddDevice = () => {
    if (!newMac.trim()) {
      toast.error("MAC Address is required");
      return;
    }

    const newDevice: Device = {
      id: rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1,
      mac: newMac,
      size: "4.2",
      rssi: -60,
      battery: 100,
      status: "Offline",
      dataId: Math.random().toString(36).substring(2, 6),
    };

    setRows(prev => [...prev, newDevice]);
    setNewMac("");
    setOpenAddModal(false);
    toast.success("Device added successfully");
  };


  const handleEditClick = (device: Device) => {
    setEditDevice(device);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    if (!editDevice) return;
    setRows((prev) =>
      prev.map((row) => (row.id === editDevice.id ? editDevice : row))
    );
    setOpenEditModal(false);
    // toast.success("Device updated!");
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "S/N", width: 70 },
    { field: "mac", headerName: "MAC address", width: 180 },
    { field: "size", headerName: 'Size(")', width: 100 },
    {
      field: "rssi",
      headerName: "RSSI",
      width: 100,
      renderCell: ({ value }) => (
        <WiBarometer color={value > -80 ? "green" : "red"} size={20} />
      ),
    },
    {
      field: "battery",
      headerName: "Battery level(%)",
      width: 150,
      renderCell: () => <FiBattery color="green" size={20} />,
    },
    {
      field: "status",
      headerName: "Online status",
      width: 150,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={value === "Online" ? "success" : "error"}
          size="small"
        />
      ),
    },
    { field: "dataId", headerName: "Data ID", width: 120 },
    {
      field: "actions",
      headerName: "Operate",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => toast.info("Link action")}>
            <AiOutlineLink />
          </IconButton>
          <IconButton onClick={() => handleEditClick(row)}>
            {/*<AiOutlineEdit />*/}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z" fill="#232F6F"/>
            </svg>
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(row.id)}>
            {/*<AiOutlineDelete color="red" />*/}
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35903 2.75307V1.37653H8.48863V2.75307H4.35903ZM2.98249 2.75307V0.91769C2.98249 0.674303 3.07918 0.440885 3.25128 0.268785C3.42338 0.0966849 3.6568 0 3.90018 0L8.94748 0C9.19086 0 9.42428 0.0966849 9.59638 0.268785C9.76848 0.440885 9.86516 0.674303 9.86516 0.91769V2.75307H12.1594C12.3419 2.75307 12.517 2.82558 12.6461 2.95466C12.7751 3.08373 12.8477 3.2588 12.8477 3.44134C12.8477 3.62388 12.7751 3.79894 12.6461 3.92801C12.517 4.05709 12.3419 4.1296 12.1594 4.1296H11.8244L11.1426 12.9881C11.1072 13.4492 10.8991 13.8799 10.5598 14.1941C10.2206 14.5084 9.77516 14.683 9.31272 14.683H3.53494C3.0725 14.683 2.62711 14.5084 2.28784 14.1941C1.94858 13.8799 1.74044 13.4492 1.70507 12.9881L1.02322 4.1296H0.688267C0.505727 4.1296 0.330664 4.05709 0.201589 3.92801C0.0725137 3.79894 0 3.62388 0 3.44134C0 3.2588 0.0725137 3.08373 0.201589 2.95466C0.330664 2.82558 0.505727 2.75307 0.688267 2.75307H2.98249ZM2.40435 4.1296H10.4433L9.76972 12.8825C9.76094 12.9978 9.709 13.1054 9.62427 13.184C9.53955 13.2626 9.42828 13.3064 9.31272 13.3065H3.53494C3.41937 13.3064 3.30811 13.2626 3.22338 13.184C3.13866 13.1054 3.08671 12.9978 3.07793 12.8825L2.40435 4.1296Z" fill="#232F6F"/>
            </svg>
          </IconButton>
        </>
      ),
    },
  ];

  function handleDelete(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box sx={{ maxWidth: "100%" }} mt={5} className=" border border-gray-200 bg-white p-2 rounded-lg ">
      <ToastContainer/>
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={2}
      >
        <Box>
          <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 180 }}
              InputProps={{
                endAdornment: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="gray"
                        style={{ width: 20, height: 20 }}
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                ),
              }}
          />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Offline">Offline</MenuItem>
          </Select>

          <Select
              size="small"
              value={deviceType}
              sx={{ width: 160 }}
              onChange={(e) => setDeviceType(e.target.value)}
          >
            <MenuItem value="ESL">ESL</MenuItem>
            <MenuItem value="Display">Displays</MenuItem>
            <MenuItem value="LCD Devices">LCD Devices</MenuItem>
            <MenuItem value="Warning Light">Warning Light</MenuItem>
            <MenuItem value="Millimeter wave radar">
              Millimeter wave radar
            </MenuItem>
            <MenuItem value="Temprature and Humidity sensors">
              Temperature and Humidity sensors
            </MenuItem>
          </Select>

          <Select size="small" value="All devices" sx={{ minWidth: 150 }}>
            <MenuItem value="All devices">All devices</MenuItem>
          </Select>
          <Button
              variant="default"
              startIcon={<AiOutlineReload />}
              color="primary"
              onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
              variant="default"
              startIcon={<AiOutlineMore />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            More
          </Button>
          <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleMore("Restart")}>Restart</MenuItem>
            <MenuItem onClick={() => handleMore("Refresh")}>Refresh</MenuItem>
            <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
          </Menu>

          <button
              className="bg-[#262262] text-white px-4 py-2 rounded shadow hover:bg-[#1a1847] transition-colors"
              onClick={() => {
                setAnchorEl(null);
                setOpenAddModal(true);
              }}
          >
            + Add
          </button>
        </Box>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[5, 10, 25]}
        onRowSelectionModelChange={handleSelection}
      />

      {/* Edit Modal */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "800px",
            maxWidth: "90vw",
            p: 3,
            mx: "auto",
          },
        }}
      >
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography sx={{ mb: 0.5 }}>
            <span style={{ color: "red" }}>*</span> MAC Address
          </Typography>
          <TextField
              fullWidth
              placeholder="Enter MAC Address"
              value={editDevice?.mac || ""}
              onChange={(e) =>
                  setEditDevice((prev) =>
                      prev ? { ...prev, mac: e.target.value } : prev
                  )
              }
          />

          <Typography sx={{ mb: 0.5 }}>
            Size
          </Typography>

          <TextField
              fullWidth
              placeholder='Enter size'
              value={editDevice?.size || ""}
              onChange={(e) =>
                  setEditDevice((prev) =>
                      prev ? { ...prev, size: e.target.value } : prev
                  )
              }
          />

          <Box>
            <Typography sx={{ mb: 0.5 }}>
              RSSI
            </Typography>

            <TextField
                fullWidth
                type="number"
                placeholder="Enter RSSI"
                value={editDevice?.rssi ?? ""}
                onChange={(e) =>
                    setEditDevice((prev) =>
                        prev ? { ...prev, rssi: Number(e.target.value) } : prev
                    )
                }
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 0.5 }}>
              Battery Level
            </Typography>

            <TextField
                fullWidth
                type="number"
                placeholder="Enter battery level (%)"
                value={editDevice?.battery ?? ""}
                onChange={(e) =>
                    setEditDevice((prev) =>
                        prev ? { ...prev, battery: Number(e.target.value) } : prev
                    )
                }
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 0.5 }}>
              Data ID
            </Typography>

            <TextField
                fullWidth
                placeholder="Enter Data ID"
                value={editDevice?.dataId || ""}
                onChange={(e) =>
                    setEditDevice((prev) =>
                        prev ? { ...prev, dataId: e.target.value } : prev
                    )
                }
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 0.5 }}>
              Status
            </Typography>

            <Select
                fullWidth
                size="small"
                value={editDevice?.status || "Offline"}
                onChange={(e: SelectChangeEvent) =>
                    setEditDevice((prev) =>
                        prev
                            ? { ...prev, status: e.target.value as "Online" | "Offline" }
                            : prev
                    )
                }
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </Box>

        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setOpenEditModal(false)}
            className="bg-white text-gray-800 border border-gray-800  px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button onClick={handleEditSave} className="bg-[#262262] text-white px-4 py-2 rounded shadow hover:bg-[#1a1847] transition-colors flex items-center gap-2"
          >
            Save
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            {isBulkDelete ? `${selected.length} device(s)` : `this device`}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenConfirmDialog(false)} className="bg-white text-gray-800 border border-gray-800  px-4 py-2 rounded-lg"
          >Cancel</button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          PaperProps={{
            sx: {
              width: "500px",
              maxWidth: "90vw",
              borderRadius: 2,
            },
          }}
      >
        <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
        >
          Add Label
          <IconButton onClick={() => setOpenAddModal(false)}>
            ✕
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Typography mb={1}>
            <span style={{ color: "red" }}>*</span> MAC Address
          </Typography>
          <TextField
              fullWidth
              size="small"
              placeholder="Enter MAC address"
              value={newMac}
              onChange={(e) => setNewMac(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, mr: 4 }}>
          <button
              onClick={() => setOpenAddModal(false)}
              className="bg-white text-gray-800 border border-gray-800  px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button onClick={handleAddDevice} className="px-4 py-2 text-white bg-[#262262] rounded-lg border border-[#262262]">
            Confirm
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
