"use client";

import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import Link from "next/link";
import Close from "@/@menu/svg/Close";

const labelTypes = ["Label template", "LCD template"];
const templateTypes = ["Template repository", "System template"];
const screenSizes = ["All sizes", '1.54"', '2.13"', '2.66"', '2.99"'];
const colors = [
  "All colors",
  "Black White Red",
  "Black White Yellow",
  "Black White",
  "Six Colors",
  "RGB565",
];
const templateData = [
  {
    id: 1,
    name: "Sweets",
    date: "2024-08-30",
    color: "Black White Red",
    size: '2.9" (296*128)',
  },
];

export default function SystemTemplate() {
  const [labelType, setLabelType] = useState(labelTypes[0]);
  const [templateType, setTemplateType] = useState(templateTypes[1]);
  const [screenSize, setScreenSize] = useState(screenSizes[0]);
  const [selectColor, setSelectColor] = useState(colors[0]);
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [templateList, setTemplateList] = useState(templateData);
  const [templateName, setTemplateName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddTemplate = () => {
    if (editIndex !== null) {
      const updatedList = [...templateList];
      updatedList[editIndex] = {
        ...updatedList[editIndex],
        name: templateName,
        color: selectColor,
        size: screenSize,
      };
      setTemplateList(updatedList);
      setEditIndex(null);
    } else {
      setTemplateList((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: templateName,
          date: new Date().toISOString().split("T")[0],
          color: selectColor,
          size: screenSize,
        },
      ]);
    }
    setShowAddModal(false);
    setTemplateName("");
  };

  const handleDeleteTemplate = (index: number) => {
    setTemplateList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRefresh = () => {
    if (typeof router.refresh === "function") {
      router.refresh();
    } else {
      window.location.reload();
    }
  };

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(templateList.length / itemsPerPage));
  const paginatedData = templateList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-4 bg-gray-100 border-gray-200 border-[1px] rounded-md">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4 ">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={labelType}
            onChange={(e) => setLabelType(e.target.value)}
            displayEmpty
            sx={{ borderRadius: "8px" }}
          >
            {labelTypes.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            displayEmpty
            sx={{ borderRadius: "8px" }}
          >
            {templateTypes.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={screenSize}
            onChange={(e) => setScreenSize(e.target.value)}
            displayEmpty
            sx={{ borderRadius: "8px" }}
          >
            {screenSizes.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={selectColor}
            onChange={(e) => setSelectColor(e.target.value)}
            displayEmpty
            sx={{ borderRadius: "8px" }}
          >
            {colors.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
            border: "1px solid #ccc",
            pl: 1,
            width: 240,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Find the template name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <Search size={16} />
          </IconButton>
        </Paper>
        <Button
          onClick={handleRefresh}
          className="rounded-md flex items-center gap-1"
        >
          <RefreshCw size={16} /> Refresh
        </Button>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditIndex(null);
            setTemplateName("");
          }}
          className="px-4 py-[10px] bg-[#262262] text-white items-center rounded-lg hover:cursor-pointer border border-[#262262]"
        >
          <Plus size={16} /> Add
        </button>
        <div className="relative">
          <Button onClick={() => setShowMoreMenu(!showMoreMenu)}>
            <MoreVertical size={16} /> More
          </Button>
          {showMoreMenu && (
            <div className="absolute z-10 mt-1 bg-white border rounded-xl shadow -ml-4 animate-fade-in ease-in duration-200">
              {["Export Selected", "Export All", "Batch import"].map((opt) => (
                <div
                  key={opt}
                  className="px-8 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {templateList.map((item, index: any) => (
          <Link
            href={`/edit_template/${item.id}`}
            key={item.id}
            className="border rounded-xl p-4 shadow relative bg-white"
          >
            <div className="absolute top-2 left-2">
              <input type="checkbox" />
            </div>
            <div className="text-right text-xl font-bold text-red-500">
              {item.date}
            </div>
            <div
              className="h-10 my-3"
              style={{
                backgroundColor: item.color.includes("Red")
                  ? "#800000"
                  : item.color.includes("Yellow")
                    ? "#ffcc00"
                    : "#000",
              }}
            ></div>
            <div className="font-semibold mt-2">{item.name}</div>
            <div className="text-xs text-gray-500">
              {item.size}, {item.color}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                // className={
                //   item.color.includes("Red")
                //     ? "text-[#800000]"
                //     : item.color.includes("Yellow")
                //       ? "text-yellow-600"
                //       : "text-[#262262]"
                // }
                onClick={() => {
                  setTemplateName(item.name);
                  setScreenSize(item.size);
                  setSelectColor(item.color);
                  setEditIndex(index);
                  setShowAddModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
                className="text-red-500"
                onClick={() => handleDeleteTemplate(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 hover:cursor-pointer active:scale-90 transition-transform duration-75"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5H2a1 1 0 110-2h3V2zm2 1v1h4V3H8zm-2 4a1 1 0 112 0v7a1 1 0 11-2 0V7zm6 0a1 1 0 10-2 0v7a1 1 0 002 0V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {editIndex !== null ? "Edit template" : "Add template"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-600"
              >
                <Close />
              </button>
            </div>
            <input
              className="border p-2 w-full rounded"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <select
              className="border p-2 w-full rounded"
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value)}
            >
              {screenSizes.slice(1).map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
            <select
              className="border p-2 w-full rounded"
              value={selectColor}
              onChange={(e) => setSelectColor(e.target.value)}
            >
              {colors.slice(1).map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>
            <select className="border p-2 w-full rounded">
              <option>Single data template</option>
            </select>
            <select className="border p-2 w-full rounded">
              <option>No rotation</option>
              <option>90°</option>
              <option>180°</option>
              <option>270°</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:cursor-pointer px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTemplate}
                className="hover:cursor-pointer bg-[#262262] text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center mt-12 text-sm">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity"
        >
          Prev..
        </button>
        <span>
          page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
