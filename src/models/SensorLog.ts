// src/models/SensorLog.ts
export interface ISensorLog {
  _time: string;          // Waktu dari InfluxDB (ISO String)
  kandang_id: string;     // Tag yang kita simpan
  temperature: number;    // Field
  humidity: number;       // Field
  _measurement: string;   // Biasanya "sensor_data"
}