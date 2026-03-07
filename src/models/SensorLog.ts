// src/models/SensorLog.ts
import { ObjectId } from "mongodb";

export interface ISensorLog {
  _id?: ObjectId;
  deviceId: ObjectId;      // ref → devices._id
  temperature: number;     // suhu dalam °C
  humidity: number;        // kelembapan dalam %
  recordedAt: Date;        // waktu data dikirim ESP32
}