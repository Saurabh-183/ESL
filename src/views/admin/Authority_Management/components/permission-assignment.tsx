// Full working PermissionAssignment.tsx with dropdowns, toast, pagination, Excel export, and SVG icons

"use client";
import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface PermissionItem {
  id: number;
  username: string;
  name: string;
  systemRole: string;
  store: string;
  storeRole: string;
}

const TrashIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 3v1H4v2h16V4h-5V3H9zm3 5a1 1 0 011 1v9a1 1 0 01-2 0V9a1 1 0 011-1z" />
  </svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.06 9.02l.92.92-7.1 7.1H7v-1.88l7.06-7.14zm3.02-3.02c.39.39.39 1.02 0 1.41l-1.3 1.3-2.33-2.34 1.3-1.29c.39-.39 1.02-.39 1.41 0l.92.92z" />
  </svg>
);

export default function PermissionAssignment() {
  const [data, setData] = useState<PermissionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    id: 0,
    username: "",
    name: "",
    systemRole: "",
    store: "",
    storeRole: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [roleType, setRoleType] = useState("All type roles");
  const rowsPerPage = 5;

  const handleAddOrUpdate = () => {
    const { username, systemRole, store, storeRole } = form;
    if (!username || !systemRole || !store || !storeRole) {
      toast.error("All fields are mandatory.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...form, id: editId } : item
        )
      );
      toast.success(`Updated "${form.username}" successfully`);
    } else {
      setData((prev) => [...prev, { ...form, id: Date.now() }]);
      toast.success(`Added "${form.username}" successfully`);
    }
    setForm({
      id: 0,
      username: "",
      name: "",
      systemRole: "",
      store: "",
      storeRole: "",
    });
    setOpen(false);
    setEditId(null);
  };

  const handleEdit = (item: PermissionItem) => {
    setForm(item);
    setEditId(item.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const target = data.find((d) => d.id === id);
    if (!target) return;
    if (confirm(`Delete "${target.username}"?`)) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success(`Deleted "${target.username}"`);
    }
  };

  const handleExport = () => {
    const exportData = data.map(({ username, name, store, storeRole }) => ({
      Username: username,
      Name: name,
      Store: store,
      Role: storeRole,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Permissions");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "permissions.xlsx");
    toast.success("Exported to Excel");
  };

  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.username.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q);
    const matchesRoleType =
      roleType === "All type roles" || item.systemRole === roleType;
    return matchesSearch && matchesRoleType;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const ExportIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 16V4m0 0l-4 4m4-4l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20h16v-4H4v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const TrashIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );

  const SearchIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  );

  return (
    <Box p={1}>
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="All type roles">All type roles</MenuItem>
            <MenuItem value="System Role">System Role</MenuItem>
            <MenuItem value="Store Role">Store Role</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="All type roles">All roles</MenuItem>
            <MenuItem value="System Role">Clerk</MenuItem>
            <MenuItem value="Store Role">Manager</MenuItem>
          </Select>
        </FormControl>
        <TextField
          placeholder="Search by username or name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{ width: 200 }}
          InputProps={{
            endAdornment: (
              <Box sx={{ pl: 1, display: "flex", alignItems: "center" }}>
                <SearchIcon />
              </Box>
            ),
          }}
        />

        <button onClick={() => setOpen(true)} className="bg-[#262262] text-white px-4 py-[8px] rounded-md flex items-center gap-1 active:scale-90 transition-transform duration-100">+ Add</button>
        <Button onClick={handleExport}>
          <ExportIcon /> <span style={{ marginLeft: 6 }}>Export to Excel</span>
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            selectedIds.forEach(handleDelete);
            setSelectedIds([]);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <TrashIcon />
          <span>Delete Selected</span>
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedIds.length === data.length}
                  onChange={(e) => {
                    setSelectedIds(
                      e.target.checked ? data.map((d) => d.id) : []
                    );
                  }}
                />
              </TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  />
                </TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.store}</TableCell>
                <TableCell>{item.storeRole}</TableCell>
                <TableCell>
                  <button onClick={() => handleEdit(item)}>
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ marginLeft: 8 }}
                  >
                    <TrashIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2">
          {filteredData.length === 0
            ? "No records"
            : `Showing ${page * rowsPerPage + 1}–${Math.min(
              filteredData.length,
              (page + 1) * rowsPerPage
            )} of ${filteredData.length}`}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            onClick={() =>
              setPage((p) =>
                (p + 1) * rowsPerPage >= filteredData.length ? p : p + 1
              )
            }
            disabled={(page + 1) * rowsPerPage >= filteredData.length}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Entry" : "Add Entry"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1} width={350}>
            <TextField
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <Select
                value={form.systemRole}
                onChange={(e) =>
                  setForm({ ...form, systemRole: e.target.value })
                }
                displayEmpty
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="System Role">System Role</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <Select
                  value={form.store}
                  onChange={(e) => setForm({ ...form, store: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Store</em>
                  </MenuItem>
                  <MenuItem value="Office (Harij)">Office (Harij)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select
                  value={form.storeRole}
                  onChange={(e) =>
                    setForm({ ...form, storeRole: e.target.value })
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  <MenuItem value="Clerk">Clerk</MenuItem>
                  <MenuItem value="Shop Manager">Shop Manager</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <button
                className="px-4 py-[10px] rounded-lg bg-gray-200 text-gray-700 hover:cursor-pointer border border-gray-300"
                onClick={() => setOpen(false)}>
                Cancel
              </button>

              <button
                className="px-4 py-[10px] rounded-lg bg-[#262262] border border-[#262262] hover:cursor-pointer text-white"
                onClick={handleAddOrUpdate}>
                Save
              </button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
