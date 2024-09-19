import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "@/i18nConfig";

export default function Create({ auth, user }) {

    const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
                "Users": "المستخدمين",
                "Edit user": "تعديل المستخدم",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Email": "البريد الإلكتروني",
                "User Name": "اسم المستخدم",
                "User Email": "بريد المستخدم",
                "Write if you want to change": "اكتب لتغييره",
                "Password": "كلمة المرور",
                "Phone": "رقم الهاتف",
                "Address": "العنوان",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);
  const { t } = useTranslation();

  const { data, setData, post, errors, reset } = useForm({
    name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    address: user.address || "",
    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("customer.update", user.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight   dark:text-gray-200">
            {t("Edit user")} "{user.name}"
          </h2>
        </div>
      }
    >
      <Head title={t("Users")} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg"
                      >
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6">
              <div className="mt-4">
                <InputLabel htmlFor="user_name" value={t("User Name")} />

                <TextInput
                  id="user_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />

                <InputError message={errors.name} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="user_email" value={t("User Email")} />

                <TextInput
                  id="user_email"
                  type="text"
                  name="email"
                  value={data.email}
                  className="block w-full mt-1"
                  onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="user_password" value={t("Password")} />

                <TextInput
                  id="user_password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="block w-full mt-1"
                  onChange={(e) => setData("password", e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />
              </div>

            <div className="mt-4">
                <InputLabel htmlFor="phone" value={t("Phone")} />

                <TextInput
                id="phone"
                type="text"
                name="phone"
                value={data.phone}
                className="block w-full mt-1"
                onChange={(e) => setData("phone", e.target.value)}
                />

                <InputError message={errors.phone} className="mt-2" />
            </div>

                                        <div className="mt-4">
            <InputLabel htmlFor="address" value={t("Address")} />

            <TextInput
              id="address"
              type="text"
              name="address"
              value={data.address}
              className="block w-full mt-1"
              onChange={(e) => setData("address", e.target.value)}
            />

            <InputError message={errors.address} className="mt-2" />
            </div>
            </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("customer.index")}
                  className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                >
                  {t("Cancel")}
                </Link>
                <button className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover">
                  {t("Submit")}
                </button>
                              </div>


            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
