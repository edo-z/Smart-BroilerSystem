// src/models/Device.ts
import { ObjectId } from "mongodb";

export interface IDevice {
  _id?: ObjectId;
  userId: ObjectId;        // ref → users._id
  name: string;            // "Kandang A1"
  capacity: number;        // kapasitas maksimal
  currentPopulation?: number; // jumlah ayam masuk aktual
  active: boolean;
  apiKey: string;          // untuk autentikasi ESP32
  claimCode: string;       // kode QR sementara saat setup
  claimed: boolean;        // false = belum diklaim ESP32
  harvestTargetDate?: Date | null; // target tanggal panen
  harvestProcessed?: boolean; // sudah diproses saat panen?
  docDate?: Date | null; // tanggal DOC (Day Old Chick)
  createdAt: Date;
}