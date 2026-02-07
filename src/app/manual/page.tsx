import { HiCheckCircle, HiPlay, HiSave, HiCloudUpload } from "react-icons/hi";

export default function ManualPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Manual Operation</h1>
        <p className="text-gray-500">Panduan standar operasional prosedur sistem</p>
      </div>

      {/* SECTION 1: STEPS INDICATOR */}
      <div className="bg-base-200 p-8 rounded-2xl mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <HiPlay className="text-primary" /> Alur Pengoperasian
        </h2>
        <ul className="steps steps-vertical lg:steps-horizontal w-full">
          <li className="step step-primary">Persiapan Data</li>
          <li className="step step-primary">Konfigurasi</li>
          <li className="step">Eksekusi</li>
          <li className="step">Selesai</li>
        </ul>
      </div>

      {/* SECTION 2: DETAILED TIMELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Langkah Detil</h2>
          <ul className="timeline timeline-vertical">
            <li>
              <div className="timeline-start">Langkah 1</div>
              <div className="timeline-middle">
                <HiCheckCircle className="text-primary w-5 h-5" />
              </div>
              <div className="timeline-end timeline-box">
                Nyalakan mesin dan pastikan indikator menyala hijau.
              </div>
              <hr className="bg-primary" />
            </li>
            <li>
              <hr className="bg-primary" />
              <div className="timeline-start">Langkah 2</div>
              <div className="timeline-middle">
                <HiSave className="text-primary w-5 h-5" />
              </div>
              <div className="timeline-end timeline-box">
                Input data parameter ke dalam modul konfigurasi.
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-start">Langkah 3</div>
              <div className="timeline-middle">
                <HiCloudUpload className="w-5 h-5" />
              </div>
              <div className="timeline-end timeline-box">
                Tekan tombol <strong>Upload</strong> untuk sinkronisasi cloud.
              </div>
            </li>
          </ul>
        </div>

        {/* SECTION 3: QUICK TIPS/ALERT */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Peringatan Keamanan</h2>
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Prosedur Keadaan Darurat
            </div>
            <div className="collapse-content">
              <p>Segera tekan tombol merah di panel utama jika terjadi korsleting.</p>
            </div>
          </div>
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              Pemeliharaan Rutin
            </div>
            <div className="collapse-content">
              <p>Bersihkan filter setiap 100 jam pemakaian menggunakan alkohol 70%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}