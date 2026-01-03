"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton, InputLabel,
    Menu,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { FaEllipsisV, FaSync } from "react-icons/fa";
import { Button } from "@mui/material";

interface StoreGatewayProps{
    ansh : string
}

const API_URL = process.env.NEXT_PUBLIC_DEV_APP;

type Gateway = {
  id: number;
  gatewayName: string;
  gatewayMac: string;
  status: string | null;
  updatedTime: string | null;
  gatewayModel: string | null;
  wifiVersion: string | null;
  bluetoothVersion: string | null;
  gatewayIp: string | null;
  companyId?: number | null;
  storeId?: number | null;
};

type StoreItem = {
  id: number;
  storeName: string;
};

export default function StoreGatewayManager( {ansh}: StoreGatewayProps) {
    const token = ansh;
  // Data State
  const [rows, setRows] = useState<Gateway[]>([]);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [storeId, setStoreId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addGatewayStoreId, setAddGatewayStoreId] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editGateway, setEditGateway] = useState<Partial<Gateway> | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [newGateway, setNewGateway] = useState({
    gatewayName: "",
    gatewayMac: "",
    gatewayModel: "GMX-200",
    wifiVersion: "v5.4.1",
    bluetoothVersion: "v3.2.0",
    gatewayIp: "192.168.1.100",
  });

  // useEffect(() => {
  //   if (token) {
  //     loadStores();
  //   }
  // }, [token]);

  useEffect(() => {
    if (token) {
      loadGateways();
    }
  }, [token, storeId, currentPage, pageSize, search]);

    // const loadStores = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}/store/list`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         const json = await res.json();
    //         console.log("STORE LIST:", json);
    //
    //         if (res.ok) {
    //             const list = json.data || [];
    //             setStores(
    //                 list.map((s: any) => ({
    //                     id: s.id,
    //                     storeName: s.storeName,
    //                 }))
    //             );
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const loadGateways = async () => {
        if (!token) return;
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/gateway/gateway-list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await res.json();
            console.log("GATEWAY LIST:", json);

            if (res.ok) {
                setRows(json.data || []);
                setTotalItems((json.data || []).length);
            }
        } catch (e) {
            toast.error("Failed to load gateways");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGateway = async () => {
        if (!token) {
            toast.error("Unauthorized");
            return;
        }

        const body = {
            gatewayName: newGateway.gatewayName,
            gatewayMac: newGateway.gatewayMac,
            status: "Online",
            updatedTime: new Date().toISOString(),
            gatewayModel: newGateway.gatewayModel,
            wifiVersion: newGateway.wifiVersion,
            bluetoothVersion: newGateway.bluetoothVersion,
            gatewayIp: newGateway.gatewayIp,
            storeId: addGatewayStoreId
                ? Number(addGatewayStoreId)
                : storeId
                    ? Number(storeId)
                    : null,
        };

        try {
            const res = await fetch(`${API_URL}/gateway/create-gateway`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            console.log("CREATE RESPONSE:", json);

            if (res.ok) {
                toast.success("Gateway created");
                setOpenAdd(false);
                await loadGateways();
            } else {
                toast.error(json.message || "Create failed");
            }
        } catch (err) {
            toast.error("Create error");
        }
    };

  const handleUpdateGateway = async () => {
    if (!token || !editGateway?.id) return;

    const body = {
      gatewayId: editGateway.id,
      gatewayName: editGateway.gatewayName,
      gatewayMac: editGateway.gatewayMac,
      status: editGateway.status || "active",
      updatedTime: new Date().toISOString(),
      gatewayModel: editGateway.gatewayModel,
      wifiVersion: editGateway.wifiVersion,
      bluetoothVersion: editGateway.bluetoothVersion,
      gatewayIp: editGateway.gatewayIp
    };

    try {
      const res = await fetch(`${API_URL}/gateway/update-gateway`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.status === 200) {
        toast.success("Gateway updated successfully");
        setEditOpen(false);
        setEditGateway(null);
        await loadGateways();
      } else {
        toast.error(json.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating gateway");
    }
  };

  const handleDeleteGateway = async () => {
    if (!token || !deleteTarget) return;

    try {
      const res = await fetch(`${API_URL}/gateway/delete-gateway?id=${deleteTarget}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.status === 200) {
        toast.success("Gateway deleted");
        await loadGateways();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting gateway");
    } finally {
      setConfirmDelete(false);
      setDeleteTarget(null);
    }
  };

  // Client-side status filtering (applied to the current page of rows)
  const displayedRows = rows.filter(row => 
    statusFilter === "All" || 
    (row.status?.toLowerCase() === statusFilter.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "gatewayName", headerName: "Gateway Name", width: 160 },
    { field: "gatewayMac", headerName: "MAC Address", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const isActive = params.value === "active" || params.value === "Online";
        return (
          <Chip
            label={params.value || "Offline"}
            color={isActive ? "success" : "error"}
            size="small"
            variant={isActive ? "filled" : "outlined"}
          />
        );
      },
    },
    // {
    //   field: "updatedTime",
    //   headerName: "Last Updated",
    //   width: 180,
    //   // valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : "-",
    // },

      {
          field: "updatedTime",
          headerName: "Last Updated",
          width: 180,
          renderCell: (params) => {
              if (!params.value) return "-";
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();

              // Format time 12-hour
              let hours = date.getHours();
              const minutes = String(date.getMinutes()).padStart(2, '0');
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12;

              return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
          },
      },

    { field: "gatewayIp", headerName: "IP Address", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} className="mt-2">
          <IconButton size="small" color="primary" onClick={() => {
              setEditGateway(params.row);
              setEditOpen(true);
          }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z" fill="#232F6F"/>
              </svg>
          </IconButton>
          <IconButton size="small" color="error" onClick={() => {
              setDeleteTarget(params.row.id);
              setConfirmDelete(true);
          }}>
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35903 2.75307V1.37653H8.48863V2.75307H4.35903ZM2.98249 2.75307V0.91769C2.98249 0.674303 3.07918 0.440885 3.25128 0.268785C3.42338 0.0966849 3.6568 0 3.90018 0L8.94748 0C9.19086 0 9.42428 0.0966849 9.59638 0.268785C9.76848 0.440885 9.86516 0.674303 9.86516 0.91769V2.75307H12.1594C12.3419 2.75307 12.517 2.82558 12.6461 2.95466C12.7751 3.08373 12.8477 3.2588 12.8477 3.44134C12.8477 3.62388 12.7751 3.79894 12.6461 3.92801C12.517 4.05709 12.3419 4.1296 12.1594 4.1296H11.8244L11.1426 12.9881C11.1072 13.4492 10.8991 13.8799 10.5598 14.1941C10.2206 14.5084 9.77516 14.683 9.31272 14.683H3.53494C3.0725 14.683 2.62711 14.5084 2.28784 14.1941C1.94858 13.8799 1.74044 13.4492 1.70507 12.9881L1.02322 4.1296H0.688267C0.505727 4.1296 0.330664 4.05709 0.201589 3.92801C0.0725137 3.79894 0 3.62388 0 3.44134C0 3.2588 0.0725137 3.08373 0.201589 2.95466C0.330664 2.82558 0.505727 2.75307 0.688267 2.75307H2.98249ZM2.40435 4.1296H10.4433L9.76972 12.8825C9.76094 12.9978 9.709 13.1054 9.62427 13.184C9.53955 13.2626 9.42828 13.3064 9.31272 13.3065H3.53494C3.41937 13.3064 3.30811 13.2626 3.22338 13.184C3.13866 13.1054 3.08671 12.9978 3.07793 12.8825L2.40435 4.1296Z" fill="#232F6F"/>
              </svg>
          </IconButton>
        </Box>
      ),
    },
  ];

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <Box sx={{ mt: 4, p: 2, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            flexWrap="wrap"
            gap={2}
        >
            <Box>
                <TextField
                    size="small"
                    placeholder="Search name/mac..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    sx={{ width: 220 }}
                />
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                <FormControl size="small" sx={{ width: 200 }}>
                    <Select
                        value={storeId}
                        displayEmpty
                        onChange={(e) => {
                            setStoreId(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <MenuItem value="">
                            <em>All Stores</em>
                        </MenuItem>
                        {stores.map((s) => (
                            <MenuItem key={s.id} value={String(s.id)}>
                                {s.storeName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 140 }}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="All">All Status</MenuItem>
                        <MenuItem value="active">Active / Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                    </Select>
                </FormControl>
                <button
                    onClick={() => setOpenAdd(true)}
                    className="bg-[#262262] text-white px-4 py-2 rounded shadow hover:bg-[#1a1847] transition-colors flex items-center gap-2"
                >
                    + Add Gateway
                </button>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <FaEllipsisV />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem
                        onClick={() => {
                            loadGateways();
                            setAnchorEl(null);
                        }}
                    >
                        <FaSync className="mr-2" /> Refresh Data
                    </MenuItem>
                </Menu>
            </Box>
        </Box>

      {/* DATA GRID */}
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
            rows={displayedRows}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            hideFooter
            disableRowSelectionOnClick
            sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f4f6f8",
                    color: "#637381",
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f9fafb",
                }
            }}
        />
      </div>

      {/* CUSTOM PAGINATION */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
        <Typography variant="body2" color="text.secondary">
            Showing {displayedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </Typography>
        
        <Box display="flex" items-center gap={2}>
            <FormControl size="small">
                <Select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    sx={{ height: 32 }}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </FormControl>
            <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(_, p) => setCurrentPage(p)}
                color="primary" 
                shape="rounded"
            />
        </Box>
      </Box>


      {/* ADD DIALOG */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Gateway</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
                label="Name"
                value={newGateway.gatewayName}
                onChange={(e) => setNewGateway({...newGateway, gatewayName: e.target.value})}
                fullWidth />
            <TextField
                label="MAC Address"
                value={newGateway.gatewayMac}
                onChange={(e) => setNewGateway({...newGateway, gatewayMac: e.target.value})}
                fullWidth
                placeholder="AA:BB:CC:DD:EE:FF"/>
            <TextField
                label="IP Address"
                value={newGateway.gatewayIp} onChange={(e) => setNewGateway({...newGateway, gatewayIp: e.target.value})}
                fullWidth />
            <Box display="flex" gap={2}>
                <TextField
                    label="Model"
                    value={newGateway.gatewayModel} onChange={(e) => setNewGateway({...newGateway,
                    gatewayModel: e.target.value})}
                    fullWidth />
                <TextField
                    label="WiFi Ver"
                    value={newGateway.wifiVersion} onChange={(e) => setNewGateway({...newGateway, wifiVersion: e.target.value})}
                    fullWidth />
            </Box>
            <FormControl fullWidth>
                <Select
                    value={addGatewayStoreId}
                    displayEmpty
                    onChange={(e) => setAddGatewayStoreId(e.target.value)}>
                    <MenuItem value=""><em>Assign to Store (Optional)</em></MenuItem>
                    {stores.map(s =>
                        <MenuItem
                           key={s.id}
                           value={String(s.id)}
                           >
                           {s.storeName}
                        </MenuItem>)}
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button
                onClick={() => setOpenAdd(false)}
                color="inherit">
                Cancel
            </Button>
            <Button
                onClick={handleCreateGateway}
                variant="contained"
                sx={{ bgcolor: "#262262" }}>
                Create
            </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="sm"
      >
        <DialogTitle>Edit Gateway</DialogTitle>
        <DialogContent
            sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
            <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
            >
                Gateway ID
            </Typography>

            <TextField
                value={editGateway?.id || ""}
                disabled
                fullWidth
                size="small"
                sx={{ bgcolor: "#f5f5f5", mb: 2 }}
            />
            <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
            >
                Name
            </Typography>

            <TextField
                value={editGateway?.gatewayName || ""}
                sx={{ mb: 2 }}
                size="small"
                onChange={(e) =>
                    setEditGateway((prev) => ({
                        ...prev,
                        gatewayName: e.target.value,
                    }))
                }
                fullWidth
            />
            <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
            >
                MAC
            </Typography>

            <TextField
                value={editGateway?.gatewayMac || ""}
                sx={{ mb: 2 }}
                size= "small"
                onChange={(e) =>
                    setEditGateway((prev) => ({
                        ...prev,
                        gatewayMac: e.target.value,
                    }))
                }
                fullWidth
            />
            <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
            >
                Status
            </Typography>
            <FormControl fullWidth>
                <Select
                    value={editGateway?.status || "active"}
                    sx={{ mb: 2 }}
                    size= "small"
                    onChange={(e) =>
                        setEditGateway((prev) => ({
                            ...prev,
                            status: e.target.value,
                        }))
                    }
                >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                </Select>
            </FormControl>

            <Typography
                variant="body2"
                sx={{ mb: 0.5, fontWeight: 500 }}
            >
                IP Address
            </Typography>

            <TextField
                value={editGateway?.gatewayIp || ""}
                size= "small"
                onChange={(e) =>
                    setEditGateway((prev) => ({
                        ...prev,
                        gatewayIp: e.target.value,
                    }))
                }
                fullWidth
            />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button
                onClick={() => setEditOpen(false)}
                color="inherit">
                Cancel
            </Button>
            <Button
                onClick={handleUpdateGateway}
                variant="contained"
                sx={{ bgcolor: "#262262" }}
            >
                Update
            </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{textAlign: "center"}}>
            Delete Gateway?
        </DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete this gateway?
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, textAlign: "Center" }}>
            <Button
                onClick={() => setConfirmDelete(false)}>
                Cancel
            </Button>
            <Button
                onClick={handleDeleteGateway}
                color="error"
                variant="contained">
                Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}