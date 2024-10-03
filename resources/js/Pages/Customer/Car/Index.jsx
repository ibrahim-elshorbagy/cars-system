import React from "react";
import { Head,Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";

export default function Index({ auth,site_settings, cars, queryParams = null, success }) {
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
            السيارات
          </h2>

        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"السيارات"} />

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      {/* <th className="p-3">ID</th> */}
                      <th className="p-3 text-xs text-nowrap md:text-base">VIN</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">Make</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">Model</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">Year</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">تكلفة الشحن</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">سعر الشراء</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">Status</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الإجراءات</th>
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
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
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
                            <td className="p-3 text-xs text-nowrap md:text-base">
                                    <div className="flex flex-col items-start">
                                        {/* VIN Name */}
                                        <span className="text-lg ">{car.chassis}</span>

                                        {/* Car Details */}
                                        <div className="text-sm lg:text-base">
                                        <span className="mr-1">{car.make_name}</span>
                                        <span className="mr-1">{car.model_name}</span>
                                        <span>{car.year}</span>
                                        </div>
                                    </div>
                              </td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.make_name}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.model_name}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.year}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.shipping_cost}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.won_price}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{car.ship_status}</td>

                          <td className="p-3 text-xs text-nowrap md:text-base">
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

