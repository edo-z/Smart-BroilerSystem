import { ObjectId } from "mongodb";

export interface ISensorLog {
  _id?: ObjectId;
  deviceId: ObjectId;
  temperature: number;
  humidity: number;
  age: number;
  vfd: number;
  dimmer: number;
  timestamp: Date;
  createdAt: Date;
}