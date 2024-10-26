import { Link, Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";




export default function Welcome({ auth,site_settings  }) {


    return (
        <>
            <GuestLayout site_settings={site_settings}>
                  <Head title={site_settings.websiteName + " - " + "مرحباً"}/>


                <div className="flex flex-col items-center min-h-screen text-white ">
                    <div className="m-3 md:m-10">
                        <img className="rounded-xl" src={site_settings.site_cover} alt="" />
                    </div>

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
