import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";
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
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";

export default function Index({ auth, cities,ports,site_settings ,queryParams = null }) {
  queryParams = queryParams || {};

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
    const toggleEditModal = (city = null) => {
        if (city) {
            setEditingCity(city);

        setEditData({
            name: city.name,
            code: city.code,
            port_id: city.port_id,

            _method: "PUT",
        });
        } else {
        setEditingCity(null);
        editReset();
        }
        setIsEditModalOpen(!isEditModalOpen);
    };

  // Search functionality
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("city.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };




  const deleteCity = (city) => {
    if (!window.confirm("هل انت متأكد من حذف المدينة ؟ ")) {
      return;
    }
    router.delete(route("city.destroy", city.id), {
      onSuccess: (page) => {



      },
    });
  };

  // Form handling for create and edit
  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    errors: createErrors,
    reset: createReset,
  } = useForm({
    name: "",
  });

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    errors: editErrors,
    reset: editReset,
  } = useForm({
    name: "",
    _method: "PUT",
  });

  // Handle Create
  const handleCreateCity = (e) => {
    e.preventDefault();
      createPost(route("city.store"), {
        onSuccess: () => {
        createReset();
        toggleCreateModal();



      },
    });
  };

  // Handle Edit
  const handleEditCity = (e) => {
    e.preventDefault();
      editPost(route("city.update", editingCity.id), {
        onSuccess: () => {
        editReset();
        toggleEditModal();

      },
    });
  };



  return (
      <AuthenticatedLayout
          site_settings={site_settings}

      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            المدن (Cities)
          </h2>
          {auth.user.permissions.includes("create-city") && (
            <button
              onClick={toggleCreateModal}
              className="p-3 text-sm text-white transition-all rounded shadow md:text-base text-nowrap bg-burntOrange "
            >
              إضافة مدينة
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"المدن (Cities)"} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                    <td>Id</td>
                      <th className="w-32 p-3">كود </th>
                      <td className="p-3 w-96">المدينة</td>
                      <th className="w-64 p-3">الميناء</th>
                      <th className="p-3 text-center">االاجراءات</th>


                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>


                        <th className="p-3"></th>
                        <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"الاسم"}
                          isFocused
                          onChange={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                                          </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities && cities.data.length > 0 ? (
                      cities.data.map((city,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={city.id}
                          >
                              <td className="p-3">{city.id}</td>
                          <th className="p-3 text-xs text-nowrap w-fit md:text-base">{city.code}</th>

                          <th className="p-3 text-xs text-nowrap w-fit md:text-base">{city.name}</th>
                          <th className="p-3 text-xs text-nowrap w-fit md:text-base">{city.port_name}</th>

                              <td className="p-3 text-center text-nowrap">
                            {auth.user.permissions.includes("update-city") && (
                              <button
                                 onClick={() => toggleEditModal(city)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-city") && (
                              <button
                                onClick={() => deleteCity(city)}
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
                        <td colSpan="5" className="p-3 text-center">
                          لا يوجد مدن (Cities)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {cities && <Pagination links={cities.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new city */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">اضافة مدينة جديدة</h2>
            </div>
            <div className="p-6">
                          <form onSubmit={handleCreateCity}>
                <div className="mb-4">
                        <InputLabel className="mb-1" htmlFor="port_id " value={"الميناء (الولاية)"} />
                        <ComboboxMakes
                            items={ports.data}
                            onItemSelect={(item) => setCreateData("port_id", item.id)}
                            placeholder="اختر الميناء"
                            emptyMessage="لا توجد موانئ"
                        />
                        <InputError message={createErrors.port_id} className="mt-2" />
                </div>
                <div className="mb-4">
                  <InputLabel htmlFor="city_name" value={"اسم المدينة "} />
                  <TextInput
                    id="city_name"
                    type="text"
                    name="name"
                    value={createData.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setCreateData("name", e.target.value)}
                    />
                    <InputError message={createErrors.name} className="mt-2" />
                              </div>
                 <div className="mb-4">
                  <InputLabel htmlFor="code" value={"كود المدينة "} />
                  <TextInput
                    id="code"
                    type="text"
                    name="name"
                    value={createData.code}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setCreateData("code", e.target.value)}
                    />
                    <InputError message={createErrors.code} className="mt-2" />
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
                    className="px-4 py-2 text-white rounded bg-burntOrange "
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing a city */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل المدينة</h2>
            </div>
            <div className="p-6">
            <form onSubmit={handleEditCity}>
                <div className="mb-4">
                    <InputLabel className="mb-1" htmlFor="edit_port_id" value={"الميناء (الولاية)"} />
                    <ComboboxMakes
                      items={ports.data}
                      selectedMakeId={editData.port_id}
                      onItemSelect={(item) => setEditData("port_id", item.id)}
                      placeholder="اختر الميناء"
                      emptyMessage="لا توجد موانئ"

                    />
                          <InputError message={editErrors.port_id} className="mt-2" />
                </div>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_city_name" value={"اسم المدينة"} />
                  <TextInput
                    id="edit_city_name"
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
                  <InputLabel htmlFor="edit_code" value={"اسم المدينة"} />
                  <TextInput
                    id="edit_code"
                    type="text"
                    name="code"
                    value={editData.code}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setEditData("code", e.target.value)}
                  />
                  <InputError message={editErrors.code} className="mt-2" />
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
                    className="px-4 py-2 text-white rounded bg-burntOrange "
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


function ComboboxMakes({ items, onItemSelect, placeholder, selectedMakeId, emptyMessage }) {
  const [open, setOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState(null);

  useEffect(() => {
    if (selectedMakeId) {
      const make = items.find((item) => String(item.id) === String(selectedMakeId));
      setSelectedMake(make || null);
    }
  }, [selectedMakeId, items]);

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
          <CommandInput placeholder="" />
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
