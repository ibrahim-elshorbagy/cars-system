import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Index({ auth,site_settings, bills }) {



  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-tight md:text-xl dark:text-gray-200">
            تقرير ذمم العميل
        </h2>

        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"تقرير ذمم العميل"} />
      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-auto">
                        <Accordion type="single" collapsible className="my-6 space-y-4">
                        {bills.map((bill, index) => (
                            <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-gray-200 rounded-lg shadow-sm dark:border-gray-700"
                            >
                            {/* Show Full Details on Medium and Larger Screens */}
                            <AccordionTrigger className="hidden p-4 font-semibold text-white rounded-t-lg lg:flex bg-indigoBlue dark:bg-indigoBlue">
                                Cars: {bill.car_chassis} - سعر الشراء ( Won Price ): $ {bill.won_price.amount} , مدفوع ( Paid ): ${bill.won_price.total_paid} - سعر الشحن ( Shipping Cost ): ${bill.shipping_cost.amount} , مدفوع ( Paid ): ${bill.shipping_cost.total_paid}
                            </AccordionTrigger>

                            {/* Show Only Chassis on Small Screens */}
                            <AccordionTrigger className="flex p-4 font-semibold text-white rounded-t-lg lg:hidden bg-indigoBlue dark:bg-indigoBlue">
                                Cars: {bill.car_chassis}
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-gray-100 dark:bg-gray-800">
                                {/* Won Price Section */}
                                <div className="mb-4">
                                <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">تسديدات عمليات الشراء</h4>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    مجموع المدفوع : <span className="font-semibold text-gray-800 dark:text-white">{bill.won_price.total_paid} $</span>
                                </p>
                                {bill.won_price.payments.length > 0 ? (
                                    <table className="min-w-full overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
                                    <thead>
                                        <tr className="text-gray-700 bg-blue-50 dark:bg-gray-900 dark:text-gray-300">
                                        <th className="px-4 py-2 text-right">ID</th>
                                        <th className="px-4 py-2 text-right">المقدار</th>
                                        <th className="px-4 py-2 text-right">تاريخ الدفع</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.won_price.payments.map((payment, i) => (
                                        <tr
                                            key={i}
                                            className={`${
                                            i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"
                                            } border-b dark:border-gray-600`}
                                        >
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.payment_id}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.won_price_amount} $</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.payment_date}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-red-500 dark:text-red-400">لا يوحد عمليات تسديد ذمم شراء</p>
                                )}
                                </div>

                                {/* Shipping Cost Section */}
                                <div>
                                <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">تسديدات عمليات الشحن</h4>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    مجموع المدفوع : <span className="font-semibold text-gray-800 dark:text-white">{bill.shipping_cost.total_paid} $</span>
                                </p>
                                {bill.shipping_cost.payments.length > 0 ? (
                                    <table className="min-w-full overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
                                    <thead>
                                        <tr className="text-gray-700 bg-blue-50 dark:bg-gray-900 dark:text-gray-300">
                                        <th className="px-4 py-2 text-right">ID</th>
                                        <th className="px-4 py-2 text-right">المقدار</th>
                                        <th className="px-4 py-2 text-right">تاريخ الدفع</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.shipping_cost.payments.map((payment, i) => (
                                        <tr
                                            key={i}
                                            className={`${
                                            i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"
                                            } border-b dark:border-gray-600`}
                                        >
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.payment_id}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.shipping_cost_amount} $</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.payment_date}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-red-500 dark:text-red-400">لا يوجد عمليات تسديد ذمم شحن</p>
                                )}
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>




              </div>
             </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
}

