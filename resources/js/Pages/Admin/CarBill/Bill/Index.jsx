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

export default function Index({ auth, site_settings, customers, payments, success,boxeslist ,danger }) {
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

    const initialPayments = customer.bills.map((bill) => ({
        bill_id: bill.bill_id,
        car_chassis: bill.car_chassis,
        won_price_payment: 0,
        remain_won_price: bill.remain_won_price,
        shipping_cost_payment: 0,
        remain_shipping_cost: bill.remain_shipping_cost,

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
    const updatedPayments = [...createData.payments];
    updatedPayments[index][type] = value;
      setCreateData("payments", updatedPayments);

    // Recalculate the total
    const overallTotalUsed = updatedPayments.reduce((total, payment) => {
        return total + (Number(payment.won_price_payment) || 0) + (Number(payment.shipping_cost_payment) || 0);
    }, 0);

    setSelectedCustomer((prevState) => ({
        ...prevState,
        total_used: overallTotalUsed,
    }));

    setCreateData("total_used", overallTotalUsed);

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
        const customer = customerList.find((c) => c.customer_id === payment.customer_id); //the customer we edit his payment


        if (customer) {
            setSelectedCustomer(customer);
            // Merge customer bills with payment bills (if the bill was already paid)

            const allBills = customer.bills.map((bill) => {
                // const paymentBill = payment.paid_bills.find(paid_bill => paid_bill.bill_id === bill.bill_id); //the payment and it's paid bills  edit
                const paymentBill = payment.paid_bills.find(paid_bill => String(paid_bill.bill_id) === String(bill.bill_id));


                return {
                    payment_bill_id: paymentBill ? paymentBill.payment_bill_id : null,

                    bill_id: bill.bill_id,
                    car_chassis: bill.car_chassis,

                    won_price: bill.won_price,
                    won_price_paid_amount:bill.won_price_paid_amount,
                    remain_won_price: bill.remain_won_price,
                    won_price_payment: paymentBill ? paymentBill.won_price_paid_on_bill : 0,



                    shipping_cost:bill.shipping_cost,
                    remain_shipping_cost: bill.remain_shipping_cost,
                    shipping_cost_paid_amount: bill.shipping_cost_paid_amount,
                    shipping_cost_payment: paymentBill ? paymentBill.shipping_cost_paid_on_bill : 0,

                };
            });
            // Set the form data for editing
            setEditData({
                customer_id: customer.customer_id,
                payments: allBills,
                box_id: payment.box_id,
                total_used: Number(payment.total_amount),
                _method: "PUT",
            });

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

    const toggleShowModal = (payment = null) => {
        if (payment) {
        const customer = customerList.find((c) => c.customer_id === payment.customer_id);


        if (customer) {
            setSelectedCustomer(customer);

            const allBills = customer.bills.map((bill) => {
                const paymentBill = payment.paid_bills.find(paid_bill => String(paid_bill.bill_id) === String(bill.bill_id));

                return {
                    payment_bill_id: paymentBill ? paymentBill.payment_bill_id : null,

                    bill_id: bill.bill_id,
                    car_chassis: bill.car_chassis,

                    won_price: bill.won_price,
                    won_price_paid_amount:bill.won_price_paid_amount,
                    remain_won_price: bill.remain_won_price,
                    won_price_payment: paymentBill ? paymentBill.won_price_paid_on_bill : 0,

                    shipping_cost:bill.shipping_cost,
                    remain_shipping_cost: bill.remain_shipping_cost,
                    shipping_cost_paid_amount: bill.shipping_cost_paid_amount,
                    shipping_cost_payment: paymentBill ? paymentBill.shipping_cost_paid_on_bill : 0,

                };
            });

            setSelectedCustomer((prevState) => ({
                ...prevState,
                total_used: payment.total_amount,
            }));

            setShowPayment(allBills);
        }else {
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
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3">Id</th>
                      <th className="p-3">الشركة</th>
                      <th className="p-3">القيمة الكليه</th>
                      {/* <th className="p-3">صندوق</th> */}
                      <th className="p-3">اضافه بواسطه</th>
                      <th className="p-3">تحديث بواسطه</th>
                      <th className="p-3">تاريخ الانشاء</th>
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
                          <td className="px-3 py-2 text-nowrap">{payment.customer_name}</td>
                          <td className="px-3 py-2 text-nowrap">{payment.total_amount}</td>
                          {/* <td className="px-3 py-2 text-nowrap">{payment.box_name}</td> */}
                          <td className="px-3 py-2 text-nowrap">{payment.created_by}</td>
                          <td className="px-3 py-2 text-nowrap">{payment.updated_by}</td>
                          <td className="px-3 py-2 text-nowrap">{payment.created_at}</td>
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
                                مشاهده
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


                        <div className="col-span-1 mb-6">
                            {!auth.user.roles.includes("Accountant") && boxeslist && boxeslist.length > 0 && (
                            <div className="flex col-span-2 gap-5">
                                <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="box_id" value={"الصندوق"} />
                                <SelectInput
                                    id="box_id"
                                    name="box_id"
                                    onChange={(e) => setCreateData("box_id", e.target.value)}
                                >
                                    <option value="">اختر</option>
                                    {boxeslist.map((box) => (
                                    <option value={box.id} key={box.id}>
                                        {box.name}
                                    </option>
                                    ))}
                                </SelectInput>

                            </div>
                            )}
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
                        <th className="p-2 text-xs text-nowrap md:text-base">رقم الهيكل</th>
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
                    {selectedCustomer.bills.map((bill, index) => (
                        <tr key={bill.car_chassis} className="">
                            <td className="py-4 border-t border-b">{bill.car_chassis}</td>
                            <td className="py-4 border-t border-b">{bill.won_price}</td>
                            <td className="py-4 border-t border-b">{bill.won_price_paid_amount}</td>
                            <td className="py-4 border-t border-b">{bill.remain_won_price}</td>

                            <td className="py-4 border-t border-b border-l-2">
                                <TextInput
                                type="number"
                                value={createData.payments[index]?.won_price_payment || 0}
                                onChange={(e) => handlePaymentChange(index, "won_price_payment", e.target.value)}
                                max={selectedCustomer.bills[index].remain_won_price}

                                />
                            </td>

                            <td className="py-4 border-t border-b">{bill.shipping_cost}</td>
                            <td className="py-4 border-t border-b">{bill.shipping_cost_paid_amount}</td>
                            <td className="py-4 border-t border-b">{bill.remain_shipping_cost}</td>
                            <td className="py-4 border-t border-b">
                                <TextInput
                                type="number"
                                value={createData.payments[index]?.shipping_cost_payment || 0}
                                onChange={(e) => handlePaymentChange(index, "shipping_cost_payment", e.target.value)}
                                max={selectedCustomer.bills[index].remain_shipping_cost}

                                />
                            </td>
                        </tr>

                    ))}
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
              <h2 className="text-lg font-semibold dark:text-white">تعديل تسديد</h2>
            </div>
                    <div className="p-6">


                        <div className="grid grid-cols-8 mb-6">
                            {!auth.user.roles.includes("Accountant") && boxeslist && boxeslist.length > 0 && (
                            <div className="flex col-span-2 gap-5">
                                <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="box_id" value={"الصندوق"} />
                                <SelectInput
                                    id="box_id"
                                    name="box_id"
                                          onChange={(e) => setEditData("box_id", e.target.value)}
                                          value={editData.box_id || ""}
                                >
                                    <option value="">اختر</option>
                                    {boxeslist.map((box) => (
                                    <option value={box.id} key={box.id}>
                                        {box.name}
                                    </option>
                                    ))}
                                </SelectInput>

                            </div>
                            )}
                        </div>
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
                        <th className="p-2 text-xs text-nowrap md:text-base">رقم الهيكل</th>
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
              <h2 className="text-lg font-semibold dark:text-white">تعديل تسديد</h2>
            </div>
                    <div className="p-6">

                        <div className="flex gap-5 m-6 text-gray-700 md:text-xl dark:text-white">
                            <span > رصيد العميل : {selectedCustomer.customer_balance} </span>
                            <span > رصيد مستخدم : {selectedCustomer.total_used || 0} </span>
                        </div>

                {showPayment && (
                    <>
                        <table className="w-full text-center text-gray-700 dark:text-white">
                            <thead>
                            <tr>
                                <th className="p-2 text-xs text-nowrap md:text-base">رقم الهيكل</th>
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
          {selectedMake ? selectedMake.customer_name : placeholder}
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
                    value={item.customer_name}
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
                    {item.customer_name}
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
