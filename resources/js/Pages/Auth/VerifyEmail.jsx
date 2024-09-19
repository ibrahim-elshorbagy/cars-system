import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
    en: {
        translation: {
            "Email Verification": "Email Verification",
            "Thanks for signing up!":
                "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.",
            "Verification link sent":
                "A new verification link has been sent to the email address you provided during registration.",
            "Resend Verification Email": "Resend Verification Email",
            "Log Out": "Log Out",
        },
    },
    ar: {
        translation: {
            "Email Verification": "تأكيد البريد الإلكتروني",
            "Thanks for signing up!":
                "شكرًا لتسجيلك! قبل البدء، هل يمكنك التحقق من عنوان بريدك الإلكتروني بالنقر فوق الرابط الذي أرسلناه إليك؟ إذا لم تتلق البريد الإلكتروني، فسوف نرسل لك رسالة أخرى بكل سرور.",
            "Verification link sent":
                "تم إرسال رابط تحقق جديد إلى عنوان البريد الإلكتروني الذي قدمته أثناء التسجيل.",
            "Resend Verification Email": "إعادة إرسال بريد التحقق",
            "Log Out": "تسجيل خروج",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function VerifyEmail({ status }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout centerContent box_width="max-w-xl">
            <Head title={t("Email Verification")} />
            <div className="flex items-center justify-center flex-1 bg-indigoBlue dark:bg-gray-900">
                <div className="w-full max-w-lg px-6 py-4 mt-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {t("Thanks for signing up!")}
                    </div>

                    {status === "verification-link-sent" && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {t("Verification link sent")}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="flex items-center justify-between mt-4">
                            <PrimaryButton disabled={processing}>
                                {t("Resend Verification Email")}
                            </PrimaryButton>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 underline rounded-md dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                {t("Log Out")}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
