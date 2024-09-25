import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth, facilities,site_settings, queryParams = null, success,danger }) {
  queryParams = queryParams || {};

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
    const toggleEditModal = (facility = null) => {
        if (facility) {
            setEditingFacility(facility);

        setEditData({
            name: facility.name,

            _method: "PUT",
        });
        } else {
        setEditingFacility(null);
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

    router.get(route("facility.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

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
    if (danger) {
      setVisibleDanger(danger);
      const timer = setTimeout(() => {
        setVisibleDanger(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger]);


  const deleteFacility = (facility) => {
    if (!window.confirm("هل انت متأكد من حذف المرفق ؟ ")) {
      return;
    }
    router.delete(route("facility.destroy", facility.id), {
      onSuccess: (page) => {
            setVisibleSuccess(page.props.success);
        setOperationPerformed(true);

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
  const handleCreateFacility = (e) => {
    e.preventDefault();
    createPost(route("facility.store"), {
      onSuccess: () => {
        createReset();
        toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };

  // Handle Edit
  const handleEditFacility = (e) => {
    e.preventDefault();
    editPost(route("facility.update", editingFacility.id), {
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
            المرافق (Facilities)
          </h2>
          {auth.user.permissions.includes("create-facility") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة مرفق
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"المرافق (Facilities)"} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}                    {visibleDanger && (
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
                      <td>Id</td>
                      <td>الاسم</td>

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
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                                          </th>

                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities && facilities.data.length > 0 ? (
                      facilities.data.map((facility) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={facility.id}
                        >
                          <td className="px-3 py-2">{facility.id}</td>
                          <th className="px-3 py-2 text-nowrap">{facility.name}</th>

                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-facility") && (
                              <button
                                 onClick={() => toggleEditModal(facility)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-facility") && (
                              <button
                                onClick={() => deleteFacility(facility)}
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
                          لا يوجد منشات (Facilities)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                          </div>

              {facilities && <Pagination links={facilities.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new facility */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة مرفق  جديده</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateFacility}>
                <div className="mb-4">
                  <InputLabel htmlFor="facility_name" value={"اسم المرفق"} />
                  <TextInput
                    id="facility_name"
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

      {/* Modal for editing a facility */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل المرفق</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditFacility}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_facility_name" value={"اسم المرفق"} />
                  <TextInput
                    id="edit_facility_name"
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
