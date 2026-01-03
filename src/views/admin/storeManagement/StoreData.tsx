"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
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
  Checkbox,
  FormControlLabel,
  DialogActions,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiUpload,
  FiSettings,
  FiColumns,
  FiSearch,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import ProductFormDialog from "@/components/CreateStoreDataForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Drawer } from "@mui/material";


interface Product {
  Id: string;
  specification?: string;
  unit?: string;
  price?: string;
  memberPrice?: string;
  origin?: string;
  Title?: string;
  offerPrice?: string;
  MRP?: string;
  mukesh?: string;

  imageUrl?: string;
  videoUrl?: string;
  eslId?: string;
  eslStatus?: "Active" | "Inactive";
  lcdContent?: string;
  lcdStatus?: "Online" | "Offline";
}


const initialData: Product[] = [
  { Id: "23", specification: "180ml" },
  { Id: "1234", specification: "test" },
  { Id: "9998" },
  { Id: "9999" },
];

const columns: (keyof Product)[] = [
  "Id",
  "specification",
  "unit",
  "price",
  "memberPrice",
  "origin",
  "Title",
  "offerPrice",
  "MRP",
  "mukesh",
];

export default function ProductTable() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Product[]>(initialData);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Product>({Id: ""});
  const [columnVisible, setColumnVisible] = useState<Record<keyof Product, boolean>>(
      Object.fromEntries(columns.map((col) => [col, true])) as Record<keyof Product, boolean>
  );
  const [columnDialog, setColumnDialog] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [rgbOpen, setRgbOpen] = useState(false);

    const [rgbTime, setRgbTime] = useState("1 Minute");
    const [rgbColor, setRgbColor] = useState("Blue");
    const [brightness, setBrightness] = useState<number>(80);



    const handleAdd = () => {
    setData([...data, formData]);
    setFormData({Id: ""});
    setAddOpen(false);
    toast.success("Product added successfully");
  };


  const handleEdit = () => {
    if (editIndex === null) return;

    const newData = [...data];
    newData[editIndex] = formData;
    setData(newData);

    setFormData({Id: ""});
    setEditOpen(false);

    toast.success("Product updated successfully");
  };


  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteIndex === null) return;

    setData(data.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    setDeleteDialogOpen(false);

    toast.success("Product deleted successfully");
  };


  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, {type: "binary"});
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Product>(sheet);
      setData((prev) => [...prev, ...json]);
    };
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ProductData.xlsx");
  };

  const updateSelectedRow = (updated: Partial<Product>) => {
    if (!selectedRow) return;

    const updatedRow = { ...selectedRow, ...updated };

    setSelectedRow(updatedRow);

    setData((prev) =>
        prev.map((item) =>
            item.Id === selectedRow.Id ? updatedRow : item
        )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    updateSelectedRow({ imageUrl: url });
  };


  // const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //
  //   const url = URL.createObjectURL(file);
  //   updateSelectedRow({ videoUrl: url });
  // };

  const filteredData = data.filter((item) => item.Id.includes(search));

  return (
      <>
        <Box className="border border-gray-200 rounded-xl p-4 ">
          <Box display="flex" justifyContent="space-between" mb={2}>
            <TextField
                size="small"
                placeholder="Search by ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{endAdornment: <FiSearch size={18}/>}}
            />
            <Box display="flex" gap={1}>
              <Button startIcon={<FiDownload/>}>
                Import
                <input hidden type="file" accept=".xlsx,.xls" onChange={handleImport}/>
              </Button>
              <Button variant="default" startIcon={<FiUpload/>} color="info" onClick={handleExport}>
                Export
              </Button>
                <Button
                    variant="default"
                    startIcon={<FiSettings />}
                    disabled={selectedIds.length === 0}
                    onClick={() => setRgbOpen(true)}
                >
                    RGB light setting
                </Button>
              <Button variant="default" startIcon={<FiColumns/>} onClick={() => setColumnDialog(true)}>
                Column management
              </Button>
              <button
                  onClick={() => setAddOpen(true)}
                  className="bg-[#262262] text-white px-5 py-[8px] rounded-md flex items-center gap-2 hover:cursor-pointer"
              >
                <FiPlus/>
                Add
              </button>
            </Box>
          </Box>
            <TableContainer
                component={Paper}
                sx={{
                    overflowX: "auto",
                    maxWidth: "100%",
                }}
            >
            <Table
                stickyHeader
                   sx={{
                       tableLayout: "fixed",
                       minWidth: 1200,
                   }}>
                <TableHead>
                    <TableRow>
                        {/* Select All Checkbox */}
                        <TableCell padding="checkbox" sx={{py: "2"}}>
                            <Checkbox
                                indeterminate={
                                    selectedIds.length > 0 &&
                                    selectedIds.length < filteredData.length
                                }
                                checked={
                                    filteredData.length > 0 &&
                                    selectedIds.length === filteredData.length
                                }
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedIds(filteredData.map((r) => r.Id));
                                    } else {
                                        setSelectedIds([]);
                                    }
                                }}
                            />
                        </TableCell>
                        <TableCell>S/N</TableCell>
                        {columns.map(
                            (col) =>
                                columnVisible[col] && <TableCell key={col}>{col}</TableCell>
                        )}
                        <TableCell
                            sx={{
                                width: 120,
                                minWidth: 120,
                                maxWidth: 120,
                                position: "sticky",
                                right: 0,
                                backgroundColor: "#fff",
                                zIndex: 5,
                                boxShadow: "-4px 0 6px -2px rgba(0,0,0,0.15)",
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((row, index) => (
                        <TableRow
                            key={row.Id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedRow(row);
                                setDrawerOpen(true);
                            }}
                        >
                            <TableCell
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    width: 120,
                                    minWidth: 120,
                                    maxWidth: 120,
                                    position: "sticky",
                                    right: 0,
                                    backgroundColor: "#fff",
                                    zIndex: 4,
                                    boxShadow: "-4px 0 6px -2px rgba(0,0,0,0.15)",
                                }}
                            >
                            <Checkbox
                                    checked={selectedIds.includes(row.Id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds((prev) => [...prev, row.Id]);
                                        } else {
                                            setSelectedIds((prev) =>
                                                prev.filter((id) => id !== row.Id)
                                            );
                                        }
                                    }}
                                />
                            </TableCell>

                            <TableCell>{index + 1}</TableCell>

                            {columns.map(
                                (col) =>
                                    columnVisible[col] && (
                                        <TableCell key={col}>{row[col] || ""}</TableCell>
                                    )
                            )}
                            <TableCell
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    width: 120,
                                    minWidth: 120,
                                    maxWidth: 120,
                                    position: "sticky",
                                    right: 0,
                                    backgroundColor: "#fff",
                                    zIndex: 9,
                                    padding: 0,
                                    boxShadow: "-6px 0 8px -4px rgba(0,0,0,0.2)",
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        width: 120,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <IconButton
                                        onClick={() => {
                                            setEditIndex(index);
                                            setFormData(row);
                                            setEditOpen(true);
                                        }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z" fill="#232F6F"/>
                                        </svg>
                                    </IconButton>
                                    <IconButton onClick={() => confirmDelete(index)}>
                                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35903 2.75307V1.37653H8.48863V2.75307H4.35903ZM2.98249 2.75307V0.91769C2.98249 0.674303 3.07918 0.440885 3.25128 0.268785C3.42338 0.0966849 3.6568 0 3.90018 0L8.94748 0C9.19086 0 9.42428 0.0966849 9.59638 0.268785C9.76848 0.440885 9.86516 0.674303 9.86516 0.91769V2.75307H12.1594C12.3419 2.75307 12.517 2.82558 12.6461 2.95466C12.7751 3.08373 12.8477 3.2588 12.8477 3.44134C12.8477 3.62388 12.7751 3.79894 12.6461 3.92801C12.517 4.05709 12.3419 4.1296 12.1594 4.1296H11.8244L11.1426 12.9881C11.1072 13.4492 10.8991 13.8799 10.5598 14.1941C10.2206 14.5084 9.77516 14.683 9.31272 14.683H3.53494C3.0725 14.683 2.62711 14.5084 2.28784 14.1941C1.94858 13.8799 1.74044 13.4492 1.70507 12.9881L1.02322 4.1296H0.688267C0.505727 4.1296 0.330664 4.05709 0.201589 3.92801C0.0725137 3.79894 0 3.62388 0 3.44134C0 3.2588 0.0725137 3.08373 0.201589 2.95466C0.330664 2.82558 0.505727 2.75307 0.688267 2.75307H2.98249ZM2.40435 4.1296H10.4433L9.76972 12.8825C9.76094 12.9978 9.709 13.1054 9.62427 13.184C9.53955 13.2626 9.42828 13.3064 9.31272 13.3065H3.53494C3.41937 13.3064 3.30811 13.2626 3.22338 13.184C3.13866 13.1054 3.08671 12.9978 3.07793 12.8825L2.40435 4.1296Z" fill="#232F6F"/>
                                        </svg>
                                    </IconButton>
                                </Box>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Dialog */}
          <ProductFormDialog
              open={addOpen || editOpen}
              mode={addOpen ? "add" : "edit"}
              columns={columns}
              formData={formData}
              setFormData={setFormData}
              onClose={() => {
                setAddOpen(false);
                setEditOpen(false);
                setFormData({Id: ""});
              }}
              onSubmit={addOpen ? handleAdd : handleEdit}
          />

          {/* Delete Confirmation */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <h4 className="text-[#ED3401] font-bold text-xl text-center py-4">Delete</h4>
            <div className="px-10">
              <Typography className="text-base font-semibold text-[#2F2F2F]">
                Are you sure you want to delete ?
              </Typography>
            </div>
            <DialogActions className="flex justify-center">
              <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="bg-white text-[#2F2F2F] border border-[#2F2F2F] py-[10px] px-6 font-medium rounded-full hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                  onClick={handleDelete}
                  className="bg-[#ED3401] border border-[#ED3401] text-white py-[10px] px-6 rounded-full hover:cursor-pointer"
              >
                Delete
              </button>
            </DialogActions>
          </Dialog>

          {/* Column Management Dialog */}
          <Dialog open={columnDialog} onClose={() => setColumnDialog(false)}>
            <DialogTitle>Column Management</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={1}>
                {columns.map((col) => (
                    <FormControlLabel
                        key={col}
                        control={
                          <Checkbox
                              checked={columnVisible[col]}
                              onChange={(e) =>
                                  setColumnVisible({...columnVisible, [col]: e.target.checked})
                              }
                          />
                        }
                        label={col}
                    />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setColumnDialog(false)} variant="default">Done</Button>
            </DialogActions>
          </Dialog>

          <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar
              pauseOnHover
          />
        </Box>

        {/* Pagination */}
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          <Typography>1</Typography>
          <Select size="small" value={10}>
            <MenuItem value={10}>10/page</MenuItem>
          </Select>
          <Typography>1 pages in total</Typography>
          <Typography>Go to</Typography>
          <TextField size="small" style={{width: 50}}/>
          <Button variant="default">Confirm</Button>
        </Box>

        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 420, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                Data Details
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)} className="h-8 w-8">
                ✕
              </IconButton>
            </Box>
            <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
              ID: {selectedRow?.Id}
            </Typography>

              <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
                  Specification:{" "}
                  <span
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none"
                      onBlur={(e) =>
                          updateSelectedRow({
                              specification: e.currentTarget.textContent || "",
                          })
                      }
                  >
                       {selectedRow?.specification}
                  </span>
              </Typography>


              <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
                  Unit:{" "}
                  <span
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none"
                      onBlur={(e) =>
                          updateSelectedRow({
                              unit: e.currentTarget.textContent || "",
                          })
                      }
                  >
                      {selectedRow?.unit}
                   </span>
              </Typography>


              <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
                  Origin:{" "}
                  <span
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none"
                      onBlur={(e) =>
                          updateSelectedRow({
                              origin: e.currentTarget.textContent || "",
                          })
                      }
                  >
                   {selectedRow?.origin}
                  </span>
              </Typography>

              <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
                  Price:{" "}
                  <span
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none"
                      onBeforeInput={(e: any) => {
                          // allow ONLY numbers
                          if (!/^\d$/.test(e.data)) {
                              e.preventDefault();
                          }
                      }}
                      onBlur={(e) =>
                          updateSelectedRow({
                              price: e.currentTarget.textContent || "",
                          })
                      }
                  >
                     {selectedRow?.price}
                 </span>
              </Typography>


              {/*<Typography sx={{ color: "gray", mb: 1, ml: 2 }}>*/}
            {/*  Price: {selectedRow?.price}*/}
            {/*</Typography>*/}

            <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
              Member-Price:{" "}
              <span
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none"
                  onBeforeInput={(e: any) => {
                    // allow ONLY numbers
                    if (!/^\d$/.test(e.data)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) =>
                      updateSelectedRow({
                        memberPrice: e.currentTarget.textContent || "",
                      })
                  }
              >
                  {selectedRow?.memberPrice}
              </span>
            </Typography>


            <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
              Offer-Price:{" "}
              <span
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none"
                  onBeforeInput={(e: any) => {
                    // allow ONLY numbers
                    if (!/^\d$/.test(e.data)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) =>
                      updateSelectedRow({
                        offerPrice: e.currentTarget.textContent || "",
                      })
                  }
              >
                 {selectedRow?.offerPrice}
              </span>
            </Typography>



            {/*<Typography sx={{ color: "gray", mb: 1, ml: 2 }}>*/}
            {/*  Offer-Price: {selectedRow?.offerPrice}*/}
            {/*</Typography>*/}

            <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
              MRP:{" "}
              <span
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none"
                  onBeforeInput={(e: any) => {
                    // allow ONLY numbers
                    if (!/^\d$/.test(e.data)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) =>
                      updateSelectedRow({
                        MRP: e.currentTarget.textContent || "",
                      })
                  }
              >
                   {selectedRow?.MRP}
              </span>
            </Typography>


            {/*<Typography sx={{ color: "gray", mb: 1, ml: 2 }}>*/}
            {/*  MRP: {selectedRow?.MRP}*/}
            {/*</Typography>*/}

            <Typography sx={{ color: "gray", mb: 1, ml: 2 }}>
              Mukesh:{" "}
              <span
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none"
                  onBlur={(e) =>
                      updateSelectedRow({
                        mukesh: e.currentTarget.textContent || "",
                      })
                  }
              >
                {selectedRow?.mukesh}
              </span>
            </Typography>


            {/*<Typography sx={{ color: "gray", mb: 1, ml: 2 }}>*/}
            {/*  Mukesh: {selectedRow?.mukesh}*/}
            {/*</Typography>*/}


            <Divider sx={{ mb: 1 }} />

            <Box display="flex" justifyContent="flex-end">
              <button
                  className="px-6 py-[10px] rounded-lg bg-[#262262] text-white hover:cursor-pointer"
                  onClick={() => {
                    setData((prev) =>
                        prev.map((item) =>
                            item.Id === selectedRow?.Id ? selectedRow! : item
                        )
                    );
                    toast.success("Changes saved successfully");
                    setDrawerOpen(false);
                  }}
              >
                Save
              </button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* TABS */}
            <Tabs
                value={tabIndex}
                onChange={(_, v) => setTabIndex(v)}
                variant="fullWidth"
            >
              <Tab className="text-xs"  label="Image" />
              {/*<Tab className="text-xs" label="Video" />*/}
              <Tab className="text-xs" label="Icon Info" />
              <Tab className="text-xs" label="Bind ESL" />
              <Tab className="text-xs" label="LCD" />
            </Tabs>

            <Divider sx={{ mb: 2 }} />

            {/* IMAGE */}
            {tabIndex === 0 && (
                <div className="mt-4 flex flex-col items-center gap-4">
                  {/* Upload Area */}
                  {!selectedRow?.imageUrl && (
                      <label className="w-full h-[180px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer text-center">
                        <p className="font-medium text-gray-700">
                          Upload Image
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG (max 5MB)
                        </p>

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = URL.createObjectURL(file);
                              updateSelectedRow({ imageUrl: url });
                            }}
                        />
                      </label>
                  )}

                  {/* Preview Section */}
                  {selectedRow?.imageUrl && (
                      <div className="w-full border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                        <img
                            src={selectedRow.imageUrl}
                            alt="preview"
                            className="w-full h-[200px] object-contain rounded-lg bg-gray-50"
                        />

                        <div className="w-full flex justify-end mt-2">
                          <button
                              className="border border-[#ED3401] px-4 py-1 text-[#ED3401] rounded-lg bg-white hover:bg-red-50 transition cursor-pointer"
                              onClick={() => updateSelectedRow({ imageUrl: "" })}
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {tabIndex === 1 && (
                <div className="mt-4 flex flex-col items-center gap-4">
                  {!selectedRow?.imageUrl && (
                      <label className="w-full h-[180px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer text-center">
                        <div className="font-medium text-gray-700">Upload Icon</div>
                        <div className="text-sm text-gray-500">
                          JPG, PNG, SVG (max 1MB)
                        </div>

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = URL.createObjectURL(file);
                              updateSelectedRow({ imageUrl: url });
                            }}
                        />
                      </label>
                  )}
                  {selectedRow?.imageUrl && (
                      <div className="w-full border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                        <img
                            src={selectedRow.imageUrl}
                            alt="preview"
                            className="w-full h-[200px] object-contain rounded-lg bg-gray-50"
                        />
                        <div className="w-full flex justify-end mt-2">
                          <button
                              className="border border-[#ED3401] text-[#ED3401] px-4 py-1 rounded-lg bg-white hover:bg-red-50 transition"
                              onClick={() => updateSelectedRow({ imageUrl: "" })}
                          >
                            Remove Icon
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            )}




            {/* VIDEO */}
            {/*{tabIndex === 1 && (*/}
            {/*    <Box*/}
            {/*        sx={{*/}
            {/*          mt: 2,*/}
            {/*          display: "flex",*/}
            {/*          flexDirection: "column",*/}
            {/*          alignItems: "center",*/}
            {/*          gap: 2,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*      /!* Upload Area *!/*/}
            {/*      {!selectedRow?.videoUrl && (*/}
            {/*          <Box*/}
            {/*              sx={{*/}
            {/*                width: "100%",*/}
            {/*                height: 180,*/}
            {/*                border: "2px dashed #cfcfcf",*/}
            {/*                borderRadius: 2,*/}
            {/*                display: "flex",*/}
            {/*                flexDirection: "column",*/}
            {/*                alignItems: "center",*/}
            {/*                justifyContent: "center",*/}
            {/*                cursor: "pointer",*/}
            {/*                textAlign: "center",*/}
            {/*              }}*/}
            {/*              component="label"*/}
            {/*          >*/}
            {/*            <Typography fontWeight={500}>Upload Video</Typography>*/}
            {/*            <Typography variant="body2" color="gray">*/}
            {/*              MP4, WEBM (max 20MB)*/}
            {/*            </Typography>*/}

            {/*            <input*/}
            {/*                hidden*/}
            {/*                type="file"*/}
            {/*                accept="video/*"*/}
            {/*                onChange={(e) => {*/}
            {/*                  const file = e.target.files?.[0];*/}
            {/*                  if (!file) return;*/}
            {/*                  const url = URL.createObjectURL(file);*/}
            {/*                  updateSelectedRow({ videoUrl: url });*/}
            {/*                }}*/}
            {/*            />*/}
            {/*          </Box>*/}
            {/*      )}*/}

            {/*      /!* Preview Section *!/*/}
            {/*      {selectedRow?.videoUrl && (*/}
            {/*          <Box*/}
            {/*              sx={{*/}
            {/*                width: "100%",*/}
            {/*                border: "1px solid #e0e0e0",*/}
            {/*                borderRadius: 2,*/}
            {/*                p: 1,*/}
            {/*                display: "flex",*/}
            {/*                flexDirection: "column",*/}
            {/*                alignItems: "center",*/}
            {/*              }}*/}
            {/*          >*/}
            {/*            <Box*/}
            {/*                component="video"*/}
            {/*                src={selectedRow.videoUrl}*/}
            {/*                controls*/}
            {/*                sx={{*/}
            {/*                  width: "100%",*/}
            {/*                  height: 200,*/}
            {/*                  borderRadius: 2,*/}
            {/*                  backgroundColor: "#000",*/}
            {/*                }}*/}
            {/*            />*/}

            {/*            /!* Remove Button aligned RIGHT *!/*/}
            {/*            <Box*/}
            {/*                sx={{*/}
            {/*                  width: "100%",*/}
            {/*                  display: "flex",*/}
            {/*                  justifyContent: "flex-end",*/}
            {/*                  mt: 1,*/}
            {/*                }}*/}
            {/*            >*/}
            {/*              <button*/}
            {/*                  className="border-[#ED3401] px-4 py-1 text-[#ED3401] rounded-lg bg-white hover:cursor-pointer"*/}
            {/*                  onClick={() => updateSelectedRow({ videoUrl: "" })}*/}
            {/*              >*/}
            {/*                Remove Video*/}
            {/*              </button>*/}
            {/*            </Box>*/}
            {/*          </Box>*/}
            {/*      )}*/}
            {/*    </Box>*/}
            {/*)}*/}


            {tabIndex === 2 && (
                <div className="mt-4">
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-[1fr_1fr_120px] bg-[#eef0f3] px-4 py-1">
                      <p className="font-medium text-center">Mac address</p>
                      <p className="font-medium text-center">Template</p>
                      <p className="font-medium text-center">Operate</p>
                    </div>
                    <div className="py-10 text-center text-gray-500">
                      No Data
                    </div>
                  </div>
                </div>
            )}

            {tabIndex === 3 && (
                <div className="mt-4">
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-[1fr_1fr_120px] bg-[#eef0f3] px-4 py-3">
                      <p className="font-medium text-center">Mac address</p>
                      <p className="font-medium text-center">Template</p>
                      <p className="font-medium text-center">Operate</p>
                    </div>
                    <div className="px-4 py-6 text-center text-gray-500">
                      No Data
                    </div>
                  </div>
                </div>
            )}
          </Box>
        </Drawer>

          {/* Open popup for RGB-Settings */}
          <Dialog open={rgbOpen} onClose={() => setRgbOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                  RGB light setting
                  <IconButton onClick={() => setRgbOpen(false)}>✕</IconButton>
              </DialogTitle>

              <DialogContent>
                  {/* Time Dropdown */}
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Typography sx={{ width: 200 }}>
                          The light up time of the RGB light:
                      </Typography>

                      <Select
                          fullWidth
                          size="small"
                          value={rgbTime}
                          onChange={(e) => setRgbTime(e.target.value)}
                      >
                          <MenuItem value="30 Seconds">30 Seconds</MenuItem>
                          <MenuItem value="1 Minute">1 Minute</MenuItem>
                          <MenuItem value="5 Minutes">5 Minutes</MenuItem>
                      </Select>
                  </Box>

                  {/* Color Selection */}
                  <Box mb={3}>
                      <Typography mb={1}>The color of the RGB light:</Typography>
                      <Box display="flex" gap={2} flexWrap="wrap">
                          {["Blue", "Green", "Red", "Yellow", "White", "Pink", "Cyan"].map(
                              (color) => (
                                  <FormControlLabel
                                      key={color}
                                      control={
                                          <Checkbox
                                              checked={rgbColor === color}
                                              onChange={() => setRgbColor(color)}
                                          />
                                      }
                                      label={color}
                                  />
                              )
                          )}
                      </Box>
                  </Box>

                  {/* Brightness Slider */}
                  <Box>
                      <Typography mb={1}>
                          The brightness settings of the RGB light:
                      </Typography>

                      <input
                          type="range"
                          min={0}
                          max={100}
                          value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="w-full"
                      />
                  </Box>
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
                  <button
                      className="bg-[#ffffff] text-[#262262] border border-[#262262] font-medium px-4 py-2 rounded-lg hover:cursor-pointer"
                      onClick={() => setRgbOpen(false)}
                  >
                      Turn off
                  </button>

                  <button
                      className="bg-[#262262] border border-[#262262] font-medium px-4 py-2 rounded-lg text-white hover:cursor-pointer"
                      onClick={() => {
                          setRgbOpen(false);
                          toast.success(
                              `RGB updated for ${selectedIds.length} ESL(s)`
                          );
                      }}
                  >
                      Confirm
                  </button>
              </DialogActions>
          </Dialog>
      </>
  )
}