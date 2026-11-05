import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Card = ({ label, value, color }) => (
    <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

export default function Dashboard({ stats, today }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Dashboard Admin</h2>}
        >
            <Head title="Dashboard Admin" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl space-y-6 px-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Card label="Total Peserta" value={stats.total} color="text-gray-800" />
                        <Card label="Hadir Hari Ini" value={stats.present} color="text-green-600" />
                        <Card label="Terlambat" value={stats.late} color="text-yellow-600" />
                        <Card label="Belum Check-in" value={stats.absent} color="text-red-600" />
                    </div>

                    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-3 font-semibold">Absensi Hari Ini</h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Instansi</th>
                                    <th className="p-2">Masuk</th>
                                    <th className="p-2">Pulang</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {today.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-3 text-center text-gray-400">
                                            Belum ada yang check-in hari ini.
                                        </td>
                                    </tr>
                                )}
                                {today.map((a) => (
                                    <tr key={a.id} className="border-t">
                                        <td className="p-2">{a.user.name}</td>
                                        <td className="p-2">{a.user.institution ?? '-'}</td>
                                        <td className="p-2">{a.check_in ?? '-'}</td>
                                        <td className="p-2">{a.check_out ?? '-'}</td>
                                        <td className="p-2">
                                            {a.status === 'late' ? 'Terlambat' : 'Tepat waktu'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}