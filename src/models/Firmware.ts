import { ObjectId } from "mongodb";

export interface IFirmware {
  _id?: ObjectId;
  version: string;
  md5: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: ObjectId;
}