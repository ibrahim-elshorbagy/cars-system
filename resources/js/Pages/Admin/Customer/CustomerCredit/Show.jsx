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
      <Head title={site_settings.websiteName + " - " + " سند قبض رصيد "} />

      {/* Main Container */}
        <div className="p-4 mt-6 bg-white shadow-lg Customer_Credit_print sm:p-6 md:p-10 dark:bg-gray-900 dark:text-white">

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-gray-500">
            <div>
              <h1 className="text-xs font-bold lg:text-2xl ">{site_settings.websiteName}</h1>
              <p className="text-xs lg:text-lg">{site_settings.phone}</p>
              <p className="text-xs lg:text-lg">{site_settings.email}</p>
            </div>
            <div>
              <img
                src={site_settings.websiteLogo}
                alt="Website Logo"
                className="h-8 lg:h-20"
              />
            </div>
          </div>

          {/* Receipt Details */}
          <div className="pb-6 mb-8 text-lg border-b-2 border-gray-500 sm:text-xl lg:text-2xl">
            <div className="text-right">
              <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {record.added_credit > 0 ? "سند قبض" : "سند صرف"}
              </h2>
              <p className="my-2 text-xl sm:text-2xl lg:text-2xl"> رقم : {record.id}</p>
              <p className="my-2 text-xl sm:text-2xl lg:text-2xl"> تاريخ الانشاء : {record.created_at}</p>
            </div>

            <p className="mt-10 font-bold"> وصل للسيد : {record.customer_name}</p>
            <p className="mt-3 "> الشركه : {record.customer_company}</p>

            <p className="my-5 "> الوصف : {record.description}</p>

            {record.added_credit > 0 && (
              <p className="my-5 "> رصيد مضاف : {record.added_credit} $</p>
            )}

            {record.used_credit > 0 && (
              <p className="my-5 "> رصيد مستخدم : {record.used_credit} $</p>
            )}

            <p className="my-5 "> الرصيد : {record.balance} $</p>
          </div>
            {/* Footer Details */}
          <div className="text-lg sm:gap-8 lg:gap-12 sm:text-xl lg:text-2xl">
            {/* <div>
              <p className="font-bold">تاريخ الانشاء</p>
              <p>{record.created_at}</p>
            </div> */}
            <div>
              <p className="font-bold">المحاسب</p>
              <p>{auth.user.name}</p>
            </div>
          </div>


      </div>
    </AuthenticatedLayout>
  );
}




