import React from "react";
import { Head, router,Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";

export default function Index({ auth,site_settings, customers,queryParams = null,totalBalance }) {

// ---------------------------------------------------------------------------- search

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("customer-credit.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key === "Enter") {
      searchFieldChanged(name, e.target.value);
    }
  };


// ----------------------------------------------------------------------------

  return (
    <AuthenticatedLayout
        user={auth.user}
        site_settings={site_settings}

        header={
        <div className="flex items-center justify-between">

            <h2 className="text-base font-semibold leading-tight md:text-xl dark:text-gray-200">
            ارصدة العملاء (الارصدة الدائنة)
            </h2>

        </div>
    }
    >
    <Head title={site_settings.websiteName + " - " +"الارصدة الدائنة"} />
      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3 text-xs text-nowrap md:text-base">ID</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الشركة</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">رصيد العميل</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">اجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>

                      <th className="p-3 min-w-32 max-w-36">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"اسم الشركة"}
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>

                    </tr>
                  </thead>
                  <tbody>
                    {customers && customers.data.length > 0 ? (
                      customers.data.map((customer,index) => (
                        <tr
                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={customer.id}
                        >
                          <td className="px-3 py-2">{customer.id}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{customer.customer_company}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{customer.balance} $</td>

                            <td className="px-3 py-2 text-xs text-nowrap md:text-base">
                                <Link
                                href={route("customer-credit-records.index", customer)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            حركات الرصيد
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center">
                          لا يوجد ارصده
                        </td>
                      </tr>
                        )}
                            <tr className="border-b">
                            <td className="px-3 py-2 text-xs text-nowrap md:text-lg" colSpan={2}>اجمالي ارصدة العملاء</td>
                            <td className="px-3 py-2 text-xs text-nowrap md:text-lg " colSpan={2}>{ parseFloat(totalBalance)} $</td>
                        </tr>
                  </tbody>
                </table>
              </div>
              {customers && <Pagination links={customers.meta.links} />}
            </div>
          </div>
        </div>
      </div>


    </AuthenticatedLayout>
  );
}

