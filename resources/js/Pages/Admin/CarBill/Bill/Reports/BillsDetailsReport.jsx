import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function BillsDetailsReport({ auth, site_settings, bills,customer }) {
  // Function to format numbers as currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Function to calculate total debts
  const calculateTotalDebts = (bill) => {
    const totalAmount =
      parseFloat(bill.won_price.amount) + parseFloat(bill.shipping_cost.amount);
    const totalPaid =
      parseFloat(bill.won_price.total_paid) +
      parseFloat(bill.shipping_cost.total_paid);
    return (totalAmount - totalPaid).toFixed(2);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-tight md:text-xl dark:text-gray-200">
            تقرير ذمم العميل
          </h2>
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            طباعة كشف الحساب
          </button>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " + "تقرير ذمم العميل"} />
          <div className="p-4 bg-white print dark:bg-gray-800">
                        {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-gray-500 dark:text-white">
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
              <div className="overflow-auto">
            <div className="my-4 mb-8">
              <h1 className="text-2xl font-bold">العميل : {customer.name}</h1>
              <h1 className="text-2xl font-bold">الشركة : {customer.customer.customer_company}</h1>
            </div>
          {/* For each car */}
          {bills.map((bill, index) => (
            <div key={index} className="mb-8">
              {/* Car Details */}
              <h3  className="mb-2 text-sm font-bold text-right text-gray-800 md:text-lg dark:text-white">
                    <div dir="ltr" className="font-bold dark:text-white">
                                        <span dir="rtl" className="mx-10 text-base">تاريخ الشراء - {bill.car_created_at}</span> <span>  {bill.car_year} {bill.car_make} {bill.car_model} </span>  - Chassis : <span className="">{bill.car_chassis}</span>
                    </div>
              </h3>
              <table className="w-full mb-4 border-collapse print:border-none dark:text-white">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-700">
                    <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                      سعر الشراء
                    </th>
                    <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                      مدفوع (سعر الشراء)
                    </th>
                    <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                      سعر الشحن
                    </th>
                    <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                      مدفوع (سعر الشحن)
                    </th>
                    <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                      مجموع الذمم
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800 dark:text-white">
                    <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                      {formatCurrency(bill.won_price.amount)}
                    </td>
                    <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                      {formatCurrency(bill.won_price.total_paid)}
                    </td>
                    <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                      {formatCurrency(bill.shipping_cost.amount)}
                    </td>
                    <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                      {formatCurrency(bill.shipping_cost.total_paid)}
                    </td>
                    <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                      {formatCurrency(calculateTotalDebts(bill))}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Detailed Payments */}
              {/* Won Price Payments */}
              <h4 className="mb-1 text-xs font-semibold dark:text-white md:text-base">تسديدات سعر الشراء</h4>
              {bill.won_price.payments.length > 0 ? (
                <table className="w-full mb-4 text-xs border-collapse print:border-none dark:text-white md:text-base">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        رقم الدفع
                      </th>
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        القيمة المسددة
                      </th>
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        تاريخ الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.won_price.payments.map((payment, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                          {payment.payment_id}
                        </td>
                        <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                          {formatCurrency(payment.won_price_amount)}
                        </td>
                        <td className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                          {payment.payment_date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mb-4 text-xs text-red-500 dark:text-white md:text-base">لا يوجد تسديدات لسعر الشراء</p>
              )}

              {/* Shipping Cost Payments */}
              <h4 className="mb-1 text-xs font-semibold dark:text-white md:text-base">تسديدات سعر الشحن</h4>
              {bill.shipping_cost.payments.length > 0 ? (
                <table className="w-full mb-4 border-collapse print:border-none dark:text-white">
                  <thead>
                    <tr className="bg-blue-100 dark:bg-blue-700">
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        رقم الدفع
                      </th>
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        القيمة المسددة
                      </th>
                      <th className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                        تاريخ الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.shipping_cost.payments.map((payment, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                          {payment.payment_id}
                        </td>
                        <td className="p-2 text-xs text-right border dark:border-gray-600 md:text-base">
                          {formatCurrency(payment.shipping_cost_amount)}
                        </td>
                        <td className="p-2 text-xs text-right border dark:border-gray-600 text-nowrap md:text-base">
                          {payment.payment_date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-red-500 dark:text-white md:text-base">لا يوجد تسديدات لسعر الشحن</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
