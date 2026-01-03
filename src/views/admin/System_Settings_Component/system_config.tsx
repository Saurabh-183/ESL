"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/Button";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f8f8f9] rounded-lg p-4 my-4 shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer text-gray-600 font-bold text-lg"
        onClick={() => setOpen(!open)}
      >
        {title} {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const ConfigInput = ({
  label,
  required = false,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="flex items-center relative mb-4">
      <label className="w-1/3 text-right pr-4 text-sm">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Please enter ${label.toLowerCase()}`}
        className="w-2/3 border border-gray-300 p-2 rounded text-sm"
      />
      <Trash2 className="absolute right-2 text-gray-400 hover:text-red-500 cursor-pointer" />
    </div>
  );
};

const ConfigUpload = ({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note: string;
  value: string | null;
  onChange: (val: string | null) => void;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center text-center relative group">
      <label className="w-[80px] h-[80px] border-dashed border border-gray-300 rounded flex items-center justify-center mb-2 cursor-pointer overflow-hidden">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-500 text-2xl">+</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
      <div className="text-xs text-gray-700 max-w-[120px]">{note}</div>
      {value && (
        <Trash2
          className="text-gray-400 hover:text-red-500 cursor-pointer mt-1"
          onClick={() => onChange(null)}
        />
      )}
    </div>
  );
};

const SystemConfigPage = () => {
  const [logo1, setLogo1] = useState<string | null>(null);
  const [logo2, setLogo2] = useState<string | null>(null);
  const [logo3, setLogo3] = useState<string | null>(null);

  const [merchantInfo, setMerchantInfo] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
    qq: "",
    wechat: null as string | null,
  });

  const [emailConfig, setEmailConfig] = useState({
    host: "",
    sender: "",
    authCode: "",
    port: "",
  });

  const validateMerchantInfo = () => {
    return merchantInfo.name && merchantInfo.contact && merchantInfo.address;
  };

  const validateLogos = () => {
    return logo1 && logo2 && logo3;
  };

  const validateEmailConfig = () => {
    return emailConfig.host && emailConfig.authCode && emailConfig.port;
  };

  const handleSaveLogos = () => {
    if (!validateLogos()) return toast.error("Please upload all logo images");
    toast.success("Saved successfully!");
  };

  const handleSaveMerchant = () => {
    if (!validateMerchantInfo())
      return toast.error("Please fill all required merchant fields");
    toast.success("Saved successfully!");
  };

  const handleSaveEmail = () => {
    if (!validateEmailConfig())
      return toast.error("Please fill all required email fields");
    toast.success("Saved successfully!");
  };

  return (
    <div className="mx-auto mt-10 text-gray-800">
      <Section title="Logo setting">
        <div className="flex gap-4 justify-around flex-wrap text-gray-600">
          <ConfigUpload
            label="Extend menu logo"
            note="The best size of logo image is 160*40 when extending menu"
            value={logo1}
            onChange={setLogo1}
          />
          <ConfigUpload
            label="Minimize menu logo"
            note="The best size of logo image is 60*40 when minimizing menu"
            value={logo2}
            onChange={setLogo2}
          />
          <ConfigUpload
            label="ESL icon"
            note="The best icon size is 16*16 on the ESL page"
            value={logo3}
            onChange={setLogo3}
          />
        </div>

        <div className="text-sm text-gray-700 mt-4 items-center text-center">
          <strong>Illustration</strong>
          <p className="text-sm text-gray-600 mt-2">
            <strong> * Note:</strong> Please upload the logo with a transparent
            background image in <strong>PNG</strong> format.
          </p>
        </div>

        {/* Align Save Button to the right */}
        <div className="flex justify-end mt-4">
          <button
            className="text-white px-6 py-2 rounded bg-[#262262] text-white hover:cursor-pointer"
            onClick={handleSaveLogos}
          >
            Save
          </button>
        </div>
      </Section>

      <Section title="Merchant basic info settings">
        {/* Basic Info Inputs */}
        <ConfigInput
          label="Merchant full name"
          required
          value={merchantInfo.name}
          onChange={(val) => setMerchantInfo({ ...merchantInfo, name: val })}
        />
        <ConfigInput
          label="Contact number"
          required
          value={merchantInfo.contact}
          onChange={(val) => setMerchantInfo({ ...merchantInfo, contact: val })}
        />
        <ConfigInput
          label="Contact address"
          required
          value={merchantInfo.address}
          onChange={(val) => setMerchantInfo({ ...merchantInfo, address: val })}
        />
        <ConfigInput
          label="Email"
          value={merchantInfo.email}
          onChange={(val) => setMerchantInfo({ ...merchantInfo, email: val })}
        />
        <ConfigInput
          label="QQ"
          value={merchantInfo.qq}
          onChange={(val) => setMerchantInfo({ ...merchantInfo, qq: val })}
        />
        <div className="flex items-start gap-4 mb-4">
          <div className="w-1/3 text-right pr-4 text-sm pt-2">
            Wechat official account
          </div>
          <div className="flex-1 relative">
            <ConfigUpload
              label="Wechat QR"
              note="Please upload the QR code of the Wechat official account"
              value={merchantInfo.wechat}
              onChange={(val) =>
                setMerchantInfo({ ...merchantInfo, wechat: val })
              }
            />
            <Trash2
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={() => setMerchantInfo({ ...merchantInfo, wechat: "" })}
            />
          </div>
        </div>

        {/* Save Button Right-Aligned (Optional) */}
        <div className="flex justify-end mt-4">
          <button
            className="text-white px-6 py-2 rounded bg-[#262262] text-white hover:cursor-pointer"
            onClick={handleSaveMerchant}
          >
            Save
          </button>
        </div>
      </Section>

      <Section title="Warning sender email configuration">
        {/* Host */}
        <ConfigInput
          label="Host settings"
          required
          value={emailConfig.host}
          onChange={(val) => setEmailConfig({ ...emailConfig, host: val })}
        />

        {/* Sender Email */}
        <ConfigInput
          label="Sending email"
          value={emailConfig.sender}
          onChange={(val) => setEmailConfig({ ...emailConfig, sender: val })}
        />

        {/* Authorization Code */}
        <ConfigInput
          label="Email authorization code"
          required
          value={emailConfig.authCode}
          onChange={(val) => setEmailConfig({ ...emailConfig, authCode: val })}
        />

        {/* Port */}
        <ConfigInput
          label="Port settings"
          required
          value={emailConfig.port}
          onChange={(val) => setEmailConfig({ ...emailConfig, port: val })}
        />

        {/* Save Button aligned right */}
        <div className="flex justify-end mt-4">
          <button
            className="text-white px-6 py-2 rounded bg-[#262262] text-white hover:cursor-pointer"
            onClick={handleSaveEmail}
          >
            Save
          </button>
        </div>
      </Section>
    </div>
  );
};

export default SystemConfigPage;
