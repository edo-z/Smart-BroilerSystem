export const PHASE_MAP = [
  { maxAge: 10,  tempLow: 33, tempHigh: 34, rhLow: 65, rhHigh: 70, label: "BA (Bayi)" },
  { maxAge: 18,  tempLow: 30, tempHigh: 32, rhLow: 60, rhHigh: 65, label: "BL (Bala)" },
  { maxAge: 28,  tempLow: 28, tempHigh: 29, rhLow: 60, rhHigh: 65, label: "T (Transisi)" },
  { maxAge: 38,  tempLow: 25, tempHigh: 27, rhLow: 55, rhHigh: 60, label: "PA (Akhir)" },
  { maxAge: 50,  tempLow: 24, tempHigh: 25, rhLow: 55, rhHigh: 60, label: "PL (Panen)" },
];

export function getPhase(age: number) {
  for (const p of PHASE_MAP) {
    if (age <= p.maxAge) return p;
  }
  return PHASE_MAP[PHASE_MAP.length - 1];
}

const SPIKE_MARGIN = 2;

export function isTempSpike(age: number, temp: number): boolean {
  return temp > getPhase(age).tempHigh + SPIKE_MARGIN;
}
