import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [visibleSuccess, setVisibleSuccess] = useState(success);
  const [operationPerformed, setOperationPerformed] = useState(false);

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

      const [visibleDanger, setVisibleDanger] = useState(danger);

  useEffect(() => {
    if (success && operationPerformed) {
      setVisibleSuccess(success);
      const timer = setTimeout(() => {
        setVisibleSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (danger) {
      setVisibleDanger(danger);
      const timer = setTimeout(() => {
        setVisibleDanger(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger]);
  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    errors: createErrors,
    reset: createReset,
  } = useForm({

  });

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    errors: editErrors,
    reset: editReset,
  } = useForm({

    _method: "PUT",
  });

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
      createReset();
    }
  };

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

  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            ارصده العملاء
          </h2>
          {auth.user.permissions.includes("create-customer-credit") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة رصيد
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"ارصده العملاء"} />
      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
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
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">اسم العميل</th>
                      <th className="px-3 py-3">القيمة المضافه</th>
                      <th className="px-3 py-3">القيمة المستخدمه</th>
                      <th>الرصيد</th>
                      <th className="px-3 py-3">الوصف</th>
                      <th className="px-3 py-3">الصندوق</th>
                      <th className="px-3 py-3">اضافه بواسطه</th>
                      <th className="px-3 py-3">تحديث بواسطه</th>

                      <th className="px-3 py-3">الاجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"الاسم"}
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records && records.data.length > 0 ? (
                      records.data.map((record) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={record.id}
                        >
                          <td className="px-3 py-2">{record.id}</td>
                          <td className="px-3 py-2 text-nowrap">{record.customer_name}</td>
                          <td className="px-3 py-2 text-nowrap">{record.added_credit}</td>
                          <td className="px-3 py-2 text-nowrap">{record.used_credit}</td>
                          <td className="px-3 py-2 text-nowrap">{record.balance}</td>
                          <td className="px-3 py-2 text-nowrap">{record.description}</td>
                          <td className="px-3 py-2 text-nowrap">{record.box_name}</td>
                          <td className="px-3 py-2 text-nowrap">{record.created_by}</td>
                          <td className="px-3 py-2 text-nowrap">{record.updated_by}</td>
                          <td className="px-3 py-2 text-nowrap">
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center">
                          لا يوجد موديلات
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
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة رصيد</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateRecord}>

                        <div className="grid grid-cols-3 gap-4">
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

      {/* Modal for editing a record */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
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
