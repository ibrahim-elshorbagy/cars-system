import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";



export default function VerifyEmail({ status }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout centerContent box_width="max-w-xl">
            <Head title={"Email Verification"} />
            <div className="flex items-center justify-center flex-1 bg-indigoBlue dark:bg-gray-900">
                <div className="w-full max-w-lg px-6 py-4 mt-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 ">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Thanks for signing up!
                    </div>

                    {status === "verification-link-sent" && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            Verification link sent
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="flex items-center justify-between mt-4">
                            <PrimaryButton disabled={processing}>
                                Resend Verification Email
                            </PrimaryButton>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 underline rounded-md dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
