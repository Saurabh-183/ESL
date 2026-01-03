"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaffManagement from "./staff-management";
import PermissionAssignment from "./permission-assignment";

interface RowData {
  id: number;
  name: string;
  type: string;
  status: string;
}

const initialRows: RowData[] = [
  { id: 1, name: "Device 1", type: "Sensor", status: "Online" },
  { id: 2, name: "Device 2", type: "Camera", status: "Offline" },
  { id: 3, name: "Device 3", type: "Sensor", status: "Online" },
  { id: 4, name: "Device 4", type: "Display", status: "Offline" },
];

const DeviceManager: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [rows, setRows] = useState<RowData[]>(initialRows);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<RowData>({
    id: 0,
    name: "",
    type: "",
    status: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleAdd = () => {
    setEditIndex(null);
    setNewRow({ id: rows.length + 1, name: "", type: "", status: "" });
    setModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setNewRow(rows[index]);
    setModalOpen(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...rows];
      updated.splice(deleteIndex, 1);
      setRows(updated);
      setDeleteConfirmOpen(false);
      setDeleteIndex(null);
      toast.success("Row deleted");
    }
  };

  const handleModalSave = () => {
    const updated = [...rows];
    if (editIndex !== null) {
      updated[editIndex] = newRow;
    } else {
      updated.push({ ...newRow, id: rows.length + 1 });
    }
    setRows(updated);
    setModalOpen(false);
    setNewRow({ id: 0, name: "", type: "", status: "" });
    setEditIndex(null);
    toast.success(editIndex !== null ? "Updated!" : "Added!");
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one row.");
      return;
    }
    const exportData = rows
      .filter((row) => selectedIds.includes(row.id))
      .map((row, i) => ({
        "S/N": i + 1,
        "Device Name": row.name,
        "Device Type": row.type,
        Status: row.status,
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devices");
    XLSX.writeFile(wb, "selected_devices.xlsx");
    toast.success("Exported to Excel");
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderTabPanel = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Device List</Typography>
              <Box display="flex" gap={2}>
                <button
                  className="bg-[#262262] text-white rounded-lg px-4 py-[10px] hover:cursor-pointer items-center text-center"
                  onClick={handleExport}
                >
                  {/* <Download size={16} className="mr-2" />  */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-upload"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                    <path d="M7 9l5 -5l5 5" />
                    <path d="M12 4l0 12" />
                  </svg>
                  <span className="ml-2"> Export </span>
                </button>
                <button
                  onClick={handleAdd}
                  className="flex items-center bg-[#262262] text-white px-4 py-[8px] rounded border-2 border-[#262262]  active:scale-95 transition-transform duration-100"
                >
                  <Plus size={16} className="mr-2" /> Add
                </button>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>S/N</TableCell>
                    <TableCell>Device Name</TableCell>
                    <TableCell>Device Type</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, i) => {
                    const globalIndex = page * rowsPerPage + i;
                    return (
                      <TableRow key={row.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(row.id)}
                            onChange={() => handleSelect(row.id)}
                          />
                        </TableCell>
                        <TableCell>{globalIndex + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleEdit(globalIndex)}
                            className="text-gray-400 bg-white hover:cursor-pointer active:scale-95 transition-transform duration-100"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            color="error"
                            onClick={() => handleDeleteClick(globalIndex)}
                            className="text-red-400 bg-white ml-2 hover:cursor-pointer active:scale-95 transition-transform duration-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[3, 5, 10]}
              />
            </TableContainer>
          </Box>
        );
      case 1:
        return (
          <Typography mt={3}>
            <StaffManagement />
          </Typography>
        );
      case 2:
        return (
          <Typography mt={3}>
            <PermissionAssignment />
          </Typography>
        );
    }
  };

  return (
    <Box>
      <ToastContainer />
      <AppBar
        position="static"
        sx={{ borderRadius: 1, mb: 3, backgroundColor: "#fff" }}
        elevation={0} // optional: removes shadow
      >
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Role management" />
          <Tab label="Staff management" />
          <Tab label="Permission assignment" />
        </Tabs>
      </AppBar>

      {renderTabPanel()}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editIndex !== null ? "Edit" : "Add"} Device</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={newRow.name}
              onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Type"
              value={newRow.type}
              onChange={(e) => setNewRow({ ...newRow, type: e.target.value })}
              fullWidth
            />
            <TextField
              label="Status"
              value={newRow.status}
              onChange={(e) => setNewRow({ ...newRow, status: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <button
            className="px-6 py-[10px] bg-gray-200 text-gray-700 border border-gray-300 hover:cursor-pointer rounded-lg"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleModalSave}
            className="flex items-center gap-2 bg-[#262262] text-white px-4 py-[8px] rounded-lg border-2 border-[#262262] active:scale-95 transition-transform duration-100"
          >
            Save
          </button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this row?</Typography>
        </DialogContent>
        <DialogActions>
          <button
            className="px-6 py-[10px] bg-gray-200 text-gray-700 border border-gray-300 hover:cursor-pointer rounded-lg"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            // color="error"
            onClick={confirmDelete}
            //  variant="default"
            className=" items-center gap-2 bg-red-500 text-white px-4 py-[9px] rounded border border-red-500  active:scale-95 transition-transform duration-100"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManager;
