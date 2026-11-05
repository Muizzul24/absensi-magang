import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Reports({ attendances, interns, filters }) {
    const [form, setForm] = useState({
        user_id: filters.user_id ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });

    const terapkan = (e) => {
        e.preventDefault();
        router.get(route('admin.reports'), form, { preserveState: true });
    };

    const reset = () => {
        setForm({ user_id: '', from: '', to: '' });
        router.get(route('admin.reports'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Laporan Absensi</h2>}
        >
            <Head title="Laporan Absensi" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl space-y-4 px-4">
                    {/* Filter */}
                    <form
                        onSubmit={terapkan}
                        className="flex flex-wrap items-end gap-3 rounded-lg bg-white p-4 shadow"
                    >
                        <div>
                            <label className="block text-sm text-gray-600">Peserta</label>
                            <select
                                value={form.user_id}
                                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                                className="rounded border-gray-300 text-sm"
                            >
                                <option value="">Semua peserta</option>
                                {interns.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Dari tanggal</label>
                            <input
                                type="date"
                                value={form.from}
                                onChange={(e) => setForm({ ...form, from: e.target.value })}
                                className="rounded border-gray-300 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Sampai tanggal</label>
                            <input
                                type="date"
                                value={form.to}
                                onChange={(e) => setForm({ ...form, to: e.target.value })}
                                className="rounded border-gray-300 text-sm"
                            />
                        </div>
                        <button className="rounded bg-gray-800 px-4 py-2 text-sm text-white">
                            Terapkan
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="rounded border px-4 py-2 text-sm"
                        >
                            Reset
                        </button>
                        <a
                            href={route('admin.reports.export', filters)}
                            className="ml-auto rounded bg-green-600 px-4 py-2 text-sm text-white"
                        >
                            Export CSV
                        </a>
                    </form>

                    {/* Tabel */}
                    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Tanggal</th>
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Instansi</th>
                                    <th className="p-2">Masuk</th>
                                    <th className="p-2">Pulang</th>
                                    <th className="p-2">Durasi</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-3 text-center text-gray-400">
                                            Tidak ada data.
                                        </td>
                                    </tr>
                                )}
                                {attendances.data.map((a) => (
                                    <tr key={a.id} className="border-t">
                                        <td className="p-2">{a.date}</td>
                                        <td className="p-2">{a.user.name}</td>
                                        <td className="p-2">{a.user.institution ?? '-'}</td>
                                        <td className="p-2">{a.check_in ?? '-'}</td>
                                        <td className="p-2">{a.check_out ?? '-'}</td>
                                        <td className="p-2">{a.duration ?? '-'}</td>
                                        <td className="p-2">
                                            {a.status === 'late' ? 'Terlambat' : 'Tepat waktu'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 flex flex-wrap gap-1">
                            {attendances.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url ?? '#'}
                                    preserveState
                                    className={`rounded border px-3 py-1 text-sm ${
                                        link.active ? 'bg-gray-800 text-white' : 'bg-white'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}