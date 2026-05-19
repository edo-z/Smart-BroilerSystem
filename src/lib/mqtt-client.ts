import mqtt from "mqtt";

const MQTT_BROKER = "mqtts://pa120029.ala.asia-southeast1.emqxsl.com:8883";
const MQTT_USER = "aldoo";
const MQTT_PASS = "Ew4ld012345";

export type SensorData = {
  deviceId: string;
  temperature: number;
  humidity: number;
  age: number;
  vfd: number;
  dimmer: number;
  timestamp: string;
};

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

type DataCallback = (data: SensorData) => void;
type StateCallback = (state: ConnectionState) => void;

class MQTTClient {
  private client: mqtt.MqttClient | null = null;
  private dataCallbacks: Set<DataCallback> = new Set();
  private stateCallbacks: Set<StateCallback> = new Set();
  private subscribedDevices: Set<string> = new Set();
  private isConnecting: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect() {
    if (this.client?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.notifyState("connecting");

    this.client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USER,
      password: MQTT_PASS,
      clientId: `dashboard-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      reconnectPeriod: 5000,
      connectTimeout: 15000,
      clean: true,
      protocol: "mqtt",
      rejectUnauthorized: false,
    });

    this.client.on("connect", () => {
      console.log("[MQTT] Connected to broker");
      this.isConnecting = false;
      this.notifyState("connected");
      this.resubscribeAll();
    });

    this.client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        // Parse topic: device/<deviceId>/data
        const match = topic.match(/device\/([a-f0-9]+)\/data/);
        if (match) {
          const deviceId = match[1];
          const data: SensorData = {
            deviceId,
            temperature: payload.temperature || 0,
            humidity: payload.humidity || 0,
            age: payload.age || 0,
            vfd: payload.vfd || 0,
            dimmer: payload.dimmer || 0,
            timestamp: new Date().toISOString(),
          };
          
          this.dataCallbacks.forEach(cb => cb(data));
        }
      } catch (err) {
        console.error("[MQTT] Parse error:", err);
      }
    });

    this.client.on("error", (err) => {
      console.error("[MQTT] Error:", err);
      this.isConnecting = false;
      this.notifyState("error");
    });

    this.client.on("close", () => {
      console.log("[MQTT] Disconnected");
      this.notifyState("disconnected");
      this.isConnecting = false;
      this.scheduleReconnect();
    });

    this.client.on("offline", () => {
      console.log("[MQTT] Offline");
      this.notifyState("disconnected");
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      console.log("[MQTT] Attempting reconnect...");
      this.connect();
    }, 5000);
  }

  private notifyState(state: ConnectionState) {
    this.stateCallbacks.forEach(cb => cb(state));
  }

  private resubscribeAll() {
    this.subscribedDevices.forEach(deviceId => {
      this.subscribeDevice(deviceId);
    });
  }

  subscribeDevice(deviceId: string) {
    if (!this.client?.connected) {
      console.log("[MQTT] Not connected, queuing subscription for:", deviceId);
      return;
    }

    const topic = `device/${deviceId}/data`;
    this.client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error("[MQTT] Subscribe error:", err);
      } else {
        console.log("[MQTT] Subscribed to:", topic);
        this.subscribedDevices.add(deviceId);
      }
    });
  }

  unsubscribeDevice(deviceId: string) {
    if (!this.client?.connected) return;

    const topic = `device/${deviceId}/data`;
    this.client.unsubscribe(topic, (err) => {
      if (!err) {
        console.log("[MQTT] Unsubscribed from:", topic);
        this.subscribedDevices.delete(deviceId);
      }
    });
  }

  onData(callback: DataCallback) {
    this.dataCallbacks.add(callback);
    return () => this.dataCallbacks.delete(callback);
  }

  onStateChange(callback: StateCallback) {
    this.stateCallbacks.add(callback);
    return () => this.stateCallbacks.delete(callback);
  }

  getState(): ConnectionState {
    if (this.isConnecting) return "connecting";
    if (this.client?.connected) return "connected";
    return "disconnected";
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.client?.end();
    this.client = null;
    this.subscribedDevices.clear();
    this.notifyState("disconnected");
  }
}

export const mqttClient = new MQTTClient();
export default mqttClient;