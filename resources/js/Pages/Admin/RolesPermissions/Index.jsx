import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function Index({ auth, roles,site_settings, success }) {


  return (
    <AuthenticatedLayout user={auth.user} site_settings={site_settings}>
      <Head title={site_settings.websiteName + " - " +"الصلاحيات"} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {success && (
            <div className="p-4 mb-4 text-white bg-green-500 rounded">
              {success}
            </div>
          )}

          <div className="p-6 overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
              الصلاحيات
            </h2>

            <div className="mt-6 overflow-auto">

            <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                    <th className="px-6 py-3 ">الدور</th>
                    <th className="px-6 py-3 ">اجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map((role, index) => (
                            <tr
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                key={index}
                            >
                                <td className="px-3 py-2 text-nowrap">{role.name}</td>
                                <td className="px-6 py-2 text-nowrap">
                                    <Link
                                        href={route("admin.roles-permissions.edit", role.id)}
                                        className="rounded text-burntOrange "
                                    >
                                        تعديل الصلاحيات
                                     </Link>
                                </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}