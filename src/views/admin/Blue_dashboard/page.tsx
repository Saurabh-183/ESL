"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const pieData1 = [
  { name: "Open", value: 1, color: "#ffb259" },
  { name: "Close", value: 0, color: "#f8f8f8" },
];

const pieData2 = [
  { name: "Bound", value: 3, color: "#41e29d" },
  { name: "Unbound", value: 1, color: "#98f5ce" },
];

const alertAnalysisData = [
  { name: "Gateway Offline", value: 9, color: "#f8c35e" },
  { name: "ESL Offline", value: 117, color: "#ff7f50" },
  { name: "TH sensor Alert", value: 0, color: "#d291bc" },
  { name: "Image Update Failed", value: 0, color: "#ff4d4f" },
  { name: "Low Battery", value: 0, color: "#00ffff" },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fullscreen handler
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  };

  useEffect(() => {
    const handleClick = () => {
      requestFullscreen();
      window.removeEventListener("click", handleClick);
    };
    window.addEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bg-[#04163c] text-white min-h-screen p-4 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-blue-700 pb-2 mb-4 gap-2">
        <h1 className="text-2xl font-bold text-blue-400">
          Do more Smart Cloud Platform
        </h1>
        <div className="text-blue-200 text-sm md:text-base">
          {formatDateTime(currentTime)}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Digital Entities */}
        <div className="bg-[#0f2749] rounded-lg p-4">
          <h2 className="text-green-400 mb-2">Digital Entities</h2>
          <div className="flex flex-col sm:flex-row justify-around">
            <div className="flex flex-col items-center">
              <h3 className="text-sm">Store Info</h3>
              <PieChart width={100} height={100}>
                <Pie data={pieData1} dataKey="value" outerRadius={40}>
                  {pieData1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-xs text-center text-orange-300">Open: 1</div>
              <div className="text-xs text-center text-gray-300">Close: 0</div>
            </div>
            <div className="flex flex-col items-center mt-4 sm:mt-0">
              <h3 className="text-sm">Product Info</h3>
              <PieChart width={100} height={100}>
                <Pie data={pieData2} dataKey="value" outerRadius={40}>
                  {pieData2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-xs text-center text-green-300">Bound: 3</div>
              <div className="text-xs text-center text-green-100">
                Unbound: 1
              </div>
            </div>
          </div>
        </div>

        {/* Device Overview */}
        <div className="bg-[#0f2749] rounded-lg p-4 text-center">
          <h2 className="text-cyan-300 text-lg mb-4">\\ Device Overview //</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-green-400 text-black p-2 rounded">
              Gateway
              <br />
              Online: 4
              <br />
              Offline: 1
            </div>
            <div className="bg-cyan-400 text-black p-2 rounded">
              ESL
              <br />
              Online: 2
              <br />
              Offline: 9
            </div>
            <div className="bg-sky-300 text-black p-2 rounded">
              LCD
              <br />
              Online: 6
              <br />
              Offline: 2
            </div>
            <div className="bg-purple-400 text-black p-2 rounded">
              TH sensor
              <br />
              Online: 1
              <br />
              Offline: 8
            </div>
            <div className="bg-orange-300 text-black p-2 rounded">
              mm-wave radar
              <br />
              Online: 0
              <br />
              Offline: 0
            </div>
            <div className="bg-red-400 text-black p-2 rounded">
              Other Devices
              <br />
              Online: 3
              <br />
              Offline: 5
            </div>
          </div>
        </div>

        {/* Alert Information */}
        <div className="bg-[#0f2749] rounded-lg p-4 overflow-x-auto">
          <h2 className="text-blue-300 mb-2">Alert Information</h2>
          <table className="text-xs w-full text-left">
            <thead>
              <tr className="text-gray-300">
                <th>Account</th>
                <th>Store</th>
                <th>Time</th>
                <th>Type</th>
                <th>MAC</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="text-gray-100">
                  <td>signfeed</td>
                  <td>HARIJ_Office</td>
                  <td>2025-07-08</td>
                  <td>ESL label</td>
                  <td>C300002...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#0f2749] rounded-lg p-4">
          <h2 className="text-blue-300 mb-2">LCD Image Status</h2>
          <div className="h-40 border border-blue-500"></div>
        </div>
        <div className="bg-[#0f2749] rounded-lg p-4">
          <h2 className="text-blue-300 mb-2">ESL Image Update Status</h2>
          <div className="h-40 border border-blue-500"></div>
        </div>
        <div className="bg-[#0f2749] rounded-lg p-4">
          <h2 className="text-blue-300 mb-2">Alert Analysis</h2>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={alertAnalysisData}
                dataKey="value"
                outerRadius={85}
                innerRadius={65}
              >
                {alertAnalysisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

