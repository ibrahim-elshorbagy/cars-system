import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {

    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            user_name: user.user_name,
            email: user.email,
            phone: user.phone,
            whatsapp: user.whatsapp,
            address: user.address,
            customer_company: user.customer_company,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    معلوماتي
                </h2>

            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={"اسم المستخدم"} />

                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {data.user_name}
                </h2>

                </div>
                <div>
                    <InputLabel htmlFor="name" value={"الاسم"} />

                    <TextInput
                        id="name"
                        className="block w-full mt-1"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>


                    <div>

                        <InputLabel htmlFor="phone" value={"الهاتف"} />

                        <TextInput
                            id="phone"
                            className="block w-full mt-1"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            placeholder="+962799504930"
                            dir="ltr"


                        />

                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>

                        <InputLabel htmlFor="whatsapp" value={"whatsapp"} />

                        <TextInput
                            id="whatsapp"
                            className="block w-full mt-1"
                            value={data.whatsapp}
                            onChange={(e) => setData("whatsapp", e.target.value)}
                            placeholder="+962799504930"
                            dir="ltr"

                        />

                        <InputError className="mt-2" message={errors.whatsapp} />
                </div>


                    <div>
                        <InputLabel htmlFor="email" value={"البريد الاكتروني"} />

                        <TextInput
                            id="email"
                            className="block w-full mt-1"
                            type='email'
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>


                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        حفظ
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            حفظ
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
