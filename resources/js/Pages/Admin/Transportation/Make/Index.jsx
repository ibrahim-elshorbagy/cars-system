import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Index({site_settings, auth, makes, queryParams = null }) {
  queryParams = queryParams || {};

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMake, setEditingMake] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
    const toggleEditModal = (make = null) => {
        if (make) {
            setEditingMake(make);

        setEditData({
            name: make.name,
            _method: "PUT",
        });
        } else {
        setEditingMake(null);
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

    router.get(route("make.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };




  const deleteMake = (make) => {
    if (!window.confirm("هل انت متأكد من حذف الماركه ؟ ")) {
      return;
    }
    router.delete(route("make.destroy", make.id), {
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
    email: "",
    password: "",
  });

  const {
    data: editData,
    setData: setEditData,
    post: editPost,
    errors: editErrors,
    reset: editReset,
  } = useForm({
    name: "",
    email: "",
    password: "",
    _method: "PUT",
  });

  // Handle Create
  const handleCreateMake = (e) => {
    e.preventDefault();
    createPost(route("make.store"), {
      onSuccess: () => {
        createReset();
        toggleCreateModal();


      },
    });
  };

  // Handle Edit
  const handleEditMake = (e) => {
    e.preventDefault();
    editPost(route("make.update", editingMake.id), {
      onSuccess: () => {
        editReset();
        toggleEditModal();


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
            ماركات السيارات Makes
          </h2>
              <div className="flex gap-4">
                    {auth.user.permissions.includes("create-make") && (
                        <button
                        onClick={toggleCreateModal}
                        className="px-3 py-2 text-sm text-white transition-all rounded shadow md:text-base text-nowrap bg-burntOrange "
                        >
                        اضافة ماركة
                        </button>
                        )}
                        {auth.user.permissions.includes("create-model") && (
                        <Link
                        href={route("model.index")}
                        className="px-3 py-2 text-sm text-white transition-all rounded shadow md:text-base text-nowrap bg-emerald-400"
                        >
                        موديلات السيارات
                        </Link>
                    )}
                </div>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"ماركات السيارات Makes"} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <td>Id</td>
                      <td>الاسم</td>

                      <th className="p-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"الاسم"}
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                                          </th>

                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {makes && makes.data.length > 0 ? (
                      makes.data.map((make,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={make.id}
                        >
                          <td className="px-3 py-2">{make.id}</td>
                          <th className="px-3 py-2 text-nowrap">{make.name}</th>

                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-make") && (
                              <button
                                 onClick={() => toggleEditModal(make)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-make") && (
                              <button
                                onClick={() => deleteMake(make)}
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
                        <td colSpan="5" className="px-3 py-2 text-center">
                          لا يوجد مركات (Makes)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {makes && <Pagination links={makes.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new make */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة ماركة</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateMake}>
                <div className="mb-4">
                  <InputLabel htmlFor="make_name" value={"اسم الماركة"} />
                  <TextInput
                    id="make_name"
                    type="text"
                    name="name"
                    value={createData.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setCreateData("name", e.target.value)}
                  />
                  <InputError message={createErrors.name} className="mt-2" />
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

      {/* Modal for editing a make */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل الماركة</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditMake}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_make_name" value={"اسم الماركة"} />
                  <TextInput
                    id="edit_make_name"
                    type="text"
                    name="name"
                    value={editData.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setEditData("name", e.target.value)}
                  />
                  <InputError message={editErrors.name} className="mt-2" />
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
