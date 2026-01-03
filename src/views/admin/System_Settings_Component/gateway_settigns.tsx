"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MUIButton,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Type for each row
interface GatewayRow {
  id: number;
  serial: number;
  store: string;
  gateway: string;
  mac: string;
}

const GateWaySettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState("");
  const [gateway, setGateway] = useState("");
  const [data, setData] = useState<GatewayRow[]>([]);
  const [serial, setSerial] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const handleAdd = () => setOpen(true);
  const handleCancel = () => {
    setOpen(false);
    setStore("");
    setGateway("");
  };

  const handleConfirm = () => {
    if (!store) {
      toast.error("Store is required!");
      return;
    }

    const newData: GatewayRow = {
      id: Date.now(),
      serial: serial,
      store: store,
      gateway: gateway || "N/A",
      mac: `MAC-${Math.floor(Math.random() * 100000)}`,
    };

    setData((prev) => [...prev, newData]);
    setSerial((prev) => prev + 1);
    toast.success("Added successfully");
    handleCancel();
  };

  const handleStoreChange = (event: SelectChangeEvent) => {
    setStore(event.target.value);
  };

  const handleGatewayChange = (event: SelectChangeEvent) => {
    setGateway(event.target.value);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmed) {
      setData((prev) => prev.filter((row) => row.id !== id));
      toast.success("Deleted successfully");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ToastContainer position="top-right" />

      <div className="flex justify-end mb-4">
        <button onClick={handleAdd} className="bg-[#262262] text-white px-4 py-[8px] rounded-md flex items-center gap-1 active:scale-90 transition-transform duration-100">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Add Gateway</DialogTitle>
        <DialogContent>
          {/* Store Dropdown */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Select Store <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="store-label">Select Store</InputLabel>
              <Select
                labelId="store-label"
                value={store}
                label="Select Store"
                onChange={handleStoreChange}
              >
                <MenuItem value="">-- Select --</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="gateway-label">Select Gateway</InputLabel>
            <Select
              labelId="gateway-label"
              value={gateway}
              label="Select Gateway"
              onChange={handleGatewayChange}
            >
              <MenuItem value="">-- Select --</MenuItem>
              <MenuItem value="Gateway 1">Gateway 1</MenuItem>
              <MenuItem value="Gateway 2">Gateway 2</MenuItem>
              <MenuItem value="Gateway 3">Gateway 3</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <button className="bg-gray-200 text-gray-700 font-medium px-6 py-[10px] hover:cursor-pointer rounded-lg"
            onClick={handleCancel}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-[#262262] text-white px-6 py-[10px] rounded-lg hover:cursor-pointer"
          >
            Confirm
          </button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">
                <input type="checkbox" disabled />
              </th>
              <th className="p-2 text-left">Serial</th>
              <th className="p-2 text-left">Store name</th>
              <th className="p-2 text-left">Gateway Name</th>
              <th className="p-2 text-left">Gateway MAC</th>
              <th className="p-2 text-left">Operation</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No Data
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">
                    <input type="checkbox" disabled />
                  </td>
                  <td className="p-2">{item.serial}</td>
                  <td className="p-2">{item.store}</td>
                  <td className="p-2">{item.gateway}</td>
                  <td className="p-2">{item.mac}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setSelectedDeleteId(item.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this record ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <MUIButton
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </MUIButton>
          <MUIButton
            onClick={() => {
              if (selectedDeleteId !== null) {
                setData((prev) =>
                  prev.filter((row) => row.id !== selectedDeleteId)
                );
                toast.success("Deleted successfully");
              }
              setDeleteDialogOpen(false);
              setSelectedDeleteId(null);
            }}
            variant="contained"
            color="error"
          >
            Delete
          </MUIButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GateWaySettings;
