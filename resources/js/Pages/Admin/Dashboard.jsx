import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from 'react';

import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Package,
  Warehouse,
  Loader,
  BookOpen,
  Ship,
  CheckCircle
} from "lucide-react";
import { TbTransfer } from "react-icons/tb";
import { PiBagSimpleDuotone } from "react-icons/pi";
import SelectInput from "@/Components/SelectInput";
import InputLabel from "@/Components/InputLabel";

const Dashboard = ({ auth, site_settings, carStatusCounts,total_income, total_outcome, net_balance, box_name, boxes}) => {
  // Define default values in case carStatusCounts is missing or some statuses have zero counts
  const defaultStatusCounts = {
    Purchased: 0,
    "Payment done": 0,
    Dispached: 0,
    "Picked up": 0,
    "At warehouse": 0,
    Loading: 0,
    Booked: 0,
    Shipped: 0,
    Delivered: 0,
  };

  // Merge the default counts with the actual counts from the prop
    const statusCounts = { ...defaultStatusCounts, ...carStatusCounts };

    const [selectedBox, setSelectedBox] = useState(null);

    // Set the default selected box on component mount based on the available data
    useEffect(() => {
        if (boxes.length > 0) {
        setSelectedBox(boxes[0]);
        }
    }, [boxes]);

    const handleBoxChange = (e) => {
        const selectedBoxId = e.target.value;
        const box = boxes.find((box) => box.box.id == selectedBoxId);
        setSelectedBox(box);
    };


  return (
    <>
      <Head title={`${site_settings.websiteName} - لوحة التحكم`} />
      <div className="">
        <div className="px-1 mx-auto sm:px-6 lg:px-6">
                <div className="px-1 mx-auto sm:px-6 lg:px-6">
                {auth.user.roles.some(role => ["Accountant", "admin"].includes(role))&& (

                <div className="my-10 overflow-hidden bg-white shadow-md dark:bg-gray-800">

                            {/* Display Select Box for Admin */}
                            {auth.user.roles.includes("admin") && (
                            <div className="grid p-6 md:grid-cols-4">
                                <div>
                                <InputLabel htmlFor="box_name" value={"اسم الصندوق"} />
                                <SelectInput
                                    name="box"
                                    id="box"
                                    value={selectedBox?.box?.id || ""}
                                    onChange={handleBoxChange}
                                    className="block w-full mt-1"
                                >
                                    {boxes.map((boxItem) => (
                                    <option value={boxItem.box.id} key={boxItem.box.id}>
                                        {boxItem.box.name}
                                    </option>
                                    ))}
                                </SelectInput>
                                </div>
                            </div>
                            )}

                          {/* Display selected box data */}

                            {selectedBox && (
                                <>
                                    <div className="p-4 text-lg font-bold text-gray-900 dark:text-white">
                                    {selectedBox.box.name}
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:p-4">
                                    {/* Total Income */}
                                                <Card className="w-full">
                                                    <CardContent className="flex items-center justify-between p-3 bg-green-100 md:p-6 dark:bg-green-800">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                                                        مجموع الداخل
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                                        {selectedBox.total_income}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                                                        <CreditCard className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                                                    </div>
                                                    </CardContent>
                                    </Card>
                                    {/* Total Outcome */}
                                                <Card className="w-full">
                                                    <CardContent className="flex items-center justify-between p-3 bg-yellow-100 md:p-6 dark:bg-yellow-800">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                                                        مجموع الخارج
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                                        {selectedBox.total_outcome}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                                                        <TbTransfer className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                                                    </div>
                                                    </CardContent>
                                    </Card>
                                    {/* Net Balance */}
                                    <Card className="w-full">
                                        <CardContent className="flex items-center justify-between p-3 bg-purple-100 md:p-6 dark:bg-purple-800">
                                        <div className="flex flex-col items-start">
                                            <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                                            موجودات الصندوق
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                            {selectedBox.net_balance}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                                            <PiBagSimpleDuotone className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                                        </div>
                                        </CardContent>
                                    </Card>
                                    </div>
                                </>
                                )}
                </div>
                )}
            </div>


            {/* Car Status Cards */}


            <div className="my-10 overflow-hidden bg-white shadow-md dark:bg-gray-800">
                <div className="p-4 text-lg font-bold text-gray-900 dark:text-white">
                        السيارات
                </div>
                <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:p-4">
                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-blue-100 md:p-6 dark:bg-blue-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Purchased
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Purchased}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <ShoppingCart className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-green-100 md:p-6 dark:bg-green-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Payment done
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts["Payment done"]}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <CreditCard className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-yellow-100 md:p-6 dark:bg-yellow-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Dispatched
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Dispached}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <Truck className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-purple-100 md:p-6 dark:bg-purple-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Picked up
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts["Picked up"]}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <Package className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-indigo-100 md:p-6 dark:bg-indigo-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        At warehouse
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts["At warehouse"]}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <Warehouse className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-pink-100 md:p-6 dark:bg-pink-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Loading
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Loading}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <Loader className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-red-100 md:p-6 dark:bg-red-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Booked
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Booked}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <BookOpen className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-teal-100 md:p-6 dark:bg-teal-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Shipped
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Shipped}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <Ship className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="flex items-center justify-between p-3 bg-orange-100 md:p-6 dark:bg-orange-800">
                    <div className="flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                        Delivered
                        </p>
                        <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                        {statusCounts.Delivered}
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                        <CheckCircle className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                    </div>
                    </CardContent>
                </Card>
                </div>
            </div>


        </div>
      </div>
    </>
  );
};

Dashboard.layout = (page) => (
  <AuthenticatedLayout
    user={page.props.auth.user}
    site_settings={page.props.site_settings}
    header={
      <h2 className="text-xl font-semibold leading-tight text-white dark:text-gray-200">
        لوحة التحكم
      </h2>
    }
  >
    {page}
  </AuthenticatedLayout>
);

export default Dashboard;
