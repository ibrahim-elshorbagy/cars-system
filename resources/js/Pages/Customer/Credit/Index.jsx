import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ auth,site_settings, records }) {






  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            المحاسبه
            </h2>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"المحاسبه"} />
      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">

          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">القيمة المضافه</th>
                      <th className="px-3 py-3">القيمة المستخدمه</th>
                      <th>الرصيد</th>
                      <th className="px-3 py-3">الوصف</th>
                      <th className="px-3 py-3">وقت الانشاء</th>
                      <th className="px-3 py-3">وقت التحديث</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records && records.data.length > 0 ? (
                      records.data.map((record) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={record.id}
                        >
                          <td className="px-3 py-2 text-nowrap">{record.added_credit}</td>
                          <td className="px-3 py-2 text-nowrap">{record.used_credit}</td>
                          <td className="px-3 py-2 text-nowrap">{record.balance}</td>
                          <td className="px-3 py-2 text-nowrap">{record.description}</td>
                          <td className="px-3 py-2 text-nowrap">{record.created_at}</td>
                          <td className="px-3 py-2 text-nowrap">{record.updated_at}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center">
                          لا يوجد ارصده
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {records && <Pagination links={records.meta.links} />}
            </div>
          </div>
        </div>
      </div>




    </AuthenticatedLayout>
  );
}

