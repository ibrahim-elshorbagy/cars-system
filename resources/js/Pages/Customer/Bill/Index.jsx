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

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
                      <div className="p-6 text-gray-900 dark:text-gray-100">
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
                      <th className="p-3 text-xs text-nowrap md:text-base">VIN</th>

                      <th className="p-3 text-xs text-nowrap md:text-base">تكلفة الشحن</th>
                      <th className="p-3 text-xs text-nowrap md:text-base ">مدفوع</th>
                      <th className="p-3 text-xs text-nowrap md:text-base ">متبقي</th>

                      <th className="p-3 text-xs text-nowrap md:text-base ">سعر الشراء</th>
                      <th className="p-3 text-xs text-nowrap md:text-base ">مدفوع</th>
                      <th className="p-3 text-xs text-nowrap md:text-base ">متبقي</th>
                      <th className="p-3 text-xs text-nowrap md:text-base ">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                        <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.chassis}
                          placeholder={"VIN"}
                          onBlur={(e) => searchFieldChanged("chassis", e.target.value)}
                          onKeyPress={(e) => onKeyPress("chassis", e)}
                        />
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars && cars.data.length > 0 ? (
                      cars.data.map((car,index) => (
                        <tr
                            className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                          key={car.id}
                        >
                          {/* <td className="px-3 py-2">{car.id}</td> */}
                            <td className="p-3 text-nowrap">{car.chassis}</td>
                            <td className="p-2 text-nowrap">{car.shipping_cost}</td>
                            <td className="p-2 text-nowrap">{car.paid_shipping_cost}</td>
                            <td className="p-2 text-nowrap">{car.remain_shipping_cost}</td>

                            <td className="p-2 text-nowrap">{car.won_price}</td>
                            <td className="p-2 text-nowrap">{car.paid_won_price}</td>
                            <td className="p-2 text-nowrap">{car.remain_won_price}</td>

                            <td className="p-2 text-nowrap">
                            <Link
                                href={route("customer-my-car.show", car.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            مشاهدة
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

