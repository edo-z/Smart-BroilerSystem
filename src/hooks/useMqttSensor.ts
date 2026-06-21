"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

export interface MqttSensorPayload {
  deviceId: string;
  temperature: number;
  humidity: number;
  age: number;
  vfd: number;
  dimmer: number;
  manualOverride?: boolean;
}

export type MqttStatus = "connected" | "reconnecting" | "disconnected";

export function useMqttSensor(onMessage: (data: MqttSensorPayload) => void) {
  const [status, setStatus] = useState<MqttStatus>("disconnected");
  const onMessageRef = useRef(onMessage);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const clientId = "dashboard-" + Math.random().toString(36).substring(2, 10);
    const client = mqtt.connect("wss://mqtt.aldozeno.my.id:443/mqtt", {
      username: "admin",
      password: "ewaldo12345",
      clientId,
      clean: true,
      reconnectPeriod: 5000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setStatus("connected");
      client.subscribe("device/+/data");
    });

    client.on("reconnect", () => {
      setStatus("reconnecting");
    });

    client.on("close", () => {
      setStatus("disconnected");
    });

    client.on("message", (topic, payload) => {
      try {
        const data: MqttSensorPayload = JSON.parse(payload.toString());
        onMessageRef.current(data);
      } catch (e) {
        console.error("MQTT parse error:", e);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      clientRef.current = null;
      client.end(true);
    };
  }, []);

  const publish = useCallback((topic: string, payload: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(topic, payload);
    }
  }, []);

  return { status, publish };
}
