import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";



export default function Login({ status, canResetPassword ,site_settings}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout centerContent box_width="max-w-xl" site_settings={site_settings}>
            <Head title={site_settings.websiteName + " - " + "تسجيل الدخول"} />
            {/* bg-indigoBlue */}
            <div className="flex items-center justify-center flex-1 dark:bg-gray-900">
                <div className="w-full max-w-lg px-6 py-4 mt-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 ">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="user_name" value={"اسم المستخدم"} />
                            <TextInput
                                id="user_name"
                                type="text"
                                name="user_name"
                                value={data.user_name}
                                className="block w-full mt-1 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("user_name", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.user_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password"
                                value={"كلمة السر"}
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center gap-3">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    تذكرني
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-gray-600 underline dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                >
                                    نسيت كلمة المرور ؟
                                </Link>
                            )}
                            <PrimaryButton
                                className="ml-4"
                                disabled={processing}
                            >
                                {"دخول"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
