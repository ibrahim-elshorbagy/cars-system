import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth, site_settings, customers, payments, success ,danger }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);
    const [visibleSuccess, setVisibleSuccess] = useState(success);
    const [visibleDanger, setVisibleDanger] = useState(danger);

    const [operationPerformed, setOperationPerformed] = useState(false);

    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [showPayment, setShowPayment] = useState(null);

    const customerList = customers?.data || customers;

  useEffect(() => {
    if (success && operationPerformed) {
      setVisibleSuccess(success);
      const timer = setTimeout(() => {
        setVisibleSuccess(null);
        setOperationPerformed(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, operationPerformed]);

      useEffect(() => {
    if (danger) {
      setVisibleDanger(danger);
      const timer = setTimeout(() => {
        setVisibleDanger(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger]);




// --------------------------------------------------- create forms defiens  --------------------------------
  // Form for creating payment
  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    reset: createReset,
    errors: createErrors,
  } = useForm({
    customer_id: "",
      payments: [],
        total_used:0,
  });

    const toggleCreateModal = () => {

    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
        createReset();
        setSelectedCustomer('');

    }
  };

      // Create payment submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(route("bill-payment.store"), {
      onSuccess: () => {
        createReset();
        toggleCreateModal();
        setOperationPerformed(true);
      },
    });
  };
// --------------------------- Handle customer selection  ----------------

const handleCustomerSelect = (customer) => {

    setSelectedCustomer(customer);
    const filteredBills = customer.bills.filter(
    (bill) => Number(bill.won_price) !== Number(bill.won_price_paid_amount) || Number(bill.shipping_cost) !== Number(bill.shipping_cost_paid_amount)
    );
    console.log('filteredBills:', filteredBills)
    // Map the filtered bills to the initial payments structure
    const initialPayments = filteredBills.map((bill) => ({
        bill_id: bill.bill_id,
        car_chassis: bill.car_chassis,

        won_price: bill.won_price,
        won_price_paid_amount: bill.won_price_paid_amount,
        remain_won_price: bill.remain_won_price,
        won_price_payment: 0,


        shipping_cost: bill.shipping_cost,
        shipping_cost_paid_amount: bill.shipping_cost_paid_amount,
        remain_shipping_cost: bill.remain_shipping_cost,
        shipping_cost_payment: 0,

    }));

    setCreateData({
        customer_id: customer.customer_id,
        payments: initialPayments,
        total_used: 0,
    });
  };
// --------------------------- Handle changes on payment for create form ----------------

  // Handle payment change in the form
    const handlePaymentChange = (index, type, value) => {
    // Create a copy of the payments array to avoid mutating state directly
    const updatedPayments = [...createData.payments];

    // Ensure that the index exists in the array to avoid 'undefined' errors
    if (updatedPayments[index]) {
        updatedPayments[index][type] = value;
    }

    // Update the state with the modified payments array
    setCreateData((prevData) => ({
        ...prevData,
        payments: updatedPayments,
    }));

    // Recalculate the total
    const overallTotalUsed = updatedPayments.reduce((total, payment) => {
        return total + (Number(payment.won_price_payment) || 0) + (Number(payment.shipping_cost_payment) || 0);
    }, 0);

    // Update the customer total used
    setSelectedCustomer((prevState) => ({
        ...prevState,
        total_used: overallTotalUsed,
    }));

    // Update the total used in createData as well
    setCreateData((prevData) => ({
        ...prevData,
        total_used: overallTotalUsed,
    }));
    };



 // --------------------------------------------------- Edit forms defiens --------------------------------

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    reset: editReset,
    errors: editErrors,
  } = useForm({
    customer_id: "",
      payments: [],
    total_used:0,
    _method: "PUT",
  });

      // Edit payment submit handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    editPost(route("bill-payment.update", editingPayment.id), {
      onSuccess: () => {
        editReset();
        toggleEditModal();
        setOperationPerformed(true);
      },
    });
  };
// --------------------------- Handle changes on payment for edit form ----------------

  const handleEditPaymentChange = (index, type, value) => {
    const updatedPayments = [...editData.payments];
    updatedPayments[index][type] = value;
    setEditData("payments", updatedPayments);

    // Recalculate the total
    const overallTotalUsed = updatedPayments.reduce((total, payment) => {
        return total + (Number(payment.won_price_payment) || 0) + (Number(payment.shipping_cost_payment) || 0);
    }, 0);

    setSelectedCustomer((prevState) => ({
        ...prevState,
        total_used: overallTotalUsed,
    }));

    setEditData("total_used", overallTotalUsed);

  };





