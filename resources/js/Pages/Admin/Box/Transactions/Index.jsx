import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import { useState, useEffect } from "react";

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

          {/* Display selected box and its transactions */}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between p-4 mb-2 bg-blue-100">
                <div>
                  <h3 className="text-base font-semibold md:text-lg">{box.data.name}</h3>
                    <p className="text-sm text-blue-500 md:text-lg">
                    <span className="block mb-1 md:inline md:mb-0"> مجموع الداخل : {box.data.total_income} , </span>
                    <span className="block mb-1 md:inline md:mb-0"> مجموع الخارج : {box.data.total_outcome} , </span>
                    <span className="block md:inline"> موجودات الصندوق : {box.data.total_balance} </span>
                    </p>
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
                    <th className="p-3 text-xs text-nowrap md:text-base">تحديث بواسطة</th>
                    <th className="p-3 text-xs text-nowrap md:text-base">تاريخ التحديث</th>
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

                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.updated_by}</td>
                        <td className="p-3 text-xs text-nowrap md:text-base">{transaction.updated_at}</td>
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
