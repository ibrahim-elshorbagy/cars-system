import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import  { useState,useEffect } from "react";
import { Head,Link } from "@inertiajs/react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs"
import { FaCheck, FaTimes } from "react-icons/fa";


import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"



export default function Show({ auth, site_settings, car }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [flattenedImages, setFlattenedImages] = useState([]);

 useEffect(() => {
    const allImages = [];
    car.imagesForShow.forEach((dateGroup) => {
      dateGroup.images.forEach((image) => {
        allImages.push(image);
      });
    });
    setFlattenedImages(allImages);
  }, [car.imagesForShow]);

  const openModal = (imageUrl) => {
    const index = flattenedImages.findIndex((image) => image.image_url === imageUrl);
    if (index !== -1) {
      setSelectedImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? flattenedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === flattenedImages.length - 1 ? 0 : prevIndex + 1
    );
  };



  return (
      <AuthenticatedLayout user={auth.user} site_settings={site_settings}
            header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            معلومات السيارة
            </h2>
                <button
                onClick={() => window.history.back()}
                className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-400"
                >
                الرجوع
                </button>

        </div>
      }>
      <Head title={site_settings.websiteName + " - " + "معلومات السيارة"} />

        <div>
        <div className="mx-auto">
            <div className="bg-white shadow-sm dark:bg-gray-800">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
                <div className="mt-6">
                <Tabs defaultValue="general" >
                    <TabsList className="">
                    <div>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="shipping_fees">Shipping Fees</TabsTrigger>
                     <TabsTrigger value="photos">Photos</TabsTrigger>
                    </div>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general">
                    <table className="w-full text-sm text-left text-gray-500 ltr:text-left dark:text-gray-100">
                        <tbody>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.customer_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Customer Name</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.chassis}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Chassis</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.make_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Make</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.model_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Model</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.color}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Color</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.year}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Year</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="flex justify-end px-3 py-3">
                            {car.keys == 1 ? <FaCheck className="w-6 h-6 text-green-500" /> : <FaTimes className="w-6 h-6 text-red-500" />}
                            </th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Keys</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="flex justify-end px-3 py-3 ">
                            {car.title == 1 ? <FaCheck className="w-6 h-6 text-green-500" /> : <FaTimes className="w-6 h-6 text-red-500" />}
                            </th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Title</td>
                        </tr>

                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">
                            {car.carfax_report_url ? (
                                <a href={car.carfax_report_url} className="text-blue-500 hover:underline">
                                View Carfax Report
                                </a>
                            ) : (
                                <p>لا يوجد</p>
                            )}
                            </th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Carfax Report</td>
                        </tr>


                        <tr className="bg-White dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.created_at}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">تاريخ الانشاء</td>
                        </tr>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.created_by}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">انشئ بوسطة</td>
                        </tr>
                            <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.updated_at}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">تاريخ التحديث</td>
                        </tr>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.updated_by}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">تحديث بواسطه</td>
                        </tr>


                        </tbody>
                    </table>
                    </TabsContent>

                    {/* Shipping Tab */}
                    <TabsContent value="shipping">
                    <table className="w-full text-sm text-left text-gray-500 ltr:text-left dark:text-gray-100">
                        <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.ship_status}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Status</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.lot}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Lot/Sotok</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.bookingNo}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Booking No</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.container_number}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Container Number</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.vendor_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Vendor</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.destination_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Destination</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 text-blue-600"><a href={car.line_website}>{car.line_name}</a></th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Shipping Line</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.facility_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Facility</td>
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.terminal_name}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Terminal</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.date_won}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Date Won</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.estimate_arrival_date}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Estimated Arrival Date</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.arrival_date}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Arrival Date</td>
                                              </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="px-3 py-3 ">{car.won_price}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Won Price</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-3 py-3 ">{car.shipping_cost}</th>
                            <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Shipping Cost</td>
                        </tr>

                        </tbody>
                    </table>
                    </TabsContent>


                    <TabsContent value="shipping_fees">

                    <div className="w-[98%] mx-auto">
                    {car.shipping_expenses.length === 0 ? (
                        <div className="m-10 text-center text-gray-500 dark:text-gray-400">
                        لم يتم اختيار اي تكاليف شحن
                        </div>
                    ) : (
                        // Calculate the total shipping cost separately
                        <>
                        {/* Calculate the total amount separately */}
                        {(() => {
                            const totalShippingCost = car.shipping_expenses.reduce((total, fee) => total + parseFloat(fee.amount), 0);

                            return (
                            <table className="w-full text-gray-700 border-collapse dark:text-gray-100">
                                <thead>
                                <tr className="bg-gray-200 dark:bg-gray-600">
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base">التكلفة</th>
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base">القيمة</th>
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base">التاريخ</th>
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base"> الإنشاء بواسطة</th>
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base">تاريخ التحديث</th>
                                    <th className="p-2 text-xs text-right border dark:border-gray-700 text-nowrap md:text-base"> التحديث بواسطة</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Render each expense row */}
                                {car.shipping_expenses.map((fee, index) => (
                                    <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                    } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                                    >
                                    <td className="p-2 text-xs border text-nowrap md:text-base dark:border-gray-700">{fee.name}</td>
                                    <td className="p-2 border dark:border-gray-700">{parseFloat(fee.amount).toFixed(2)}</td>
                                    <td className="p-2 text-xs border text-nowrap md:text-base dark:border-gray-700">{fee.created_at}</td>
                                    <td className="p-2 text-xs border text-nowrap md:text-base dark:border-gray-700">
                                        {fee.created_by_name || ""}
                                    </td>
                                    <td className="p-2 text-xs border text-nowrap md:text-base dark:border-gray-700">{fee.updated_at || ""}</td>
                                    <td className="p-2 text-xs border text-nowrap md:text-base dark:border-gray-700">
                                        {fee.updated_by_name || ""}
                                    </td>
                                    </tr>
                                ))}
                                {/* Total row */}
                                <tr className="font-bold bg-gray-200 dark:bg-gray-600">
                                    <td className="p-2 border dark:border-gray-700" colSpan="1">
                                    مجموع التكاليف
                                    </td>
                                    <td className="p-2 border dark:border-gray-700" colSpan="5">
                                    {totalShippingCost.toFixed(2)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            );
                        })()}
                        </>
                    )}
                    </div>


                    </TabsContent>



                {/* Photos Tab */}
                <TabsContent value="photos">
                    {/* Images below the table */}
                    <div>
                    <div className="flex flex-col my-6">
                        {car.imagesForShow.map((dateGroup, groupIndex) => (
                        <div key={groupIndex} className="my-8">
                            <h3 className="px-6 py-3 mb-4 text-xl font-bold text-right text-black bg-blue-100 rounded-lg">
                            {dateGroup.date}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                            {dateGroup.images.map((image, imageIndex) => (
                                <div
                                key={imageIndex}
                                className="w-32 h-32 cursor-pointer md:w-64 md:h-64"
                                onClick={() => openModal(image.image_url)}
                                >
                                <img
                                    className="object-cover w-full h-full rounded-lg"
                                    src={image.image_url}
                                    alt={`Car Image ${groupIndex + 1}-${imageIndex + 1}`}
                                />
                                <div className="mt-2 text-sm">
                                    <p>اضافة بواسطة: {image.created_by}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>


                    </div>
                </TabsContent>



                </Tabs>
                </div>
            </div>
            </div>
        </div>
        </div>
      {/* Modal with Slider */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 "
          onClick={closeModal}
        >
          <div className="relative  max-w-[90%]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute text-3xl text-white top-2 right-2"
              onClick={closeModal}
            >
              &times;
            </button>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 transform -translate-y-1/2 top-1/2"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-4 h-4 dark:text-white" />
            </Button>
            <img
              className=" max-h-[90%]"
              src={flattenedImages[selectedImageIndex]?.image_url}
              alt="Selected Car"
            />


            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 transform -translate-y-1/2 top-1/2"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-4 h-4 dark:text-white" />
            </Button>
          </div>
        </div>
      )}


      </AuthenticatedLayout>

  );

}
