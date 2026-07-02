"use client";

import React, { useState, useEffect } from "react";
import {
  FaBolt,
  FaFire,
  FaStopCircle,
  FaPlayCircle,
  FaRedoAlt,
  FaPaperPlane,
  FaThermometerHalf,
  FaTint,
  FaFan,
  FaRobot,
  FaUser,
} from "react-icons/fa";

interface ControlPanelProps {
  publish: (topic: string, payload: string) => void;
  deviceId: string;
  currentVfd: number;
  currentDimmer: number;
  manualOverride: boolean;
  emergencyMode: boolean;
  currentTemp: number;
  currentHum: number;
}

export default function ControlPanel({
  publish,
  deviceId,
  currentVfd,
  currentDimmer,
  manualOverride,
  emergencyMode,
  currentTemp,
  currentHum,
}: ControlPanelProps) {
  const [mode, setMode] = useState<"auto" | "manual">(manualOverride ? "manual" : "auto");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [humMin, setHumMin] = useState("");
  const [humMax, setHumMax] = useState("");
  const [sending, setSending] = useState(false);
  const [rebootConfirm, setRebootConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localEmergency, setLocalEmergency] = useState(emergencyMode);

  useEffect(() => {
    setMode(manualOverride ? "manual" : "auto");
  }, [manualOverride]);

  useEffect(() => {
    if (!emergencyMode) setLocalEmergency(false);
  }, [emergencyMode]);

  const sendCommand = (payload: Record<string, unknown>) => {
    if (!deviceId || !publish) return;
    setSending(true);
    setFeedback(null);
    const topic = `device/${deviceId}/cmd`;
    publish(topic, JSON.stringify(payload));
    setTimeout(() => {
      setSending(false);
      setFeedback("Terkirim");
      setTimeout(() => setFeedback(null), 2000);
    }, 500);
  };

  const handleSendSetpoint = () => {
    const tMin = parseFloat(tempMin);
    const tMax = parseFloat(tempMax);
    const hMin = parseFloat(humMin);
    const hMax = parseFloat(humMax);
    if (isNaN(tMin) && isNaN(tMax) && isNaN(hMin) && isNaN(hMax)) return;
    const payload: Record<string, unknown> = { type: "setpoint" };
    if (!isNaN(tMin)) payload.tempMin = tMin;
    if (!isNaN(tMax)) payload.tempMax = tMax;
    if (!isNaN(hMin)) payload.humMin = hMin;
    if (!isNaN(hMax)) payload.humMax = hMax;
    sendCommand(payload);
  };

  const handleEmergencyStop = () => {
    sendCommand({ type: "emergency", action: "stop" });
    setLocalEmergency(true);
  };

  const handleEmergencyResume = () => {
    sendCommand({ type: "emergency", action: "resume" });
    setLocalEmergency(false);
  };

  const handleReboot = () => {
    sendCommand({ type: "reboot" });
    setRebootConfirm(false);
  };

  const handleModeToggle = (newMode: "auto" | "manual") => {
    setMode(newMode);
    sendCommand({ type: "control", mode: newMode });
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FaBolt className="text-amber-500 text-sm" />
          <span className="font-semibold text-slate-800 text-sm">Kontrol Manual</span>
          {manualOverride && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
              Manual
            </span>
          )}
          {mode === "manual" && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
              Threshold ON/OFF
            </span>
          )}
        </div>
        {feedback && (
          <span className="text-[10px] font-medium text-emerald-600">{feedback}</span>
        )}
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Mode:</span>
          <button
            onClick={() => handleModeToggle("auto")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              mode === "auto"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <FaRobot className="text-[10px]" /> Auto
          </button>
          <button
            onClick={() => handleModeToggle("manual")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              mode === "manual"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <FaUser className="text-[10px]" /> Manual
          </button>
        </div>

        {mode === "manual" && (
          <p className="text-[10px] text-slate-400 leading-relaxed">
            VFD/Dimmer dikontrol otomatis berdasarkan Rentang Suhu/RH di bawah. 
            Slider di bawah hanya menampilkan nilai aktual.
          </p>
        )}

        {/* VFD */}
        {mode === "auto" ? (
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1.5">
                <FaFan className="text-blue-400 text-[10px]" /> VFD
              </span>
              <span>{Math.round(currentVfd)}/255 ({Math.round((currentVfd / 255) * 100)}%)</span>
            </label>
            <input
              type="range" min={0} max={255} value={currentVfd} disabled
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                accent-slate-300 disabled:accent-slate-300
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-300
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FaFan className="text-blue-400 text-[10px]" /> VFD
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              currentVfd > 0
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                currentVfd > 0 ? "bg-green-500" : "bg-slate-300"
              }`} />
              {currentVfd > 0 ? "ON" : "OFF"} ({Math.round((currentVfd / 255) * 100)}%)
            </span>
          </div>
        )}

        {/* Dimmer */}
        {mode === "auto" ? (
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1.5">
                <FaFire className="text-red-400 text-[10px]" /> Dimmer
              </span>
              <span>{Math.round(currentDimmer)}/255 ({Math.round((currentDimmer / 255) * 100)}%)</span>
            </label>
            <input
              type="range" min={0} max={255} value={currentDimmer} disabled
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                accent-slate-300 disabled:accent-slate-300
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-300
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FaFire className="text-red-400 text-[10px]" /> Dimmer
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              currentDimmer > 0
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                currentDimmer > 0 ? "bg-red-500" : "bg-slate-300"
              }`} />
              {currentDimmer > 0 ? "ON" : "OFF"} ({Math.round((currentDimmer / 255) * 100)}%)
            </span>
          </div>
        )}

        {/* Setpoint Suhu — min/max */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
            <FaThermometerHalf className="text-orange-400 text-[10px]" /> Rentang Suhu
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[9px] text-slate-400 block mb-0.5">Min</span>
              <input
                type="number"
                step={0.5}
                min={15}
                max={42}
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                placeholder={String(Math.round(currentTemp * 10) / 10 - 1)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs
                  focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
              />
            </div>
            <span className="text-slate-300 text-xs mt-4">—</span>
            <div className="flex-1">
              <span className="text-[9px] text-slate-400 block mb-0.5">Maks</span>
              <input
                type="number"
                step={0.5}
                min={15}
                max={42}
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                placeholder={String(Math.round(currentTemp * 10) / 10 + 1)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs
                  focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Aktual: {currentTemp.toFixed(1)}&deg;C</span>
        </div>

        {/* Setpoint RH — min/max */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
            <FaTint className="text-blue-400 text-[10px]" /> Rentang RH
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[9px] text-slate-400 block mb-0.5">Min</span>
              <input
                type="number"
                step={1}
                min={20}
                max={95}
                value={humMin}
                onChange={(e) => setHumMin(e.target.value)}
                placeholder={String(Math.round(currentHum) - 5)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs
                  focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
              />
            </div>
            <span className="text-slate-300 text-xs mt-4">—</span>
            <div className="flex-1">
              <span className="text-[9px] text-slate-400 block mb-0.5">Maks</span>
              <input
                type="number"
                step={1}
                min={20}
                max={95}
                value={humMax}
                onChange={(e) => setHumMax(e.target.value)}
                placeholder={String(Math.round(currentHum) + 5)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs
                  focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Aktual: {currentHum.toFixed(0)}%</span>
        </div>

        <button
          onClick={handleSendSetpoint}
          disabled={sending || (!tempMin && !tempMax && !humMin && !humMax)}
          className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <FaPaperPlane className="text-[10px]" />
          {sending ? "Mengirim..." : "Set Rentang"}
        </button>

        {/* Emergency + Reboot */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {(localEmergency || emergencyMode) ? (
            <button
              onClick={handleEmergencyResume}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-medium hover:bg-emerald-100 transition-colors"
            >
              <FaPlayCircle className="text-[10px]" /> Resume
            </button>
          ) : (
            <button
              onClick={handleEmergencyStop}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-medium hover:bg-red-100 transition-colors"
            >
              <FaStopCircle className="text-[10px]" /> Emergency Stop
            </button>
          )}

          {!rebootConfirm ? (
            <button
              onClick={() => setRebootConfirm(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-medium hover:bg-slate-200 transition-colors"
            >
              <FaRedoAlt className="text-[10px]" /> Reboot
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500">Yakin?</span>
              <button
                onClick={handleReboot}
                className="px-2 py-1 bg-red-500 text-white rounded-xl text-[10px] font-medium hover:bg-red-600 transition-colors"
              >
                Ya
              </button>
              <button
                onClick={() => setRebootConfirm(false)}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-medium hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
