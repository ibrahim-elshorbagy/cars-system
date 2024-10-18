import React from "react";
import { Head,Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import { FaBalanceScale, FaMoneyBill, FaShippingFast, FaExclamationCircle, FaMoneyCheckAlt } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
export default function Index({ auth,site_settings, cars,carsCount, queryParams = null, customer_balance,total_won_price,total_shipping_cost,total_require,total_paid }) {
  queryParams = queryParams || {};





//   const searchFieldChanged = (name, value) => {
//     if (value) {
//       queryParams[name] = value;
//     } else {
//       delete queryParams[name];
//     }
//       delete queryParams.page;

//     router.get(route("customer-my-cars.index"), queryParams);
//   };

//   const onKeyPress = (name, e) => {
//     if (e.key === "Enter") {
//       searchFieldChanged(name, e.target.value);
//     }
//   };


  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            الذمم
              </h2>
                <Link
                    href={route("customer-my-bills.details")}
                    className="px-4 py-3 mx-1 font-medium text-white rounded-lg bg-emerald-500 hover:underline"
                >
                تفاصيل
                </Link>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"الذمم"} />

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
                      <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
                          <div>
                              <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Customer Balance */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaBalanceScale className="mr-3 text-3xl text-green-500" />
                                                <div>
                                                    <CardTitle>Customer Balance</CardTitle>
                                                    <CardDescription>رصيد العميل</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-green-600 dark:text-green-300">
                                                {customer_balance}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Won Price */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaMoneyBill className="mr-3 text-3xl text-blue-500" />
                                                <div>
                                                    <CardTitle>Total Won Price</CardTitle>
                                                    <CardDescription>سعر الشراء الإجمالي</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                                                {total_won_price}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Shipping Cost */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaShippingFast className="mr-3 text-3xl text-purple-500" />
                                                <div>
                                                    <CardTitle>Total Shipping Cost</CardTitle>
                                                    <CardDescription>تكلفة الشحن الإجمالية</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-purple-600 dark:text-purple-300">
                                                {total_shipping_cost}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Paid */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaMoneyCheckAlt className="mr-3 text-3xl text-green-500" />
                                                <div>
                                                    <CardTitle>Total Paid</CardTitle>
                                                    <CardDescription>المجموع المدفوع</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-green-600 dark:text-green-300">
                                                {total_paid}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Required */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaExclamationCircle className="mr-3 text-3xl text-red-500" />
                                                <div>
                                                    <CardTitle>Total Required</CardTitle>
                                                    <CardDescription>المجموع المطلوب</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-red-600 dark:text-red-300">
                                                {total_require}$
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>



                          </div>
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      {/* <th className="p-3">ID</th> */}
                        <th className="p-2 text-xs text-nowrap md:text-base ">الشركة</th>
                        <th className="p-2 text-xs text-nowrap md:text-base ">البريد الاكتروني</th>
                        <th className="p-2 text-xs text-nowrap md:text-base ">رصيد العميل</th>

                        <th className="p-2 text-xs text-nowrap md:text-base">السيارات</th>
                        <th className="p-2 text-xs text-nowrap md:text-base ">الذمم</th>
                        <th className="p-2 text-xs text-nowrap md:text-base ">المدفوع</th>
                        <th className="p-2 text-xs text-nowrap md:text-base ">الرصيد</th>
                    </tr>
                  </thead>
                  <tbody>
                        <tr>

                            <td className="p-2 text-nowrap">{auth.user.customer_company}</td>
                            <td className="p-2 text-nowrap">{auth.user.email}</td>
                            <td className="p-2 text-nowrap">{customer_balance}</td>
                            <td className="p-2 text-nowrap">{carsCount}</td>
                            <td className="p-2 text-nowrap">{((Number(total_won_price)) + (Number(total_shipping_cost))).toFixed(2) }</td>
                            <td className="p-2 text-nowrap">{(Number(total_paid)).toFixed(2)}</td>
                            <td className="p-2 text-nowrap">{(((Number(total_won_price)) + (Number(total_shipping_cost))) - (Number(total_paid))).toFixed(2)}</td>



                        </tr>

                  </tbody>
                </table>
              </div>
              {/* {cars && <Pagination links={cars.meta.links} />} */}
            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
}

