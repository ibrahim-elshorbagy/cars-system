import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";


export default function ForgotPassword({ status,site_settings }) {

    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout centerContent box_width="max-w-xl" site_settings={site_settings}>
            <Head title={"Forgot Password"} />
            <div className="flex items-center justify-center flex-1 bg-indigoBlue dark:bg-gray-900">
                <div className="w-full max-w-lg px-6 py-4 mt-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 ">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                         نسيت كلمة المرور ؟
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <TextInput
                            id="user_name"
                            type="text"
                            name="user_name"
                            value={data.user_name}
                            placeholder="اسم المستخدم"
                            className="block w-full mt-1 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                            isFocused={true}
                            onChange={(e) => setData("user_name", e.target.value)}
                        />
                        <InputError message={errors.user_name} className="mt-2" />
                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                ارسال رابط لتغير كلمة المرور
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
