import React from "react";
import { Head,Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import { FaBalanceScale, FaMoneyBill, FaShippingFast, FaExclamationCircle, FaMoneyCheckAlt } from "react-icons/fa";

export default function Index({ auth,site_settings, cars, queryParams = null, customer_balance,total_won_price,total_shipping_cost,total_require,total_paid }) {
  queryParams = queryParams || {};





  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("customer-my-cars.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key === "Enter") {
      searchFieldChanged(name, e.target.value);
    }
  };


  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            الذمم
          </h2>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"الذمم"} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                      <div className="p-6 text-gray-900 dark:text-gray-100">
                          <div>
                            <div className="py-12">
                            <div className="mx-auto sm:px-6 lg:px-8">
                                <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                                <div className="flex items-center justify-between p-6 text-gray-900 dark:text-gray-100">
                                    {/* Customer Balance */}
                                    <div className="flex items-center gap-2">
                                    <FaBalanceScale className="w-6 h-6 text-green-500" />
                                    <span className="text-lg font-bold text-green-600 dark:text-green-300">
                                        رصيد العميل : {customer_balance}$ {/* Replace with dynamic value */}
                                    </span>
                                    </div>

                                    {/* Total Won Price */}
                                    <div className="flex items-center gap-2">
                                    <FaMoneyBill className="w-6 h-6 text-blue-500" />
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
                                        سعر الشراء الإجمالي : {total_won_price}$ {/* Replace with dynamic value */}
                                    </span>
                                    </div>

                                    {/* Total Shipping Cost */}
                                    <div className="flex items-center gap-2">
                                    <FaShippingFast className="w-6 h-6 text-purple-500" />
                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-300">
                                        تكلفة الشحن الإجمالية : {total_shipping_cost}$ {/* Replace with dynamic value */}
                                    </span>
                                    </div>

                                    {/* Total Paid */}
                                    <div className="flex items-center gap-2">
                                    <FaMoneyCheckAlt className="w-6 h-6 text-green-500" />
                                    <span className="text-lg font-bold text-green-600 dark:text-green-300">
                                        المجموع المدفوع : {total_paid}$ {/* Replace with dynamic value */}
                                    </span>
                                    </div>

                                    {/* Total Required */}
                                    <div className="flex items-center gap-2">
                                    <FaExclamationCircle className="w-6 h-6 text-red-500" />
                                    <span className="text-lg font-bold text-red-600 dark:text-red-300">
                                        المجموع المطلوب : {total_require}$ {/* Replace with dynamic value */}
                                    </span>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>


                          </div>
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      {/* <th className="px-3 py-3">ID</th> */}
                      <th className="px-3 py-3 w-96">رقم الشاسيه</th>

                      <th className="w-32 yp-3">تكلفة الشحن</th>
                      <th className="w-32py-3 ">مدفوع</th>
                      <th className="w-32py-3 ">متبقي</th>

                      <th className="w-32py-3 ">سعر الشراء</th>
                      <th className="w-32py-3 ">مدفوع</th>
                      <th className="w-32py-3 ">متبقي</th>
                      <th className="w-32py-3 ">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                        <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.chassis}
                          placeholder={"رقم الشاسيه"}
                          onBlur={(e) => searchFieldChanged("chassis", e.target.value)}
                          onKeyPress={(e) => onKeyPress("chassis", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="py-3 "></th>
                      <th className="py-3 "></th>
                      <th className="py-3 "></th>
                      <th className="py-3 "></th>
                      <th className="py-3 "></th>
                      <th className="py-3 "></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars && cars.data.length > 0 ? (
                      cars.data.map((car) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={car.id}
                        >
                          {/* <td className="px-3 py-2">{car.id}</td> */}
                            <td className="px-3 py-2 text-nowrap">{car.chassis}</td>
                            <td className="py-2 text-nowrap">{car.shipping_cost}</td>
                            <td className="py-2 text-nowrap">{car.paid_shipping_cost}</td>
                            <td className="py-2 text-nowrap">{car.remain_shipping_cost}</td>

                            <td className="py-2 text-nowrap">{car.won_price}</td>
                            <td className="py-2 text-nowrap">{car.paid_won_price}</td>
                            <td className="py-2 text-nowrap">{car.remain_won_price}</td>

                            <td className="py-2 text-nowrap">
                            <Link
                                href={route("customer-my-car.show", car.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            مشاهده
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-3 py-2 text-center">
                          لا يوجد سيارات
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {cars && <Pagination links={cars.meta.links} />}
            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
}
