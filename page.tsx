"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Plus,
  RefreshCw,
  Search,
  MoreVertical,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

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
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          className="border px-4 py-2 rounded-xl"
          value={labelType}
          onChange={(e) => setLabelType(e.target.value)}
        >
          {labelTypes.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="border px-4 py-2 rounded-xl"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
        >
          {templateTypes.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="border px-4 py-2 rounded-xl"
          value={screenSize}
          onChange={(e) => setScreenSize(e.target.value)}
        >
          {screenSizes.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="border px-4 py-2 rounded-xl"
          value={selectColor}
          onChange={(e) => setSelectColor(e.target.value)}
        >
          {colors.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <div className="flex border rounded-xl overflow-hidden">
          <input
            className="px-3 py-2 outline-none"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Find the template name"
          />
          <button className="bg-gray-200 px-3">
            <Search size={16} />
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="text-[#262262] bg-white border border-[#262262] hover:bg-[#cfcfcf]"
        >
          <RefreshCw size={16} /> Refresh111
        </button>

        <button
          onClick={() => {
            setShowAddModal(true);
            setEditIndex(null);
            setTemplateName("");
          }}
          className="bg-[#262262] text-white px-4 py-[8px] rounded-xl flex items-center gap-1 active:scale-90 transition-transform duration-75"
        >
          <Plus size={16} /> Add
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-1"
          >
            <MoreVertical size={16} /> More
          </button>
          {showMoreMenu && (
            <div className="absolute z-10 mt-1 bg-white border rounded-xl shadow">
              {["Export Selected", "Export All", "Batch import"].map((opt) => (
                <div
                  key={opt}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
          <div
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
                className={
                  item.color.includes("Red")
                    ? "text-[#800000]"
                    : item.color.includes("Yellow")
                      ? "text-yellow-600"
                      : "text-blue-500"
                }
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
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.414 2.586a2 2 0 010 2.828l-1.707 1.707-2.828-2.828 1.707-1.707a2 2 0 012.828 0zM2 13.414l8.293-8.293 2.828 2.828L4.828 16.243H2v-2.829z" />
                </svg>
              </button>

              <button
                className="text-red-500"
                onClick={() => handleDeleteTemplate(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-between mt-6 text-sm">
        <div className="flex items-center gap-2">
          <span>1</span>
          <select className="border rounded-lg px-4 py-2">
            <option>6/page</option>
          </select>
          <span>1 pages in total</span>
        </div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-4 py-2 w-16" placeholder="Page" />
          <button className="bg-gray-200 px-4 py-2 rounded">Confirm</button>
        </div>
      </div> */}

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
                className="text-gray-500 hover:text-red-500 px-4 py-2"
              >
                <X size={18} />
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
                className="bg-gray-300 px-4 py-2 rounded active:scale-90 transition-transform duration-75"
              >
                Cancel
              </button>
              <Button
                onClick={handleAddTemplate}
                className="bg-[#262262] text-white px-4 py-2 rounded active:scale-90 transition-transform duration-75"
              >
                Confirm
              </Button>
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
