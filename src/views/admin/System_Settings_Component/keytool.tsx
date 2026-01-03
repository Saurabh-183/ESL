"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const generatePrivateKey = () => {
  const randomBytes = new Uint8Array(256);
  window.crypto.getRandomValues(randomBytes);
  return btoa(String.fromCharCode(...randomBytes));
};

const generatePublicKey = (privateKey: string) => {
  return btoa(privateKey).slice(0, 200);
};

export default function KeyTool() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handleGenerateKeys = () => {
    const privKey = generatePrivateKey();
    const pubKey = generatePublicKey(privKey);
    setPrivateKey(privKey);
    setPublicKey(pubKey);
    toast.success("✅ Key pair generated successfully!");
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`📋 ${label} copied to clipboard!`))
      .catch(() => toast.error(`❌ Failed to copy ${label}.`));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
   <div className="mb-8 text-center">
        <button
          onClick={handleGenerateKeys}
          className="bg-[#262262] text-white px-6 py-[10px] rounded-lg hover:cursor-pointer"
        >
          Create
        </button>
      </div>

      {/* Private Key */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Private Key
        </label>
        <textarea
          rows={8}
          value={privateKey}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-md resize-none bg-gray-50 text-sm"
        />
        <div className="text-right mt-2">
          <button
            onClick={() => handleCopy(privateKey, "Private Key")}
            className="bg-[#262262] text-white px-6 py-[10px] rounded-lg hover:cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Public Key */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Public Key
        </label>
        <textarea
          rows={5}
          value={publicKey}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-md resize-none bg-gray-50 text-sm"
        />
        <div className="text-right mt-2">
          <button
            onClick={() => handleCopy(publicKey, "Public Key")}
            className="bg-[#262262] text-white px-6 py-[10px] rounded-lg hover:cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
