"use client";

import React, { useState, useEffect } from "react";
import { FaUpload, FaRocket, FaMicrochip, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

interface Device {
  _id: string;
  name: string;
  active: boolean;
}

interface Firmware {
  version: string;
  md5: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface OTAStatus {
  status: "idle" | "uploading" | "triggering" | "success" | "failed";
  message: string;
  deviceId?: string;
  version?: string;
}

export default function OTAComponent({ userId }: { userId: string }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [firmwares, setFirmwares] = useState<Firmware[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [otaStatus, setOtaStatus] = useState<OTAStatus>({ status: "idle", message: "" });

  useEffect(() => {
    fetchDevices();
    fetchFirmwares();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/ota/devices");
      const data = await res.json();
      if (data.success) {
        setDevices(data.devices);
        if (data.devices.length > 0) {
          setSelectedDevice(data.devices[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchFirmwares = async () => {
    try {
      const res = await fetch("/api/ota/firmwares");
      const data = await res.json();
      if (data.success) {
        setFirmwares(data.firmwares);
        if (data.firmwares.length > 0) {
          setSelectedVersion(data.firmwares[0].version);
        }
      }
    } catch (error) {
      console.error("Error fetching firmwares:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setOtaStatus({ status: "failed", message: "Pilih file firmware terlebih dahulu" });
      return;
    }

    setOtaStatus({ status: "uploading", message: "Mengupload firmware..." });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const res = await fetch("/api/ota/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setOtaStatus({ status: "success", message: `Firmware v${data.firmware.version} berhasil diupload!` });
        fetchFirmwares();
        setFile(null);
      } else {
        setOtaStatus({ status: "failed", message: data.error || "Upload gagal" });
      }
    } catch (error) {
      setOtaStatus({ status: "failed", message: "Error uploading firmware" });
    }
  };

  const handleTrigger = async () => {
    if (!selectedDevice || !selectedVersion) {
      setOtaStatus({ status: "failed", message: "Pilih device dan version terlebih dahulu" });
      return;
    }

    setOtaStatus({ status: "triggering", message: "Mengirim perintah OTA..." });

    try {
      const res = await fetch("/api/ota/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: selectedDevice, version: selectedVersion }),
      });
      const data = await res.json();

      if (data.success) {
        setOtaStatus({ 
          status: "success", 
          message: `OTA command dikirim ke device!`,
          deviceId: data.deviceId,
          version: data.version 
        });
      } else {
        setOtaStatus({ status: "failed", message: data.error || "Trigger gagal" });
      }
    } catch (error) {
      setOtaStatus({ status: "failed", message: "Error triggering OTA" });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusIcon = () => {
    switch (otaStatus.status) {
      case "uploading":
      case "triggering":
        return <FaSpinner className="animate-spin" />;
      case "success":
        return <FaCheck className="text-green-500" />;
      case "failed":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaMicrochip />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
          <FaRocket className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">OTA Firmware Update</h2>
          <p className="text-gray-500">Kelola dan update firmware ESP32</p>
        </div>
      </div>

      {/* Status Alert */}
      {otaStatus.message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
          otaStatus.status === "success" ? "bg-green-50 text-green-700" :
          otaStatus.status === "failed" ? "bg-red-50 text-red-700" :
          otaStatus.status === "uploading" || otaStatus.status === "triggering" ? "bg-blue-50 text-blue-700" :
          "bg-gray-50 text-gray-700"
        }`}>
          {getStatusIcon()}
          <span>{otaStatus.message}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FaUpload /> Upload Firmware
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept=".bin"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="firmware-upload"
            />
            <label htmlFor="firmware-upload" className="cursor-pointer">
              <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {file ? file.name : "Klik untuk memilih file .bin"}
              </p>
              {file && (
                <p className="text-sm text-gray-400 mt-1">
                  {formatSize(file.size)}
                </p>
              )}
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || otaStatus.status === "uploading"}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {otaStatus.status === "uploading" ? <FaSpinner className="animate-spin" /> : <FaUpload />}
            Upload Firmware
          </button>
        </div>

        {/* Trigger Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FaRocket /> Trigger OTA
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Device</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.name} {device.active ? "(Aktif)" : "(Nonaktif)"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Firmware</label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {firmwares.map((fw) => (
                <option key={fw.version} value={fw.version}>
                  v{fw.version} ({formatSize(fw.size)})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTrigger}
            disabled={!selectedDevice || !selectedVersion || otaStatus.status === "triggering"}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {otaStatus.status === "triggering" ? <FaSpinner className="animate-spin" /> : <FaRocket />}
            Kirim Perintah OTA
          </button>
        </div>
      </div>

      {/* Firmware List */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-4">Riwayat Firmware</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Versi</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Size</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">MD5</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {firmwares.map((fw) => (
                <tr key={fw.version} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">v{fw.version}</td>
                  <td className="px-4 py-2 text-gray-500">{formatSize(fw.size)}</td>
                  <td className="px-4 py-2 text-gray-400 font-mono text-xs">{fw.md5.substring(0, 16)}...</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(fw.uploadedAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {firmwares.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Belum ada firmware yang diupload
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FaCloudUploadAlt(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  );
}