import { Link, Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from "react-i18next";




export default function Welcome({ auth }) {


    return (
        <>
            <GuestLayout>
                <Head title={"مرحبا"} />
                <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-r bg-indigoBlue">
                    <h1 className="text-5xl font-bold">
                        {"مرحبا"}
                    </h1>
                    <div className="flex gap-2 mt-8 ">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg"
                            >
                                لوحة التحكم
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg"
                                >
                                    تسجيل الدخول
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
