import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ interns, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const cari = (e) => {
        e.preventDefault();
        router.get(route('admin.interns.index'), { search }, { preserveState: true });
    };

    const hapus = (intern) => {
        if (confirm(`Hapus peserta ${intern.name}? Data absensinya juga ikut terhapus.`)) {
            router.delete(route('admin.interns.destroy', intern.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Peserta Magang</h2>}
        >
            <Head title="Peserta Magang" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl space-y-4 px-4">
                    {flash?.success && (
                        <div className="rounded bg-green-100 p-3 text-green-700">{flash.success}</div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <form onSubmit={cari} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama / email..."
                                className="rounded border-gray-300 text-sm"
                            />
                            <button className="rounded bg-gray-800 px-4 py-2 text-sm text-white">
                                Cari
                            </button>
                        </form>

                        <Link
                            href={route('admin.interns.create')}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white"
                        >
                            + Tambah Peserta
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Instansi</th>
                                    <th className="p-2">No. HP</th>
                                    <th className="p-2">Total Absen</th>
                                    <th className="p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interns.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-3 text-center text-gray-400">
                                            Belum ada peserta.
                                        </td>
                                    </tr>
                                )}
                                {interns.data.map((i) => (
                                    <tr key={i.id} className="border-t">
                                        <td className="p-2">{i.name}</td>
                                        <td className="p-2">{i.email}</td>
                                        <td className="p-2">{i.institution ?? '-'}</td>
                                        <td className="p-2">{i.phone ?? '-'}</td>
                                        <td className="p-2">{i.attendances_count}</td>
                                        <td className="space-x-3 p-2">
                                            <Link
                                                href={route('admin.interns.edit', i.id)}
                                                className="text-indigo-600"
                                            >
                                                Edit
                                            </Link>
                                            <button onClick={() => hapus(i)} className="text-red-600">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="mt-4 flex flex-wrap gap-1">
                            {interns.links.map((link, idx) => (
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