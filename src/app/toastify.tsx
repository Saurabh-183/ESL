// app/toastify.tsx
"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = () => {
  return <ToastContainer position="top-right" autoClose={1500} />;
};

export default Toastify;
