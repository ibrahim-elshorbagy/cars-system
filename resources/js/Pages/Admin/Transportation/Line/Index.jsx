import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

export default function Index({site_settings ,auth, lines, queryParams = null, success,danger }) {
  queryParams = queryParams || {};

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
    const toggleEditModal = (line = null) => {
        if (line) {
            setEditingLine(line);

        setEditData({
            name: line.name,
            line_website: line.line_website,
            _method: "PUT",
        });
        } else {
        setEditingLine(null);
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

    router.get(route("line.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };



  const deleteLine = (line) => {
    if (!window.confirm("هل انت متأكد من حذف الخط الملاحي ؟ ")) {
      return;
    }
    router.delete(route("line.destroy", line.id), {
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
  const handleCreateLine = (e) => {
    e.preventDefault();
    createPost(route("line.store"), {
      onSuccess: () => {
        createReset();
        toggleCreateModal();


      },
    });
  };

  // Handle Edit
  const handleEditLine = (e) => {
    e.preventDefault();
    editPost(route("line.update", editingLine.id), {
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
          success={success} danger={danger}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            خطوط الملاحه (Lines)
          </h2>
          {auth.user.permissions.includes("create-line") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-2 text-sm text-white transition-all rounded shadow md:text-base text-nowrap bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة خط ملاحي
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"خطوط الملاحه (Lines)"} />

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
                      <td>رابط الخط الملاحي</td>

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
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines && lines.data.length > 0 ? (
                      lines.data.map((line,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                          key={line.id}
                        >
                          <td className="px-3 py-2">{line.id}</td>
                          <th className="px-3 py-2 text-nowrap">{line.name}</th>
                          <th className="px-3 py-2 text-emerald-500">  <a href={line.line_website} target="_blank" rel="noopener noreferrer">الذهاب</a></th>

                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-line") && (
                              <button
                                 onClick={() => toggleEditModal(line)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-line") && (
                              <button
                                onClick={() => deleteLine(line)}
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
                          لا يوجد خطوط ملاحيه (Lines)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {lines && <Pagination links={lines.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new line */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">إضافة خط ملاحي</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateLine}>
                <div className="mb-4">
                  <InputLabel htmlFor="line_name" value={"اسم الخط الملاحي"} />
                  <TextInput
                    id="line_name"
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
                  <InputLabel htmlFor="line_website" value={"رابط الخط الملاحي"} />
                  <TextInput
                    id="line_website"
                    type="text"
                    name="name"
                    value={createData.line_website}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setCreateData("line_website", e.target.value)}
                  />
                  <InputError message={createErrors.line_website} className="mt-2" />
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

      {/* Modal for editing a line */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل الخط الملاحي</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditLine}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_line_name" value={"اسم الخط الملاحي"} />
                  <TextInput
                    id="edit_line_name"
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
                  <InputLabel htmlFor="edit_line_name" value={"رابط الخط الملاحي"} />
                  <TextInput
                    id="edit_line_name"
                    type="text"
                    name="name"
                    value={editData.line_website}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setEditData("line_website", e.target.value)}
                  />
                  <InputError message={editErrors.line_website} className="mt-2" />
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
