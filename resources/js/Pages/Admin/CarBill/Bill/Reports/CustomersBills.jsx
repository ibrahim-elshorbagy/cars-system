import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth,site_settings, users, queryParams = null }) {
  queryParams = queryParams || {};



  // Search functionality
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("customers-bills.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };





  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            تقرير الذمم
          </h2>

        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +" تقرير الذمم"} />

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <td className="p-3 text-xs text-nowrap md:text-base">Id</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الاسم</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">البريد الإلكتروني</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الهاتف</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">whatsapp</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الرصيد</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">عدد الذمم</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الذمم</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">المدفوع</td>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"الاسم"}
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.email}
                          placeholder={"البريد الإلكتروني"}
                          onBlur={(e) =>
                            searchFieldChanged("email", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("email", e)}
                        />
                                          </th>
                      <th ></th>
                      <th ></th>
                      <th ></th>
                      <th ></th>
                      <th ></th>
                      <th ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.data.length > 0 ? (
                      users.data.map((user,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={user.id}
                        >
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.id}</td>
                          <th className="p-3 text-xs text-nowrap md:text-base">{user.name}</th>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.email}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.phone}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.whatsapp}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.balance}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.total_bills_count}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.total_dues}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{user.paid_amount}</td>


                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-3 text-center">
                          لا يوجد عملاء
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {users && <Pagination links={users.meta.links} />}
            </div>
          </div>
        </div>
      </div>


    </AuthenticatedLayout>
  );
}
