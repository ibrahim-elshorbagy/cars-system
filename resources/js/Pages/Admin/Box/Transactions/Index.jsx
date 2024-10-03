import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TbTransfer } from "react-icons/tb";
import { PiBagSimpleDuotone } from "react-icons/pi";
import {CreditCard} from "lucide-react";

export default function Index({ auth, site_settings, boxeslist, box, queryParams = {} }) {
  const [selectedBox, setSelectedBox] = useState(queryParams?.box || "");

  // Ensure queryParams is initialized
  useEffect(() => {
    if (queryParams && queryParams.box) {
      setSelectedBox(queryParams.box);
    } else {
      setSelectedBox("");
    }
  }, [queryParams]);

  const searchFieldChanged = (name, value) => {
    // Initialize queryParams if null
    if (!queryParams) queryParams = {};

    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    // Reset pagination to the first page
    delete queryParams.page;

    // Trigger router to refresh with the updated queryParams
    router.get(route("box.index.transaction"), queryParams, {
      preserveScroll: true, // optionally preserve scroll
    });
  };

  const handleBoxChange = (e) => {
    const selectedBoxId = e.target.value;
    setSelectedBox(selectedBoxId); // Update the selected box state
    searchFieldChanged("box", selectedBoxId); // Update the query parameters
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            موجودات الصندوق
          </h2>
        </div>
      }
    >
      <Head title={`${site_settings.websiteName} - موجودات الصندوق`} />

      <div className="">
        <div className="mx-auto bg-white shadow-sm dark:bg-gray-800">


          {/* Display selected box and its transactions */}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900">

                <div className="my-10 overflow-hidden bg-white shadow-md dark:bg-gray-800">
                    {/* Show box selection only for non-Accountant users */}
                        {!auth.user.roles.includes("Accountant") && (
                            <div className="grid p-6 md:grid-cols-4">
                            <div>
                                <InputLabel htmlFor="box_name" value={"اسم الصندوق"} />
                                <SelectInput
                                name="box"
                                id="box"
                                value={selectedBox}
                                onChange={handleBoxChange}
                                className="block w-full mt-1"
                                >
                                {/* Option to select all boxes */}
                                {boxeslist.map((boxItem) => (
                                    <option value={boxItem.id} key={boxItem.id}>
                                    {boxItem.name}
                                    </option>
                                ))}
                                </SelectInput>
                            </div>
                            </div>
                        )}
                    <div className="p-4 text-lg font-bold text-gray-900 dark:text-white">
                            {box.data.name}
                    </div>

                    <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:p-4">

                    <Card className="w-full">
                        <CardContent className="flex items-center justify-between p-3 bg-green-100 md:p-6 dark:bg-green-800">
                        <div className="flex flex-col items-start">
                            <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                            مجموع الداخل
                            </p>
                            <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                                {Number(box.data.total_income).toFixed(2) }
                                                  
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
                            مجموع الخارج
                            </p>
                            <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                {Number(box.data.total_outcome).toFixed(2) }
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                            <TbTransfer className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                        </div>
                        </CardContent>
                    </Card>



                    <Card className="w-full">
                        <CardContent className="flex items-center justify-between p-3 bg-purple-100 md:p-6 dark:bg-purple-800">
                        <div className="flex flex-col items-start">
                            <p className="text-xs font-medium text-gray-500 md:text-md dark:text-gray-400">
                            موجودات الصندوق
                            </p>
                            <p className="text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
                                {Number(box.data.total_balance).toFixed(2) }
 
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-12 md:h-12 dark:bg-gray-800">
                            <PiBagSimpleDuotone className="w-4 h-4 text-gray-800 md:w-6 md:h-6 dark:text-white" />
                        </div>
                        </CardContent>
                    </Card>


                    </div>

                </div>

                          {/* Render transactions */}
            <div className="overflow-auto">
              <table className="w-full text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="p-3 text-xs text-nowrap md:text-base">الداخل</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">الخارج</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">الرصيد</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">الوصف</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">تم بواسطه</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">تاريخ الانشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {box.data.transactions.data.length > 0 ? (
                    box.data.transactions.data.map((transaction,index) => (
                      <tr                             className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                             key={transaction.id}>
                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.income}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.outcome}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.balance}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.description}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base" >{transaction.created_by}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base" >{transaction.created_at}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        لا توجد معاملات
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
              {/* Pagination */}
              {box.data.transactions.links && (
                <Pagination links={box.data.transactions.links} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
