// src/models/Harvest.ts
import { ObjectId } from "mongodb";

export interface IHarvest {
  _id?: ObjectId;
  deviceId: ObjectId;
  deviceName: string;
  harvestDate: Date;
  targetDate: Date;
  population: number;
  capacity: number;
  cycleDays: number;
  createdAt: Date;
}
