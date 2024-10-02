import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, site_settings, record }) {
  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-tight sm:text-lg md:text-xl dark:text-gray-200">
            سند قبض رصيد
          </h2>
          <button
            onClick={handlePrint}
            className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md sm:text-base sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Print
          </button>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " + " سند  رصيد "} />

      {/* Main Container */}
        <div className="p-4 mt-6 bg-white shadow-lg Customer_Credit_print sm:p-6 md:p-10 dark:bg-gray-900 dark:text-white">

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-gray-500">
            <div>
              <h1 className="text-3xl font-bold">{site_settings.websiteName}</h1>
              <p className="text-1xl ">{site_settings.phone}</p>
              <p className="text-1xl ">{site_settings.email}</p>
            </div>
            <div>
              <img
                src={site_settings.websiteLogo}
                alt="Website Logo"
                className="h-24"
              />
            </div>
          </div>

            {/* Receipt Details */}
            <div className="pb-6 mb-8 text-lg border-b-2 border-gray-500 sm:text-xl lg:text-2xl">
                <div className="text-right">
                <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                    {record.added_credit > 0 ? "سند قبض" : "سند تسديد ذمم"}
                </h2>
                <p className="my-2 text-xl "> رقم : {record.id}</p>
                <p className="my-2 text-xl "> تاريخ الانشاء : {record.created_at}</p>
                    </div>

                <p className="mt-10 ">
                {record.added_credit > 0 ? (
                    <>وصلنا من السادة: {record.customer_company} مبلغ وقدره {record.added_credit} $ ليصبح رصيده الاجمالي {record.balance} $ حتى تاريخ هذا السند.</>
                ) : record.used_credit > 0 ? (
                              <>تم خصم المبلغ  {record.used_credit} من العميل {record.customer_company}  نتيجه عملية تسديد ذمم ,
                                ليصبح الرصيد الاجمالي  {record.balance} $ حتى تاريخ هذا السند.</>
                ) : (
                    <>الرصيد الاجمالي للسيد: {record.customer_name} هو {record.balance} $ حتى تاريخ هذا السند.</>
                )}
                </p>

            </div>


            {/* Footer Details */}
            <div className="grid grid-cols-4">
                <div>
                    <p className="font-bold">أنشئ بواسطة</p>
                    <p>{record.created_by ? record.created_by : "غير متوفر"}</p>
                </div>
                <div>
                    <p className="font-bold">تاريخ الإنشاء</p>
                    <p>{record.created_at}</p>
                </div>

                {/* Conditionally render the updated fields if updated_by is present */}
                {record.updated_by && (
                    <>
                    <div>
                        <p className="font-bold">تاريخ التعديل</p>
                        <p>{record.updated_at}</p>
                    </div>
                    <div>
                        <p className="font-bold">آخر تعديل بواسطة</p>
                        <p>{record.updated_by}</p>
                    </div>
                    </>
            )}
            </div>


      </div>
    </AuthenticatedLayout>
  );
}




