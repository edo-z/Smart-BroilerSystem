"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import mqttClient, { SensorData, ConnectionState } from "@/lib/mqtt-client";

interface MQTTContextType {
  isConnected: boolean;
  connectionState: ConnectionState;
  latestData: Map<string, SensorData>;
  subscribeDevice: (deviceId: string) => void;
  unsubscribeDevice: (deviceId: string) => void;
  reconnect: () => void;
}

const MQTTContext = createContext<MQTTContextType | undefined>(undefined);

export function MQTTProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [latestData, setLatestData] = useState<Map<string, SensorData>>(new Map());

  useEffect(() => {
    // Connect to MQTT broker
    mqttClient.connect();

    // Subscribe to state changes
    const unsubState = mqttClient.onStateChange((state) => {
      setConnectionState(state);
      setIsConnected(state === "connected");
    });

    // Subscribe to data messages
    const unsubData = mqttClient.onData((data) => {
      setLatestData(prev => {
        const newMap = new Map(prev);
        newMap.set(data.deviceId, data);
        return newMap;
      });
    });

    return () => {
      unsubState();
      unsubData();
      mqttClient.disconnect();
    };
  }, []);

  const subscribeDevice = useCallback((deviceId: string) => {
    mqttClient.subscribeDevice(deviceId);
  }, []);

  const unsubscribeDevice = useCallback((deviceId: string) => {
    mqttClient.unsubscribeDevice(deviceId);
  }, []);

  const reconnect = useCallback(() => {
    mqttClient.disconnect();
    mqttClient.connect();
  }, []);

  return (
    <MQTTContext.Provider
      value={{
        isConnected,
        connectionState,
        latestData,
        subscribeDevice,
        unsubscribeDevice,
        reconnect,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
}

export function useMQTT() {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error("useMQTT must be used within MQTTProvider");
  }
  return context;
}