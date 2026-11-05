import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ today, history }) {
    const { errors, flash } = usePage().props;
    const [now, setNow] = useState(new Date());

    // Jam berjalan, update tiap 1 detik
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const checkIn = () =>
        router.post(route('attendance.checkin'), {}, { preserveScroll: true });

    const checkOut = () =>
        router.post(route('attendance.checkout'), {}, { preserveScroll: true });

    const statusLabel = (status) => {
        if (status === 'late') return 'Terlambat';
        if (status === 'on_time') return 'Tepat waktu';
        return '-';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Absensi</h2>}
        >
            <Head title="Absensi" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4">
                    {/* Kartu absensi hari ini */}
                    <div className="rounded-lg bg-white p-6 text-center shadow">
                        <p className="text-gray-500">
                            {now.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                        <p className="my-2 text-4xl font-bold">
                            {now.toLocaleTimeString('id-ID')}
                        </p>

                        {flash?.success && (
                            <p className="mt-2 text-green-600">{flash.success}</p>
                        )}
                        {errors?.message && (
                            <p className="mt-2 text-red-600">{errors.message}</p>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded bg-gray-50 p-3">
                                <p className="text-gray-500">Check-in</p>
                                <p className="text-lg font-semibold">{today?.check_in ?? '-'}</p>
                            </div>
                            <div className="rounded bg-gray-50 p-3">
                                <p className="text-gray-500">Check-out</p>
                                <p className="text-lg font-semibold">{today?.check_out ?? '-'}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={checkIn}
                                disabled={!!today}
                                className="rounded bg-green-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Check-in
                            </button>
                            <button
                                onClick={checkOut}
                                disabled={!today || !!today?.check_out}
                                className="rounded bg-red-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Check-out
                            </button>
                        </div>
                    </div>

                    {/* Riwayat absensi */}
                    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-3 font-semibold">Riwayat Absensi</h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Tanggal</th>
                                    <th className="p-2">Masuk</th>
                                    <th className="p-2">Pulang</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-3 text-center text-gray-400">
                                            Belum ada data absensi.
                                        </td>
                                    </tr>
                                )}
                                {history.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2">{item.date}</td>
                                        <td className="p-2">{item.check_in ?? '-'}</td>
                                        <td className="p-2">{item.check_out ?? '-'}</td>
                                        <td className="p-2">{statusLabel(item.status)}</td>
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