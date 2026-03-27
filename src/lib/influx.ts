import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.INFLUX_URL || '';
const token = process.env.INFLUX_TOKEN || '';
const org = process.env.INFLUX_ORG || '';

if (!url || !token || !org) {
  throw new Error('Missing InfluxDB environment variables');
}

// Inisialisasi Client
export const influxClient = new InfluxDB({ url, token });

// Export QueryApi untuk digunakan di API Routes
export const queryClient = influxClient.getQueryApi(org);

// Helper untuk Flux Query sederhana
export const BUCKET = process.env.INFLUX_BUCKET || 'kandang';