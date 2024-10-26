import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function BillsDetailsReport({ auth, site_settings, bills ,customer}) {
  // State for date filtering
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Function to format numbers as currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Function to calculate total debts for a car
  const calculateTotalDebts = (bill) => {
    const totalAmount =
      parseFloat(bill.won_price.amount) + parseFloat(bill.shipping_cost.amount);
    const totalPaid =
      parseFloat(bill.won_price.total_paid) +
      parseFloat(bill.shipping_cost.total_paid);
    return (totalAmount - totalPaid).toFixed(2);
  };

  // Function to calculate total debts for all bills
  const calculateTotalDebtsForAllBills = (filteredBills) => {
    return filteredBills
      .reduce((total, bill) => {
        return total + parseFloat(calculateTotalDebts(bill));
      }, 0)
      .toFixed(2);
  };

  // Function to check if the bill is fully paid
  const isFullyPaid = (bill) => {
    const totalDue =
      bill.won_price.amount -
      bill.won_price.total_paid +
      (bill.shipping_cost.amount - bill.shipping_cost.total_paid);
    return Math.abs(totalDue) === 0;
  };

  // Function to filter bills based on fromDate and toDate
  const filterBillsByDate = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return bills.filter((bill) => {
      const billDate = new Date(bill.car_created_at);

      if (from && to) {
        return billDate >= from && billDate <= to;
      } else if (from) {
        return billDate >= from;
      } else if (to) {
        return billDate <= to;
      } else {
        return true;
      }
    });
  };

  const filteredBills = filterBillsByDate();

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
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md md:text-base hover:bg-blue-700"
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
        {/* Date Filters */}
        <div className="mb-8">

        <div className="flex items-center gap-5">
                <h3 className="mt-2 text-lg font-semibold dark:text-white">
                    التاريخ
                </h3>
            <div>
              <InputLabel className="block mb-1 text-sm dark:text-white">
                من تاريخ:
              </InputLabel>
              <TextInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <InputLabel className="block mb-1 text-sm dark:text-white">
                إلى تاريخ:
              </InputLabel>
              <TextInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

          </div>
        </div>
        <div className="overflow-auto">
                  <div className="my-4 mb-8">
            <h1 className="text-base font-bold md:text-2xl dark:text-white">
              العميل : {customer.name}
            </h1>
            <h1 className="text-base font-bold md:text-2xl dark:text-white">
              الشركة : {customer.customer.customer_company}
            </h1>
            <h1 className="text-sm md:text-lg dark:text-white">
              <span className="font-bold">التاريخ</span>:{" "}
              {new Date().toLocaleString()}
            </h1>
          </div>
          {/* For each car */}
          {filteredBills.map((bill, index) => (
            <div key={index} className="mb-8">
              {/* Car Details */}
              <h3 className="mb-2 text-sm font-bold text-gray-800 dark:text-white">
                <div
                  dir="ltr"
                  className="flex flex-col gap-2 text-2xl font-bold text-right text-blue-900 dark:text-white"
                >
                  <div>
                    <span className="ml-2 text-sm text-nowrap md:text-lg">
                      تاريخ الشراء - {bill.car_created_at}
                    </span>

                    {isFullyPaid(bill) ? (
                      <span className="p-1 text-xs text-green-600 bg-green-100 rounded-full md:px-2 md:text-base">
                        مسددة
                      </span>
                    ) : (
                      <span className=""></span>
                    )}
                  </div>

                  <div className="text-sm text-nowrap md:text-2xl">
                    {bill.car_year} {bill.car_make} {bill.car_model} - Chassis :{" "}
                    {bill.car_chassis}
                  </div>
                </div>
              </h3>
              <table className="w-full mb-4 border-collapse print:border-none dark:text-white">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-700">
                    <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                      سعر الشراء
                    </th>
                    <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                      مدفوع (سعر الشراء)
                    </th>
                    <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                      سعر الشحن
                    </th>
                    <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                      مدفوع (سعر الشحن)
                    </th>
                    <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
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
              <h4 className="mb-1 text-xs font-semibold dark:text-white md:text-base">
                تسديدات سعر الشراء
              </h4>
              {bill.won_price.payments.length > 0 ? (
                <table className="mb-4 text-xs border-collapse print:border-none dark:text-white md:text-base w-[70%]">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-900">
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                        رقم الدفع
                      </th>
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                        القيمة المسددة
                      </th>
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
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
                        <td className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                          {payment.payment_date}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td
                        colSpan={1}
                        className="p-2 text-xs text-right border dark:border-gray-600 md:text-base"
                      >
                        المجموع
                      </td>
                      <td
                        colSpan={2}
                        className="p-2 text-xs text-right border dark:border-gray-600 md:text-base"
                      >
                        ${parseFloat(bill.won_price.total_paid).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="mb-4 text-xs text-red-500 dark:text-white md:text-base">
                  لا يوجد تسديدات لسعر الشراء
                </p>
              )}

              {/* Shipping Cost Payments */}
              <h4 className="mb-1 text-xs font-semibold dark:text-white md:text-base">
                تسديدات سعر الشحن
              </h4>
              {bill.shipping_cost.payments.length > 0 ? (
                <table className="mb-4 border-collapse print:border-none dark:text-white w-[70%]">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-900">
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                        رقم الدفع
                      </th>
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                        القيمة المسددة
                      </th>
                      <th className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
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
                        <td className="p-2 text-xs text-right border text-nowrap dark:border-gray-600 md:text-base">
                          {payment.payment_date}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={1}
                        className="p-2 text-xs text-right border dark:border-gray-600 md:text-base"
                      >
                        المجموع
                      </td>
                      <td
                        colSpan={2}
                        className="p-2 text-xs text-right border dark:border-gray-600 md:text-base"
                      >
                        ${parseFloat(bill.shipping_cost.total_paid).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-red-500 dark:text-white md:text-base">
                  لا يوجد تسديدات لسعر الشحن
                </p>
              )}
            </div>
          ))}

          {/* If no bills are found after filtering */}
          {filteredBills.length === 0 && (
            <p className="my-5 text-center text-red-500 dark:text-white">
              لا توجد سيارات في نطاق التاريخ المحدد
            </p>
          )}
        </div>

        <div className="px-6 py-3 text-left text-black bg-blue-100 rounded-lg">
          <h1 className="text-sm font-bold md:text-2xl">
            اجمالي الذمم : {calculateTotalDebtsForAllBills(filteredBills)} $
          </h1>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
