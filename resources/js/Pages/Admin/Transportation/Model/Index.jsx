import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
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

export default function Index({ auth,site_settings, models, makes, queryParams = null, success }) {
  queryParams = queryParams || {};

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
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

  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    errors: createErrors,
    reset: createReset,
  } = useForm({
    name: "",
    make_id: "",
  });

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    errors: editErrors,
    reset: editReset,
  } = useForm({
    name: "",
    make_id: "",
    _method: "PUT",
  });

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
      createReset();
    }
  };

  const toggleEditModal = (model = null) => {
    if (model) {
      setEditingModel(model);
      setEditData({
        name: model.name,
        make_id: model.make_id,
        _method: "PUT",
      });
    } else {
      setEditingModel(null);
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

    router.get(route("model.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key === "Enter") {
      searchFieldChanged(name, e.target.value);
    }
  };

  const deleteModel = (model) => {
    if (window.confirm("هل انت متأكد من حذف الموديل ؟ ")) {
      router.delete(route("model.destroy", model.id), {
        onSuccess: (page) => {
              setVisibleSuccess(page.props.success);
        setOperationPerformed(true);
              
        },
      });
    }
  };

  const handleCreateModel = (e) => {
    e.preventDefault();
    createPost(route("model.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };

  const handleEditModel = (e) => {
    e.preventDefault();
    editPost(route("model.update", editingModel.id), {
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
            الموديل (Models)
          </h2>
          {auth.user.permissions.includes("create-model") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة موديل
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"الموديلات"} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">الرقم</th>
                      <th className="px-3 py-3">الاسم</th>
                      <th className="px-3 py-3">الماركة</th>
                      <th className="px-3 py-3">الإجراءات</th>
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
                    </tr>
                  </thead>
                  <tbody>
                    {models && models.data.length > 0 ? (
                      models.data.map((model) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={model.id}
                        >
                          <td className="px-3 py-2">{model.id}</td>
                          <td className="px-3 py-2 text-nowrap">{model.name}</td>
                          <td className="px-3 py-2 text-nowrap">{model.make_name}</td>
                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-model") && (
                              <button
                                onClick={() => toggleEditModal(model)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-model") && (
                              <button
                                onClick={() => deleteModel(model)}
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
              {models && <Pagination links={models.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new model */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة موديل</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateModel}>
                <div className="mb-4">
                  <InputLabel htmlFor="model_name" value={"اسم الموديل"} />
                  <TextInput
                    id="model_name"
                    type="text"
                    name="name"
                    value={createData.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setCreateData("name", e.target.value)}
                  />
                  <InputError message={createErrors.name} className="mt-2" />
                </div>
                        <div className="grid grid-cols-4 mb-4">
                            <div>
                                <InputLabel htmlFor="make_id" value={"الماركة"} />
                                <ComboboxMakes
                                    items={makes.data}
                                    onItemSelect={(item) => setCreateData("make_id", item.id)}
                                    placeholder="اختر الماركة"
                                    emptyMessage="لا توجد ماركات"
                                />
                                <InputError message={createErrors.make_id} className="mt-2" />
                            </div>
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

      {/* Modal for editing a model */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل الموديل</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditModel}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_model_name" value={"اسم الموديل"} />
                  <TextInput
                    id="edit_model_name"
                    type="text"
                    name="name"
                    value={editData.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setEditData("name", e.target.value)}
                  />
                  <InputError message={editErrors.name} className="mt-2" />
                </div>
                        <div className="mb-4">
                            <div className="grid grid-cols-4 mb-4">
                                <div>
                                    <InputLabel htmlFor="edit_make_id" value={"الماركة"} />
                                    <ComboboxMakes
                                        items={makes.data}
                                        selectedMakeId={editData.make_id}
                                        onItemSelect={(item) => setEditData("make_id", item.id)}
                                    />
                                          <InputError message={editErrors.make_id} className="mt-2" />
                                </div>
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
