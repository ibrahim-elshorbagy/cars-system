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

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {/* Show box selection only for non-Accountant users */}
          {!auth.user.roles.includes("Accountant") && (
            <div className="grid grid-cols-4 m-6">
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
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between p-4 mb-2 bg-blue-100">
                <div>
                  <h3 className="text-lg font-semibold">{box.data.name}</h3>
                  <p className="text-blue-500">
                    مجموع الداخل : {box.data.total_income}, مجموع الخارج : {box.data.total_outcome}, موجودات الصندوق : {box.data.total_balance}
                  </p>
                </div>
              </div>

              {/* Render transactions */}
              <table className="w-full text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th>التاريخ</th>
                    <th>الداخل</th>
                    <th>الخارج</th>
                    <th>الرصيد</th>
                    <th>الوصف</th>
                    <th>تم بواسطه</th>
                    <th>تحديث بواسطه</th>
                  </tr>
                </thead>
                <tbody>
                  {box.data.transactions.data.length > 0 ? (
                    box.data.transactions.data.map((transaction) => (
                      <tr className="border-b" key={transaction.id}>
                        <td className="px-3 py-2 text-nowrap">{transaction.created_at}</td>
                        <td className="px-3 py-2">{transaction.income}</td>
                        <td className="px-3 py-2">{transaction.outcome}</td>
                        <td className="px-3 py-2">{transaction.balance}</td>
                        <td className="px-3 py-2">{transaction.description}</td>
                        <td className="px-3 py-2">{transaction.created_by}</td>
                        <td className="px-3 py-2">{transaction.updated_by}</td>
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
