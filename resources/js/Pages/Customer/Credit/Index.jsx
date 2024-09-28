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
      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المضافه</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المستخدمه</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الرصيد</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الوصف</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">وقت الانشاء</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">وقت التحديث</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records && records.data.length > 0 ? (
                      records.data.map((record,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={record.id}
                        >
                          <td className="p-3 text-xs text-nowrap md:text-base">{record.added_credit}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{record.used_credit}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{record.balance}</td>
                          <td className="p-3 text-xs md:text-base min-w-80">{record.description}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{record.created_at}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{record.updated_at}</td>
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