// --------------------------- handel open edit modal ----------------

  const toggleEditModal = (payment = null) => {
    if (payment) {
      // Find the customer from the customer list based on the payment's customer_id
      const customer = customerList.find((c) => c.customer_id === payment.customer_id);

      if (customer) {
        setSelectedCustomer(customer);

        // Merge customer bills with payment bills (if the bill was already paid in this transaction)
        const allBills = customer.bills
          .filter((bill) => {
            // Find if this bill was paid in the current transaction
            const paymentBill = payment.paid_bills.find(
              (paid_bill) => String(paid_bill.bill_id) === String(bill.bill_id)
            );

            // Include the bill if it has been paid in this transaction or if it is not fully paid
            return (
              paymentBill ||
              Number(bill.won_price) !== Number(bill.won_price_paid_amount) ||
              Number(bill.shipping_cost) !== Number(bill.shipping_cost_paid_amount)
            );
          })
          .map((bill) => {
            // Check if this bill has a corresponding payment record in the current transaction
            const paymentBill = payment.paid_bills.find(
              (paid_bill) => String(paid_bill.bill_id) === String(bill.bill_id)
            );

            return {
              payment_bill_id: paymentBill ? paymentBill.payment_bill_id : null,
              bill_id: bill.bill_id,
              car_chassis: bill.car_chassis,
              won_price: bill.won_price,
              won_price_paid_amount: bill.won_price_paid_amount,
              remain_won_price: bill.remain_won_price,
              won_price_payment: paymentBill ? paymentBill.won_price_paid_on_bill : 0,
              shipping_cost: bill.shipping_cost,
              remain_shipping_cost: bill.remain_shipping_cost,
              shipping_cost_paid_amount: bill.shipping_cost_paid_amount,
              shipping_cost_payment: paymentBill ? paymentBill.shipping_cost_paid_on_bill : 0,
            };
          });

        // Set the form data for editing
        setEditData({
          customer_id: customer.customer_id,
          payments: allBills,
          total_used: Number(payment.total_amount),
          _method: "PUT",
        });

        // Update the selected customer state
        setSelectedCustomer((prevState) => ({
          ...prevState,
          total_used: payment.total_amount,
        }));

        setEditingPayment(payment);
      }
    } else {
      setEditingPayment(null);
      editReset();
    }

    // Toggle the modal visibility
    setIsEditModalOpen(!isEditModalOpen);
  };

// --------------------------- handel delete ----------------
      const deletePayment = (payment) => {
    if (!window.confirm("هل انت متاكد من حذف عملية تسديد الذمم ؟ ")) {
      return;
    }
      router.delete(route("bill-payment.destroy", payment), {

        onSuccess: (page) => {
            setOperationPerformed(true);
            setVisibleSuccess(page.props.success);
            setVisibleDanger(page.props.danger);
      }
    });
    };

// --------------------------- handel open Show modal ----------------
const [thePayment, setThePayment] = useState(null)

