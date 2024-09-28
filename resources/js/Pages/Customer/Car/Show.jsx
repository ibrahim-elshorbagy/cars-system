import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import  { useState } from "react";
import { Head,Link } from "@inertiajs/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs"
import { GrDocumentPdf } from "react-icons/gr";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Show({ auth, site_settings, car }) {

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);

 const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
      <AuthenticatedLayout user={auth.user} site_settings={site_settings}
       header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            معلومات السيارة
               </h2>
            <Link
                href={route("customer-my-cars.index")}
              className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-400 "
            >
              الرجوع
            </Link>
        </div>
      }
      >
      <Head title={site_settings.websiteName + " - " + "معلومات السيارة"} />

    <div>
    <div className="mx-auto">
        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="mt-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="flex flex-row sm:inline-flex">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
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
                        <th className="px-3 py-3 ">{car.make_name}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Make</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th className="px-3 py-3 ">{car.color}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Color</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-3 py-3 ">{car.year}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Year</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th className="px-3 py-3 ">{car.model_name}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Model</td>
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
                    </tbody>
                </table>
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping">
                <table className="w-full text-sm text-left text-gray-500 ltr:text-left dark:text-gray-100">
                    <tbody>
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
                        <th className="px-3 py-3 ">{car.facility_name}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Facility</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th className="px-3 py-3 ">{car.line_name}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Shipping Line</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-3 py-3 ">{car.terminal_name}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Terminal</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th className="px-3 py-3 ">{car.ship_status}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Status</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-3 py-3 ">{car.won_price}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Won Price</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th className="px-3 py-3 ">{car.shipping_cost}</th>
                        <td className="w-20 px-3 py-3 text-left whitespace-nowrap">Shipping Cost</td>
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
                    </tbody>
                </table>
                </TabsContent>

                {/* Photos Tab */}
                <TabsContent value="photos">
                    {/* Images below the table */}
                    <div className="mt-6">
                        <div className="flex flex-wrap gap-4">
                            {car.images.map((image, index) => (
                            <div
                                key={index}
                                className="w-64 h-64 cursor-pointer"
                                onClick={() => openModal(image)}
                            >
                                <img
                                className="object-cover w-full h-full rounded-lg"
                                src={image}
                                alt={`Car Image ${index + 1}`}
                                />
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





        {isModalOpen && (
                <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={closeModal}
                >
                <div className="relative">
                    <button
                    className="absolute text-3xl text-white top-2 right-2"
                    onClick={closeModal}
                    >
                    &times;
                    </button>
                    <img
                    className="max-w-[90%] max-h-[90%]"
                    src={selectedImage}
                    alt="Selected Car"
                    />
                </div>
                </div>
          )}

      </AuthenticatedLayout>

  );

}
