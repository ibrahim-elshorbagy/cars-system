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

export default function Index({ auth,site_settings, records, customers,boxes, queryParams = null, success,danger }) {
  queryParams = queryParams || {};

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReverseModalOpen, setIsReverseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [visibleSuccess, setVisibleSuccess] = useState(success);
    const [operationPerformed, setOperationPerformed] = useState(false);




// ---------------------------------------------------------------------------- Page + search

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
    if (success && operationPerformed) {
      setVisibleSuccess(success);
      const timer = setTimeout(() => {
        setVisibleSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

    const [visibleDanger, setVisibleDanger] = useState(danger);

  useEffect(() => {
    if (danger) {
      setVisibleDanger(danger);
      const timer = setTimeout(() => {
        setVisibleDanger(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger]);


  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("customer-credit.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key === "Enter") {
      searchFieldChanged(name, e.target.value);
    }
  };

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

  });

  const handleReverseRecord = (e) => {
    e.preventDefault();
    ReversePost(route("reverse-customer-credit.store"), {
      onSuccess: () => {
        ReverseReset();
            toggleReverseModal();
        setOperationPerformed(true);

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

  });

  const handleCreateRecord = (e) => {
    e.preventDefault();
    createPost(route("customer-credit.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };
    // ---------------------------------------------------------------------------- Edit stop won't use it

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    errors: editErrors,
    reset: editReset,
  } = useForm({

    _method: "PUT",
  });


  const toggleEditModal = (record = null) => {
    if (record) {
        setEditingRecord(record);
      setEditData({
        user_id: record.customer_id,
        added_credit: record.added_credit,
        box_id: record.box_id,
        _method: "PUT",
      });
    } else {
      setEditingRecord(null);
      editReset();
    }
    setIsEditModalOpen(!isEditModalOpen);
  };


  const handleEditRecord = (e) => {
    e.preventDefault();
    editPost(route("customer-credit.update", editingRecord.id), {
      onSuccess: () => {
        editReset();
            toggleEditModal();
        setOperationPerformed(true);

      },
    });
  };
// ---------------------------------------------------------------------------- Delete won't use it

  const deleteRecord = (record) => {
    if (window.confirm("هل انت متأكد من حذف رصيد العميل ؟ ")) {
      router.delete(route("customer-credit.destroy", record.id), {
        onSuccess: (page) => {
              setVisibleSuccess(page.props.success);
        setOperationPerformed(true);

        },
      });
    }
  };

// ----------------------------------------------------------------------------

  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
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
      <Head title={site_settings.websiteName + " - " +"ارصده العملاء"} />
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
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3 text-xs text-nowrap md:text-base">ID</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">التاريخ</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الشركة</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المضافه</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة المستخدمه</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الرصيد</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الوصف</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">الصندوق</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">اضافة بواسطة</th>
                      {/* <th className="p-3 text-xs text-nowrap md:text-base">تحديث بواسطة</th> */}
                      {/* <th className="p-3 text-xs text-nowrap md:text-base">وقت التحديث</th> */}
                      <th className="p-3 text-xs text-nowrap md:text-base">اجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3"></th>

                      <th className="p-3 min-w-32 max-w-36">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"اسم الشركة"}
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("name", e)}
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
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.customer_company}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.added_credit}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.used_credit}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.balance}</td>
                          <td className="px-3 py-2 text-xs md:text-base min-w-44 max-w-44">{record.description}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.box_name}</td>
                          <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.created_by}</td>
                          {/* <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.updated_by}</td> */}
                          {/* <td className="px-3 py-2 text-xs text-nowrap md:text-base">{record.updated_at}</td> */}
                            <td className="px-3 py-2 text-xs text-nowrap md:text-base">
                                <Link
                                href={route("customer-credit.show", record.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            مشاهدة
                            </Link>
                          </td>
                          {/* <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-customer-credit") && !record.cant &&(
                              <button
                                onClick={() => toggleEditModal(record)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-customer-credit") &&  !record.cant && (
                              <button
                                onClick={() => deleteRecord(record)}
                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                حذف
                              </button>
                            )}
                          </td> */}
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

                        <div className="grid grid-cols-1 gap-4 mb-3 md:m-0 md:grid-cols-3">
                            <div>
                                <InputLabel className="mb-1.5" htmlFor="user_id" value={"العميل"} />
                                <ComboboxMakes
                                    items={customers}
                                    onItemSelect={(item) => setCreateData("user_id", item.id)}
                                    placeholder="اختر العميل"
                                    emptyMessage="لا يوجد عملاء"
                                    isFocused={true}

                                />
                                <InputError message={createErrors.user_id} className="mt-2" />
                            </div>
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

                        <div className="grid grid-cols-1 gap-4 mb-3 md:m-0 md:grid-cols-3">
                            <div>
                                <InputLabel className="mb-1.5" htmlFor="user_id" value={"العميل"} />
                                <ComboboxMakes
                                    items={customers}
                                    onItemSelect={(item) => setReverseData("user_id", item.id)}
                                    placeholder="اختر العميل"
                                    emptyMessage="لا يوجد عملاء"
                                    isFocused={true}

                                />
                                <InputError message={ReverseErrors.user_id} className="mt-2" />
                            </div>
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
      {/* Modal for editing a record we Won't use it */}
      {/* {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل الرصيد</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditRecord}>

                        <div className="mb-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel className="mb-1.5" htmlFor="edit_user_id" value={"العميل"} />
                                    <ComboboxMakes
                                        items={customers}
                                        selectedMakeId={editData.user_id}
                                        onItemSelect={(item) => setEditData("user_id", item.id)}
                                    />
                                        <InputError message={editErrors.user_id} className="mt-2" />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel htmlFor="added_credit" value={"اسم الموديل"} />
                                        <TextInput
                                            id="added_credit"
                                            type="number"
                                            name="name"
                                            value={editData.added_credit}
                                            className="block w-full mt-1"
                                            isFocused={true}
                                            onChange={(e) => setEditData("added_credit", e.target.value)}
                                        />
                                        <InputError message={editErrors.added_credit} className="mt-2" />
                                      </div>
                                   {!auth.user.roles.includes("Accountant") && (
                                    <div>
                                        <InputLabel className="mb-1.5" htmlFor="box_id" value={"الصندوق"} />
                                        <ComboboxMakes
                                            items={boxes}
                                            onItemSelect={(item) => setEditData("box_id", item.id)}
                                            placeholder="اختر الصندوق"
                                            emptyMessage="لا يوجد صناديق"
                                            selectedMakeId={editData.box_id}

                                        />
                                        <InputError message={createErrors.box_id} className="mt-2" />
                                    </div>
                                    )}
                            </div>
                        </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleEditModal()}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}


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