const toggleShowModal = (payment = null) => {
        if (payment) {
            const customer = customerList.find((c) => c.customer_id === payment.customer_id);

            setThePayment(payment); //for extra info from payment itself like (created_at ..etc)

            if (customer) {
                setSelectedCustomer(customer); //we set customer to get  balance + total_used on this payment

                const paidBills = customer.bills
                    .map((bill) => {
                        const paymentBill = payment.paid_bills.find(paid_bill => String(paid_bill.bill_id) === String(bill.bill_id));
                        if (paymentBill) {
                            return {
                                payment_bill_id: paymentBill.payment_bill_id,
                                bill_id: bill.bill_id,
                                car_chassis: bill.car_chassis,
                                car_make: bill.car_make,
                                car_model: bill.car_model,
                                won_price: bill.won_price,
                                won_price_paid_amount: bill.won_price_paid_amount,
                                remain_won_price: bill.remain_won_price,
                                won_price_payment: paymentBill.won_price_paid_on_bill,
                                shipping_cost: bill.shipping_cost,
                                remain_shipping_cost: bill.remain_shipping_cost,
                                shipping_cost_paid_amount: bill.shipping_cost_paid_amount,
                                shipping_cost_payment: paymentBill.shipping_cost_paid_on_bill,
                            };
                        }
                        return null;
                    })
                    .filter(bill => bill !== null);

                setSelectedCustomer((prevState) => ({
                    ...prevState,
                    total_used: payment.total_amount,
                }));
                setShowPayment(paidBills);
            } else {
                setShowPayment(null);
            }
        }
        // Toggle the modal visibility
        setIsShowModalOpen(!isShowModalOpen);
    };


  return (
    <AuthenticatedLayout
      user={auth.user}
      site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            تسديد ذمم
          </h2>
          {auth.user.permissions.includes("create-billPayment") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              تسديد
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " + "تسديد ذمم"} />
      <div className="">
        <div className="mx-auto ">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
          )}
          {visibleDanger && (
            <div className="px-4 py-2 mb-4 text-white bg-red-600 rounded">
              {visibleDanger}
            </div>
                  )}
          {/* Payments table */}
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 md:p-3 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3">Id</th>
                      <th className="p-3">الشركة</th>
                      <th className="p-3">القيمة الكليه</th>
                      {/* <th className="p-3">صندوق</th> */}
                      {/* <th className="p-3">اضافة بواسطة</th> */}
                      {/* <th className="p-3">تحديث بواسطة</th> */}
                      {/* <th className="p-3">تاريخ الانشاء</th> */}
                      <th className="p-3">تاريخ التحديث</th>
                      <th className="p-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments && payments.data.length > 0 ? (
                      payments.data.map((payment) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={payment.id}
                        >
                          <td className="px-3 py-2">{payment.id}</td>
                          <td className="px-3 py-2 text-nowrap">{payment.customer_company}</td>
                          <td className="px-3 py-2 text-nowrap">{payment.total_amount}</td>

                          {/* <td className="px-3 py-2 text-nowrap">{payment.created_by}</td> */}
                          {/* <td className="px-3 py-2 text-nowrap">{payment.updated_by}</td> */}
                          {/* <td className="px-3 py-2 text-nowrap">{payment.created_at}</td> */}
                          <td className="px-3 py-2 text-nowrap">{payment.updated_at}</td>
                              <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-billPayment") && (
                              <button
                                onClick={() => toggleEditModal(payment)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-billPayment") && (
                              <button
                                onClick={() => deletePayment(payment)}
                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                حذف
                              </button>
                                  )}
                                <button
                                    onClick={() => toggleShowModal(payment)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                              >
                                مشاهدة
                              </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-3 py-2 text-center">
                          لا يوجد تسديدات
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating a new payment */}
      {isCreateModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-11/12 max-h-screen overflow-y-auto transition-all duration-300 ease-in-out transform bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة تسديد</h2>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-3 md:m-0 md:grid-cols-3">
                        <div className="flex col-span-1 gap-5 mt-1">
                            <InputLabel className="mt-1 text-xl text-nowrap" value={"اختر العميل"} />
                            <ComboboxMakes
                                items={customerList}
                                onItemSelect={handleCustomerSelect}
                                placeholder="اختر العميل"
                                emptyMessage="لا يوجد عملاء"
                            />
                        </div>

                    </div>


                {selectedCustomer && (
                <>
                        <div className="flex gap-5 m-6 text-gray-700 md:text-xl dark:text-white">
                            <span > رصيد العميل : {selectedCustomer.customer_balance} </span>
                            <span > رصيد مستخدم : {selectedCustomer.total_used || 0} </span>
                        </div>
                <table className="w-full text-center text-gray-700 dark:text-white">
                    <thead>
                    <tr>
                        <th className="p-2 text-xs text-nowrap md:text-base">VIN</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price Paid</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price Remain</th>
                        <th className="p-2 text-xs border-l-2 text-nowrap md:text-base" >Pay</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Paid</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Remain</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Pay</th>

                    </tr>
                    </thead>
                    <tbody>
                        {createData.payments.length > 0 ? (
                            createData.payments.map((bill, index) => (
                                <tr key={bill.car_chassis} className="">
                                    <td className="py-4 border-t border-b">{bill.car_chassis}</td>
                                    <td className="py-4 border-t border-b">{bill.won_price}</td>
                                    <td className="py-4 border-t border-b">{bill.won_price_paid_amount}</td>
                                    <td className="py-4 border-t border-b">{bill.remain_won_price}</td>
                                    <td className="py-4 border-t border-b border-l-2">
                                        <TextInput
                                            type="number"
                                            onChange={(e) => handlePaymentChange(index, "won_price_payment", e.target.value)}
                                            max={bill.remain_won_price}
                                        />
                                    </td>
                                    <td className="py-4 border-t border-b">{bill.shipping_cost}</td>
                                    <td className="py-4 border-t border-b">{bill.shipping_cost_paid_amount}</td>
                                    <td className="py-4 border-t border-b">{bill.remain_shipping_cost}</td>
                                    <td className="py-4 border-t border-b">
                                        <TextInput
                                            type="number"
                                            onChange={(e) => handlePaymentChange(index, "shipping_cost_payment", e.target.value)}
                                            max={bill.remain_shipping_cost}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-4 text-center border-t border-b">لا يوجد سيارات</td>
                            </tr>
                        )}
                    </tbody>

                        </table>
                        <div>
                            <ul className="mt-2 text-red-600 list-disc list-inside">
                                {Object.keys(createErrors).map((key) => (
                                    <li key={key}>{createErrors[key]}</li>
                                ))}
                            </ul>
                        </div>
                </>)}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={toggleCreateModal}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing a payment */}
      {isEditModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-11/12 max-h-screen overflow-y-auto transition-all duration-300 ease-in-out transform bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل التسديد</h2>
            </div>
                    <div className="p-6">


                        <div className="flex gap-5 m-6 text-gray-700 md:text-xl dark:text-white">
                            <span > رصيد العميل : {selectedCustomer.customer_balance} </span>
                            <span > رصيد مستخدم : {selectedCustomer.total_used || 0} </span>
                        </div>
              <form onSubmit={handleEditSubmit}>
                              {editingPayment && (
                                  <>
                  <table className="w-full text-center text-gray-700 dark:text-white">
                    <thead>
                    <tr>
                        <th className="p-2 text-xs text-nowrap md:text-base">VIN</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price Paid</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Won Price Remain</th>
                        <th className="p-2 text-xs border-l-2 text-nowrap md:text-base" >Pay</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Paid</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Remain</th>
                        <th className="p-2 text-xs text-nowrap md:text-base">Pay</th>

                    </tr>
                    </thead>
                    <tbody>
                        {editData.payments.map((bill, index) => (
                            <tr key={bill.car_chassis}>
                                <td className="py-4 border-t border-b">{bill.car_chassis}</td>
                                <td className="py-4 border-t border-b">{bill.won_price}</td>
                                <td className="py-4 border-t border-b">{bill.won_price_paid_amount}</td>
                                <td className="py-4 border-t border-b">{bill.remain_won_price}</td>

                                <td className="py-4 border-t border-b border-l-2">
                                    <TextInput
                                    type="number"
                                    value={editData.payments[index]?.won_price_payment || 0}

                                    onChange={(e) => handleEditPaymentChange(index, "won_price_payment", e.target.value)}
                                    // max={selectedCustomer.bills[index].remain_won_price}

                                    />
                                </td>

                                <td className="py-4 border-t border-b">{bill.shipping_cost}</td>
                                <td className="py-4 border-t border-b">{bill.shipping_cost_paid_amount}</td>
                                <td className="py-4 border-t border-b">{bill.remain_shipping_cost}</td>
                                <td className="py-4 border-t border-b">
                                    <TextInput
                                    type="number"
                                    value={editData.payments[index]?.shipping_cost_payment || 0}
                                    onChange={(e) => handleEditPaymentChange(index, "shipping_cost_payment", e.target.value)}
                                    // max={selectedCustomer.bills[index].remain_shipping_cost}

                                    />
                                </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                                 <div>
                                    <ul className="mt-2 text-red-600 list-disc list-inside">
                                        {Object.keys(editErrors).map((key) => (
                                            <li key={key}>{editErrors[key]}</li>
                                        ))}
                                    </ul>
                                </div>
                                  </>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={toggleEditModal}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
          )}
      {isShowModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-11/12 max-h-screen overflow-y-auto transition-all duration-300 ease-in-out transform bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">مشاهدة التسديد</h2>
            </div>
                    <div className="p-6">
                            <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-gray-500">
                                <div>
                                <h1 className="text-xs font-bold lg:text-3xl ">{site_settings.websiteName}</h1>
                                <p className="text-xs lg:text-lg">{site_settings.phone}</p>
                                <p className="text-xs lg:text-lg">{site_settings.email}</p>
                                </div>
                                <div>
                                <img
                                    src={site_settings.websiteLogo}
                                    alt="Website Logo"
                                    className="h-8 lg:h-16"
                                />
                                </div>
                            </div>
                        <div className="flex gap-5 m-6 text-gray-700 md:text-xl dark:text-white">
                            <span > رصيد العميل : {selectedCustomer.customer_balance} </span>
                            <span > رصيد مستخدم : {selectedCustomer.total_used || 0} </span>
                        </div>

                {showPayment && (
                              <>

                        <table className="w-full text-center text-gray-700 dark:text-white">
                            <thead>
                            <tr>
                                <th className="p-2 text-xs text-nowrap md:text-base">VIN</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Make</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Model</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Won Price</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Won Price Paid</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Won Price Remain</th>
                                <th className="p-2 text-xs border-l-2 text-nowrap md:text-base" >Pay</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Paid</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Shipping Cost Remain</th>
                                <th className="p-2 text-xs text-nowrap md:text-base">Pay</th>

                            </tr>
                            </thead>
                            <tbody>
                                {showPayment.map((bill, index) => (
                                    <tr key={bill.car_chassis}>
                                        <td className="py-4 border-t border-b">{bill.car_chassis}</td>
                                        <td className="py-4 border-t border-b">{bill.car_make}</td>
                                        <td className="py-4 border-t border-b">{bill.car_model}</td>
                                        <td className="py-4 border-t border-b">{bill.won_price}</td>
                                        <td className="py-4 border-t border-b">{bill.won_price_paid_amount}</td>
                                        <td className="py-4 border-t border-b">{bill.remain_won_price}</td>

                                        <td className="py-4 border-t border-b border-l-2">{bill.won_price_payment}</td>

                                        <td className="py-4 border-t border-b">{bill.shipping_cost}</td>
                                        <td className="py-4 border-t border-b">{bill.shipping_cost_paid_amount}</td>
                                        <td className="py-4 border-t border-b">{bill.remain_shipping_cost}</td>
                                        <td className="py-4 border-t border-b">{bill.shipping_cost_payment}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                          )}
                        {thePayment && (
                            <div className="mt-10 text-gray-700 dark:text-white">
                            <h3 className="mb-4 text-xl font-bold">تفاصيل السند</h3>
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                {/* Created By */}
                                <div>
                                <p className="font-bold">أنشئ بواسطة:</p>
                                <p>{thePayment.created_by ? thePayment.created_by : "غير متوفر"}</p>
                                </div>

                                {/* Created At */}
                                <div>
                                <p className="font-bold">تاريخ الإنشاء:</p>
                                <p>{thePayment.created_at}</p>
                                </div>

                                {/* Updated By - Conditional Rendering */}

                                <div>
                                    <p className="font-bold">آخر تعديل بواسطة:</p>
                                    <p>{thePayment.updated_by}</p>
                                </div>


                                {/* Updated At - Conditional Rendering */}

                                <div>
                                    <p className="font-bold">تاريخ آخر تعديل:</p>
                                    <p>{thePayment.updated_at}</p>
                                </div>

                            </div>
                            </div>
                        )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={toggleShowModal}
                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                    >
                        غلق
                    </button>
                </div>
            </div>
          </div>
        </div>
          )}

    </AuthenticatedLayout>
  );
}

// Combobox for selecting customers
function ComboboxMakes({ items, onItemSelect, selectedMakeId, placeholder, emptyMessage }) {
  const [open, setOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState(
    selectedMakeId ? items.find((item) => item.customer_id === selectedMakeId) : null
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedMake ? selectedMake.customer_company : placeholder}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="ابحث عن عميل..." />
          <CommandList>
            {items && items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.customer_id}
                    value={item.customer_company}
                    onSelect={() => {
                      setSelectedMake(item);
                      onItemSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedMake?.customer_id === item.customer_id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {item.customer_company}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
