"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

type MediaItem = {
  url: string;
  name: string;
  size: string;
  type: "image" | "video";
  progress: number;
};

const ResourceManagement = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const MAX_VIDEO_SIZE_MB = 10;

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const name = file.name;
      const sizeMB = file.size / (1024 * 1024);
      const size = (file.size / 1024).toFixed(1);

      // Check for duplicates
      const isDuplicate = mediaItems.some((item) => item.name === name);
      if (isDuplicate) {
        toast.warning(`File "${name}" already uploaded.`);
        return;
      }

      // Validation
      if (type === "video") {
        if (!file.type.startsWith("video/")) {
          toast.error(`${name} is not a valid video.`);
          return;
        }
        if (sizeMB > MAX_VIDEO_SIZE_MB) {
          toast.error(`${name} exceeds 10MB.`);
          return;
        }
      } else if (!file.type.startsWith("image/")) {
        toast.error(`${name} is not a valid image.`);
        return;
      }

      const url = URL.createObjectURL(file);
      const newItem: MediaItem = { url, name, size, type, progress: 0 };
      setMediaItems((prev) => [...prev, newItem]);

      // Simulate progress
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadstart = () => updateProgress(name, 0);
      reader.onprogress = (event) => {
        const percent = Math.round((event.loaded / file.size) * 100);
        updateProgress(name, percent);
      };
      reader.onloadend = () => {
        updateProgress(name, 100);
        toast.success(`File "${name}" uploaded successfully.`);
      };
    });

    e.target.value = "";
  };

  const updateProgress = (name: string, progress: number) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, progress } : item
      )
    );
  };

  const handleDelete = (index: number) => {
    const deletedFile = mediaItems[index];
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
    toast.info(`File "${deletedFile.name}" deleted.`);
  };

  const filteredItems = mediaItems.filter((item) => {
    return (
      (filter === "All" || item.type === filter.toLowerCase()) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Controls */}
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
          </Select>
        </FormControl>

        <input
          type="text"
          placeholder="Search name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-[11px] rounded w-1/4"
        />

        <label className="bg-[#262262] text-white px-4 py-2 rounded cursor-pointer">
          + Upload images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleUpload(e, "image")}
          />
        </label>

        <label className="bg-[#262262] text-white px-4 py-2 rounded cursor-pointer">
          + Upload videos
          <input
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={(e) => handleUpload(e, "video")}
          />
        </label>
      </div>

      {/* Media Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedItems.map((item, idx) => (
          <div key={idx} className="border p-2 rounded relative shadow-sm bg-white">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-60 object-contain"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-60 object-contain"
              />
            )}

            <div className="mt-2 text-sm font-medium truncate">{item.name}</div>
            <div className="text-xs text-gray-500">{item.size} kb</div>

            {/* Upload Progress */}
            {item.progress < 100 && (
              <Box mt={1}>
                <LinearProgress variant="determinate" value={item.progress} />
                <Typography variant="caption" color="text.secondary">
                  Uploading... {item.progress}%
                </Typography>
              </Box>
            )}

            <Trash2
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete((currentPage - 1) * itemsPerPage + idx)}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-[#262262] text-white"
                    : "border"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            className="px-3 py-1 border rounded"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
