import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import  { useState } from "react";
import { Head,Link } from "@inertiajs/react";
import Input from "@/Components/ui/input";

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
    <AuthenticatedLayout user={auth.user} site_settings={site_settings}>
      <Head title={site_settings.websiteName + " - " + "Car Details"} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Car Details</h2>
                                              <Link
                    href={route("car.index")}
                    className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                >
                الرجوع
                </Link>
             </div>
              <div className="mt-6">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-100">
                  <tbody>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Chassis</th>
                      <td className="px-3 py-3">{car.chassis}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Customer Name</th>
                      <td className="px-3 py-3">{car.customer_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Keys</th>
                            <td className="px-3 py-3">{car.keys}
                                <Input
                                type="checkbox"
                                disabled
                                checked={car.keys == 1}
                                id="keys"
                                className="w-6 h-6 rounded mt-0.5"
                                />
                            </td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Title</th>
                            <td className="px-3 py-3">
                            <Input
                                type="checkbox"
                                disabled
                                checked={car.title == 1}
                                id="keys"
                                className="w-6 h-6 rounded mt-0.5"
                                />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Make</th>
                      <td className="px-3 py-3">{car.make_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">lot/Sotok</th>
                      <td className="px-3 py-3">{car.lot}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">bookingNo</th>
                      <td className="px-3 py-3">{car.bookingNo}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">color</th>
                      <td className="px-3 py-3">{car.color}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">year</th>
                      <td className="px-3 py-3">{car.year}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Model</th>
                      <td className="px-3 py-3">{car.model_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Vendor</th>
                      <td className="px-3 py-3">{car.vendor_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Facility</th>
                      <td className="px-3 py-3">{car.facility_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Shipping Line</th>
                      <td className="px-3 py-3">{car.line_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Terminal</th>
                      <td className="px-3 py-3">{car.terminal_name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Status</th>
                      <td className="px-3 py-3">{car.ship_status}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Won Price</th>
                      <td className="px-3 py-3">{car.won_price}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Shipping Cost</th>
                      <td className="px-3 py-3">{car.shipping_cost}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Date Won</th>
                      <td className="px-3 py-3">{car.date_won}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Estimated Arrival Date</th>
                      <td className="px-3 py-3">{car.estimate_arrival_date}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Arrival Date</th>
                      <td className="px-3 py-3">{car.arrival_date}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-3 py-3 ">Carfax Report</th>
                      <td className="px-3 py-3"> {car.carfax_report_url ? (
                                <a
                                    href={car.carfax_report_url}
                                    className="text-blue-500 hover:underline"
                                >
                                    View Carfax Report
                                </a>
                            ) : (
                                <p> لا يوجد</p>
                    )}
                    </td>
                    </tr>
                  </tbody>
                </table>

                {/* Images below the table */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Car Images</h3>
                  <div className="flex flex-wrap gap-4">
                        {car.images.map((image, index) => (
                        <div
                            key={index}
                            className="w-32 h-32 cursor-pointer"
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
