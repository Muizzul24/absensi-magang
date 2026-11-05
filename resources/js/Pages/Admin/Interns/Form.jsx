import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Field sekarang di LUAR fungsi Form, jadi tidak dibuat ulang tiap ketikan
function Field({ label, name, type = 'text', hint, data, setData, errors }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                className="mt-1 w-full rounded border-gray-300"
            />
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
        </div>
    );
}

export default function Form({ intern }) {
    const isEdit = !!intern;

    const { data, setData, post, put, processing, errors } = useForm({
        name: intern?.name ?? '',
        email: intern?.email ?? '',
        password: '',
        institution: intern?.institution ?? '',
        phone: intern?.phone ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.interns.update', intern.id));
        } else {
            post(route('admin.interns.store'));
        }
    };

    // Properti yang dibagikan ke semua Field
    const shared = { data, setData, errors };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    {isEdit ? 'Edit Peserta' : 'Tambah Peserta'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Edit Peserta' : 'Tambah Peserta'} />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4">
                    <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow">
                        <Field label="Nama" name="name" {...shared} />
                        <Field label="Email" name="email" type="email" {...shared} />
                        <Field
                            label="Password"
                            name="password"
                            type="password"
                            hint={
                                isEdit
                                    ? 'Kosongkan kalau tidak ingin mengganti password.'
                                    : 'Minimal 8 karakter.'
                            }
                            {...shared}
                        />
                        <Field label="Instansi / Kampus" name="institution" {...shared} />
                        <Field label="No. HP" name="phone" {...shared} />

                        <div className="flex gap-3">
                            <button
                                disabled={processing}
                                className="rounded bg-indigo-600 px-5 py-2 text-white disabled:opacity-50"
                            >
                                Simpan
                            </button>
                            <Link
                                href={route('admin.interns.index')}
                                className="rounded border px-5 py-2"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}