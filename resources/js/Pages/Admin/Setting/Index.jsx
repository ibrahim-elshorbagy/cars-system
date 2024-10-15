import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import Input from "@/Components/ui/input";

export default function SettingsPage({ auth, site_settings,settings }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);



    // Prepare form for edit
    const { data, setData, post, errors, reset } = useForm({
        site_name: settings.find(setting => setting.name === 'site_name')?.value || "",
        // company_logo: settings.find(setting => setting.name === 'company_logo')?.value || "",
        support_email: settings.find(setting => setting.name === 'support_email')?.value || "",
        support_phone: settings.find(setting => setting.name === 'support_phone')?.value || "",
    });

    // Toggle Edit Modal
        const toggleEditModal = () => {
            if (!isEditModalOpen) {
                // Set the form data with the latest values when opening the modal
                setData({
                    site_name: settings.find(setting => setting.name === 'site_name')?.value || "",
                    support_email: settings.find(setting => setting.name === 'support_email')?.value || "",
                    support_phone: settings.find(setting => setting.name === 'support_phone')?.value || "",
                });
            }
            setIsEditModalOpen(!isEditModalOpen);
        };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.settings.update"), {
            onSuccess: () => {
                reset();
                toggleEditModal();


            },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            site_settings={site_settings}

            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        إعدادات النظام
                    </h2>
                    <button
                        onClick={toggleEditModal}
                        className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange "
                    >
                        تعديل الإعدادات
                    </button>
                </div>
            }
        >
            <Head title={site_settings.websiteName + " - " +"إعدادات النظام"} />

            <div className="">
                <div className="mx-auto ">

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
                        <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
                            {/* Displaying settings in sections */}
                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">معلومات الموقع</h3>
                                <p><strong>اسم الموقع: </strong>{settings.find(setting => setting.name === 'site_name')?.value}</p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">الدعم الفني</h3>
                                <p><strong>البريد الإلكتروني للدعم: </strong>{settings.find(setting => setting.name === 'support_email')?.value}</p>
                                <p><strong>الهاتف: </strong>{settings.find(setting => setting.name === 'support_phone')?.value}</p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">الشعار</h3>
                                <img
                                    src={`${settings.find(setting => setting.name === 'company_logo')?.value}`}
                                    alt="Company Logo"
                                    width="100"
                                />
                            </section>
                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">Welcome Cover</h3>
                                <img
                                    src={`${settings.find(setting => setting.name === 'site_cover')?.value}`}
                                    alt="Company Logo"
                                />
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for editing settings */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-1/2 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">تعديل إعدادات النظام</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="site_name" value="اسم الموقع" />
                                    <TextInput
                                        id="site_name"
                                        name="site_name"
                                        value={data.site_name}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("site_name", e.target.value)}
                                    />
                                    <InputError message={errors.site_name} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="company_logo" value="شعار الشركة" />
                                    <Input
                                        type="file"
                                        id={`image`}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData('image',e.target.files[0])}
                                    />
                                    <InputError message={errors.company_logo} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="site_cover" value="Welcome Cover" />
                                    <Input
                                        type="file"
                                        id={`site_cover`}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData('site_cover',e.target.files[0])}
                                    />
                                    <InputError message={errors.site_cover} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="support_email" value="البريد الإلكتروني للدعم الفني" />
                                    <TextInput
                                        id="support_email"
                                        name="support_email"
                                        value={data.support_email}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("support_email", e.target.value)}
                                    />
                                    <InputError message={errors.support_email} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="support_phone" value="رقم الهاتف للدعم الفني" />
                                    <TextInput
                                        id="support_phone"
                                        name="support_phone"
                                        value={data.support_phone}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("support_phone", e.target.value)}
                                    />
                                    <InputError message={errors.support_phone} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => toggleEditModal()}
                                        className="text-white bg-gray-600 hover:bg-gray-700"
                                    >
                                        إلغاء
                                    </Button>
                                    <Button type="submit" className="text-white bg-burntOrange ">
                                        حفظ التغييرات
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
