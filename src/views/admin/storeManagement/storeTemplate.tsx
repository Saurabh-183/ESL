"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTemplateModal from "@components/AddTemplateModal";

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
    name: "Welcome to Template",
    date: "15-12-2025",
    color: "Black White Red",
    size: '2.9" (296*128)',
    image: "/images/10607573.jpg",
  },
  {
    id: 2,
    name: "Fruits are the wealth",
    date: "17-12-2025",
    color: "Black White",
    size: '2.9" (296*128)',
    image: "https://via.placeholder.com/600x300?text=Fruits+Preview",
  },
  {
    id: 3,
    name: "Vegetables are the health",
    date: "18-12-2025",
    color: "Black White Yellow",
    size: '2.13" (250*122)',
    image: "https://via.placeholder.com/600x300?text=Fruits+Preview",
  },
];

export default function StoreTemplate() {
  const router = useRouter();

  const [labelType, setLabelType] = useState(labelTypes[0]);
  const [templateType, setTemplateType] = useState(templateTypes[1]);
  const [screenSize, setScreenSize] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [templateList, setTemplateList] = useState(templateData);
  const [templateName, setTemplateName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [screenOrientation, setScreenOrientation] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateDataType, setTemplateDataType] = useState(
      ""
  );

  const itemsPerPage = 4;
  const filteredTemplates = useMemo(() => {
    return templateList.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [templateList, searchText]);

  const totalPages = Math.max(
      1,
      Math.ceil(filteredTemplates.length / itemsPerPage)
  );

  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(start, start + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const handleRefresh = () => {
    router.refresh?.();
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handleLabelChange = (e: SelectChangeEvent) => {
    setLabelType(e.target.value);
  };

  return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap  items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex border rounded-xl overflow-hidden">
              <input
                  className="px-3 py-[11px] outline-none"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Find by template name"
              />
              <button className="bg-gray-200 px-3">
                <Search size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FormControl sx={{ width: 140 }} size="small">
              <Select value={labelType} onChange={handleLabelChange}>
                {labelTypes.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: 140 }}>
              <Select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as any)}
              >
                {templateTypes.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
                disabled={!selectedIds.length}
                onClick={() => setShowDeleteConfirm(true)}
                className={`px-4 py-[11px] rounded-xl flex items-center gap-1 ${
                    selectedIds.length
                        ? "bg-red-500 text-white hover:cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <Trash2 size={16} /> Delete
            </button>

            <Button onClick={handleRefresh}>
              <RefreshCw size={16} /> Refresh
            </Button>

            <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#262262] text-white px-4 py-[10px] rounded-md flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {paginatedTemplates.map((item) => (
              <div key={item.id} className="relative">
                <input
                    type="checkbox"
                    className="absolute top-2 left-2 z-10"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) =>
                        setSelectedIds((prev) =>
                            e.target.checked
                                ? [...prev, item.id]
                                : prev.filter((id) => id !== item.id)
                        )
                    }
                />

                <Link
                    href={`/edit_template/${item.id}`}
                    className="block border rounded-xl p-4 shadow bg-white hover:shadow-lg transition"
                >
                  <div className="text-right text-xl font-bold text-red-500">
                    {item.date}
                  </div>
                  <div
                      className="h-10 my-3"
                      style={{
                        backgroundColor: item.color.includes("Red")
                            ? "#f41515"
                            : item.color.includes("Yellow")
                                ? "#ffcc00"
                                : "#000",
                      }}
                  />
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.size}, {item.color}
                  </div>
                </Link>
              </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-10">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
          Page {currentPage} of {totalPages}
        </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>


        <AddTemplateModal
            open={showAddModal}
            templateName={templateName}
            setTemplateName={setTemplateName}
            screenSize={screenSize}
            setScreenSize={setScreenSize}
            selectColor={selectColor}
            setSelectColor={setSelectColor}
            templateDataType={templateDataType}
            setTemplateDataType={setTemplateDataType}
            screenOrientation={screenOrientation}
            setScreenOrientation={setScreenOrientation}
            screenSizes={screenSizes}
            colors={colors}
            onClose={() => setShowAddModal(false)}
            onConfirm={() => {
              if (!templateName.trim()) {
                toast.error("Template name is required");
                return;
              }

              setTemplateList((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  name: templateName,
                  date: new Date().toISOString().split("T")[0],
                  color: selectColor,
                  size: screenSize,
                  image: "https://via.placeholder.com/600x300?text=New+Template",
                },
              ]);

              setShowAddModal(false);
              setTemplateName("");
              toast.success("Template added successfully!");
            }}
        />

        {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg">
                <h3 className="text-xl text-[#ED3401] font-bold mb-2 text-center">
                  Delete
                </h3>
                <p className="text-base text-[#2F2F2F] mb-6 text-center">
                  Are you sure you want to delete the selected template ?
                </p>

                <div className="flex justify-center gap-3">
                  <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-full border border-[#2F2F2F] hover:cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                      onClick={() => {
                        setTemplateList((prev) =>
                            prev.filter((t) => !selectedIds.includes(t.id))
                        );
                        setSelectedIds([]);
                        setShowDeleteConfirm(false);
                        toast.success("Templates deleted successfully!");
                      }}
                      className="px-6 py-2 rounded-full bg-red-500 border-red-500 border text-white hover:cursor-pointer"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
        )}

        <ToastContainer autoClose={1000} hideProgressBar />
      </div>
  );
}
