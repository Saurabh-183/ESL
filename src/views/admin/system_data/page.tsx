"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Upload, Settings } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/Button";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type RowData = { [key: string]: string };
type ValidationError = { [key: string]: string };

const initialFields = [
  "Id*",
  "Specification",
  "Unit",
  "Price",
  "MemberPrice",
  "Origin",
  "Title",
  "OfferPrice",
  "MRP",
];

export default function SystemData() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRow, setNewRow] = useState<RowData>({});
  const [columns] = useState(initialFields);
  const [visibleColumns, setVisibleColumns] = useState(initialFields);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const deleteDropdownRef = useRef<HTMLDivElement>(null);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

  const validateRow = (row: RowData): ValidationError => {
    const errs: ValidationError = {};
    if (!row["Id*"]) errs["Id*"] = "ID is required.";
    ["Price", "MemberPrice", "OfferPrice", "MRP"].forEach((key) => {
      if (row[key] && isNaN(Number(row[key]))) {
        errs[key] = `${key} must be a number.`;
      }
    });
    return errs;
  };

  const onSave = () => {
    const validation = validateRow(newRow);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    if (editIndex !== null) {
      const updated = [...rows];
      updated[editIndex] = newRow;
      setRows(updated);
      toast.success("Row edited successfully!");
    } else {
      setRows([...rows, newRow]);
      toast.success("Row added successfully!");
    }
    setNewRow({});
    setShowAddModal(false);
    setEditIndex(null);
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row["Id*"] !== id));
    toast.success("Row deleted successfully!");
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBatchDelete = () => {
    setRows((prev) => prev.filter((_, i) => !selectedRows.includes(i)));
    toast.success("Selected rows deleted.");
    setSelectedRows([]);
    handleClose();
  };

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col].sort(
          (a, b) => initialFields.indexOf(a) - initialFields.indexOf(b)
        )
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<RowData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows((prev) => [...prev, ...results.data]);
        toast.success("Data imported successfully.");
        setShowImportModal(false);
      },
    });
  };

  const handleExportToExcel = () => {
    const exportData = rows.map((row) =>
      visibleColumns.reduce((acc, col) => {
        acc[col] = row[col];
        return acc;
      }, {} as RowData)
    );

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // FileSaver saveAs(blob, "system_data.xlsx"); // if needed
  };

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
  const paginatedData = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        deleteDropdownRef.current &&
        !deleteDropdownRef.current.contains(e.target as Node)
      )
        setShowDeleteDropdown(false);
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(e.target as Node)
      )
        setShowColumnDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 p-4 border rounded">
      {/* <ToastContainer position="top-right" /> */}

      {/* Top Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        {/* Left side: Import & Export */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 border bg-gray-100"
          >
            <Upload size={16} /> Import
          </Button>
          <Button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 border background-color: rgba(200, 197, 237, 0);"
          >
            <Upload size={16} /> Export
          </Button>
        </div>

        {/* Right side: Columns, Delete, Add */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Column Toggle */}
          <div className="relative" ref={columnDropdownRef}>
            <Button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-2 rounded text-gray-500 border-[1.5px] border-gray-400 px-3 py-[10px]"
            >
              <Settings size={16} /> Columns
            </Button>

            {/* Animated Dropdown */}
            <div
              className={`
                   absolute right-0 bg-white shadow border border-gray-200 min-w-[140px] rounded z-10
                   transition-all duration-200 ease-in-out origin-top
                   ${showColumnDropdown ? "opacity-100 scale-100 translate-y-1" : "opacity-0 scale-95 pointer-events-none -translate-y-2"}
                  `}
            >
              {columns.map((col) => (
                <label
                  key={col}
                  className="flex gap-2 items-center text-sm py-1 px-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  {col}
                </label>
              ))}
            </div>
          </div>

          {/* Delete Dropdown */}
          <div>
            <Button
              onClick={handleClick}
              startIcon={<Trash2 size={16} />}
              className="border border-[#ff5757] text-[#ff5757] px-4 py-[6px] rounded"
            >
              Delete
            </Button>
            {/* <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleBatchDelete}>
                <Trash2 size={16} className="mr-2" />
                Batch Delete
              </MenuItem>
              <MenuItem onClick={handleDeleteAll}>
                <Trash2 size={16} className="mr-2" />
                Delete All
              </MenuItem>
            </Menu> */}
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditIndex(null);
              setNewRow({});
            }}
            className="flex items-center gap-2 bg-[#262262] text-white px-4 py-[8px] rounded border-2 border-[#262262]  active:scale-95 transition-transform duration-100"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="">
            <tr>
              <th className="p-2"></th>
              <th className="p-2">S/N</th>
              {visibleColumns.map((col) => (
                <th key={col} className="p-2">
                  {col}
                </th>
              ))}
              <th className="p-2">Operate</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <tr key={globalIndex} className="border-t text-center">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(globalIndex)}
                      onChange={() =>
                        setSelectedRows((prev) =>
                          prev.includes(globalIndex)
                            ? prev.filter((i) => i !== globalIndex)
                            : [...prev, globalIndex]
                        )
                      }
                    />
                  </td>
                  <td>{globalIndex + 1}</td>
                  {visibleColumns.map((col) => (
                    <td key={col} className="p-2">
                      {row[col]}
                    </td>
                  ))}
                  <td className="flex gap-3 justify-center p-2">
                    <button
                      className="text-gray-700 hover:cursor-pointer "
                      onClick={() => {
                        setEditIndex(globalIndex);
                        setNewRow(row);
                        setShowAddModal(true);
                      }}
                    >
                      {/* <Pencil size={16} /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:cursor-pointer"
                      onClick={() => setConfirmDeleteId(row["Id*"])}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 text-sm gap-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-[8px] bg-gray-300 hover:bg-gray-500 text-white font-semibold rounded-lg"
        >
          Prev
        </button>
        <span className="items-center mt-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-[8px] bg-gray-300 hover:bg-gray-500 text-white font-semibold rounded-lg"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center overflow-y-auto  z-50">
          <div className="bg-white border-[1.5px] border-gray-200 p-4 rounded w-full max-w-md space-y-4 mb-2 ml-10 relative mt-96">
            <div>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-3 text-gray-500 hover:text-red-700"
              >
                {/* <X size={18} /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-bold">
                {editIndex !== null ? "Edit Product" : "Add Product"}
              </h2>
            </div>

            {columns.map((col) => (
              <div key={col}>
                <label className="text-sm">{col}</label>
                <input
                  type="text"
                  value={newRow[col] || ""}
                  onChange={(e) =>
                    setNewRow((prev) => ({ ...prev, [col]: e.target.value }))
                  }
                  className={`border w-full p-2 rounded ${errors[col] ? "border-red-500" : ""}`}
                />
                {errors[col] && (
                  <p className="text-red-500 text-sm">{errors[col]}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 border border-gray-300 px-4 py-[8px] rounded hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="font-medium text-white border-[1.5px] border-[#262262] bg-[#262262] px-4 py-[8px] rounded hover:cursor-pointer active:scale-75 transition-transform duration-100"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-100 border-2 border-gray-200 p-6 rounded shadow max-w-sm text-center">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this row?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:cursor-pointer hover:bg-gray-300 active:scale-75 transition-transform duration-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteRow(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white px-4 py-2 rounded active:scale-75 transition-transform duration-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Import File</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="hover:text-red-500"
              >
                ❌
              </button>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportFile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
