"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";

const operationTypes = ["All operation types", "Batch Refresh"];

const systemRecord = () => {
  const [selectedType, setSelectedType] = useState(operationTypes[0]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Dropdown */}
        <FormControl sx={{ width: "13rem" }} size="small">
          <Select
            displayEmpty
            value={selectedType}
            onChange={(e: SelectChangeEvent) => setSelectedType(e.target.value)}
            renderValue={(selected) => selected || "Operation Type"}
          >
            <MenuItem value="" disabled>
              Operation Type
            </MenuItem>
            {operationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Button */}
        <button className="flex items-center bg-[#262262] text-white px-4 py-2 rounded-md shadow  transition">
          <RefreshCw className="w-4 h-4 mr-2" />
          One click to re-push
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Import file</th>
                <th className="px-4 py-2">Operation time</th>
                <th className="px-4 py-2">Impact the Store numbers</th>
                <th className="px-4 py-2">
                  Total amount of refreshing success
                </th>
                <th className="px-4 py-2">
                  Total amount of refreshing failure
                </th>
                <th className="px-4 py-2">Operate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                  No Data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-[#262262] text-white rounded">
            1
          </button>
          <select className="border rounded px-2 py-2">
            <option>10/page</option>
            <option>20/page</option>
            <option>50/page</option>
          </select>
          {/* <span>0 pages in total</span> */}
        </div>
        <div className="flex items-center space-x-2">
          <span>Go to</span>
          <input
            type="number"
            className="border rounded px-2 py-2 w-16"
            min="1"
          />
          <span>page</span>
          <button
           className="bg-[#262262] text-white px-6 py-[10px] rounded-lg hover:cursor-pointer"
          >Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default systemRecord;
