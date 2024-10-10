import React, { useState, useEffect } from "react";
import { Head, router, useForm,Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import SelectInput from "@/Components/SelectInput";

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
import { Textarea } from "@headlessui/react";
import { toast } from 'sonner';

export default function Index({ auth,site_settings, records, customer,boxes, success,danger }) {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReverseModalOpen, setIsReverseModalOpen] = useState(false);



// ---------------------------------------------------------------------------- Reverse



    const toggleReverseModal = () => {
        setIsReverseModalOpen(!isReverseModalOpen);
        if (!isReverseModalOpen) {
        ReverseReset();
        }
    };

    const {
        data: ReverseData,
        setData: setReverseData,
        post: ReversePost,
        errors: ReverseErrors,
        reset: ReverseReset,
    } = useForm({
        'user_id': customer.id,
    });

    const handleReverseRecord = (e) => {
        e.preventDefault();
        ReversePost(route("reverse-customer-credit.store"), {
        onSuccess: () => {
            ReverseReset();
                toggleReverseModal();

        },
        });
    };

// ---------------------------------------------------------------------------- Creation
    const toggleCreateModal = () => {

    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
      createReset();
    }
  };

  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    errors: createErrors,
    reset: createReset,
  } = useForm({
        'user_id': customer.id,

  });

  const handleCreateRecord = (e) => {
    e.preventDefault();
    createPost(route("customer-credit.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();
      },
    });
  };


// ----------------------------------------------------------------------------

  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
          success={success} danger={danger}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-tight md:text-xl dark:text-gray-200">
            ارصده العملاء
              </h2>
              <div className="flex gap-3">
                {auth.user.permissions.includes("create-customer-credit") && (
                    <button
                    onClick={toggleCreateModal}
                    className="p-1.5 text-sm text-white transition-all rounded shadow md:text-lg md:py-1 md:px-3 bg-burntOrange hover:bg-burntOrangeHover"
                    >
                    إضافة رصيد
                    </button>
                    )}
                    {auth.user.permissions.includes("reverse-customer-credit") && (
                    <button
                    onClick={toggleReverseModal}
                    className="text-sm p-1.5 text-white transition-all rounded shadow md:text-lg md:py-1 md:px-3 bg-burntOrange hover:bg-burntOrangeHover"
                    >
                    رصيد عكسي
                    </button>
                        )}
            </div>
        </div>
      }
    >
          <Head title={site_settings.websiteName + " - " + "ارصده العملاء"} />

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3 text-xs text-nowrap md:text-base">ID</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">التاريخ</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المضافة للرصيد</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المدفوعة من الرصيد</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الرصيد</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الوصف</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الصندوق</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">اضافة بواسطة</th>

                      <th className="p-3 text-xs text-nowrap md:text-base">اجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records && records.data.length > 0 ? (
                      records.data.map((record,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={record.id}
                        >
                          <td className="px-3 py-2">{record.id}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.created_at}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.added_credit}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.used_credit}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.balance}</td>
                          <td className="px-3 py-2 text-xs md:text-base min-w-44 max-w-44">{record.description}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.box_name}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.created_by}</td>

                            <td className="px-3 py-2 text-xs text-nowrap md:text-base">
                                <Link
                                href={route("customer-credit.show", record.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            مشاهدة
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center">
                          لا يوجد ارصده
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {records && <Pagination links={records.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new record */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg md:w-10/12 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة رصيد</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateRecord}>

                        <div className="grid grid-cols-1 gap-4 mb-3 md:m-0 md:grid-cols-2">
                            <div className="mb-4">
                                <InputLabel htmlFor="added_credit" value={"القيمة"} />
                                <TextInput
                                id="added_credit"
                                type="number"
                                name="name"
                                value={createData.added_credit || ""}
                                className="block w-full mt-1"
                                onChange={(e) => setCreateData("added_credit", e.target.value)}
                                />
                                <InputError message={createErrors.added_credit} className="mt-2" />
                                </div>
                                {!auth.user.roles.includes("Accountant") && boxes && boxes.length > 0 && (
                                <div>
                                    <InputLabel className="mb-1.5" htmlFor="box_id" value={"الصندوق"} />
                                    <ComboboxMakes
                                    items={boxes}
                                    onItemSelect={(item) => item && setCreateData("box_id", item.id)}
                                    placeholder="اختر الصندوق"
                                    emptyMessage="لا يوجد صناديق"
                                    />
                                    <InputError message={createErrors.box_id} className="mt-2" />
                                </div>
                                )}
                        </div>

                <div className="flex justify-end gap-2">
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


                {/* Modal for Reveerse */}
      {isReverseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg md:w-10/12 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">رصيد عكسي</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleReverseRecord}>

                        <div className="grid grid-cols-1 gap-4 mb-3 md:m-0 md:grid-cols-2">
                            <div className="mb-4">
                                <InputLabel htmlFor="used_credit" value={"القيمة"} />
                                <TextInput
                                id="used_credit"
                                type="number"
                                name="name"
                                value={ReverseData.used_credit || ""}
                                className="block w-full mt-1"
                                onChange={(e) => setReverseData("used_credit", e.target.value)}
                                />
                                <InputError message={ReverseErrors.used_credit} className="mt-2" />
                                  </div>
                                                                  {!auth.user.roles.includes("Accountant") && boxes && boxes.length > 0 && (
                                <div>
                                    <InputLabel className="mb-1.5" htmlFor="box_id" value={"الصندوق"} />
                                    <ComboboxMakes
                                    items={boxes}
                                    onItemSelect={(item) => item && setReverseData("box_id", item.id)}
                                    placeholder="اختر الصندوق"
                                    emptyMessage="لا يوجد صناديق"
                                    />
                                    <InputError message={ReverseErrors.box_id} className="mt-2" />
                                </div>
                                )}
                            <div className="col-span-2 mb-4">
                                <InputLabel htmlFor="description" value={"بيان"} />
                                <Textarea
                                id="description"
                                type="number"
                                name="name"
                                value={ReverseData.description || ""}
                                className="block w-full h-32 mt-1"
                                onChange={(e) => setReverseData("description", e.target.value)}
                                />
                                <InputError message={ReverseErrors.description} className="mt-2" />
                            </div>

                              </div>
                                <ul className="mt-2 text-red-600 list-disc list-inside">
                                    {Object.keys(ReverseErrors).map((key) => (
                                        <li key={key}>{ReverseErrors[key]}</li>
                                    ))}
                                </ul>


                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={toggleReverseModal}
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

    </AuthenticatedLayout>
  );
}

// Combobox for selecting makes
function ComboboxMakes({ items, onItemSelect, placeholder, selectedMakeId, emptyMessage }) {
  const [open, setOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState(selectedMakeId ? items.find((item) => item.id === selectedMakeId) : null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedMake ? selectedMake.name : placeholder}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="ابحث عن ماركة..." />
          <CommandList>
            {items && items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items && items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      setSelectedMake(item);
                      onItemSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedMake?.id === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {item.name}
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
