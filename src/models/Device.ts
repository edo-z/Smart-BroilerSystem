// src/models/Device.ts
import { ObjectId } from "mongodb";

export interface IDevice {
  _id?: ObjectId;
  userId: ObjectId;        // ref → users._id
  name: string;            // "Kandang A1"
  capacity: number;        // jumlah ayam
  active: boolean;
  apiKey: string;          // untuk autentikasi ESP32
  claimCode: string;       // kode QR sementara saat setup
  claimed: boolean;        // false = belum diklaim ESP32
  createdAt: Date;
}