import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useState, useEffect } from "react";

export default function Index({ auth, site_settings, boxes, queryParams = null }) {
    // ----------------------------------------------------------------------------- Page + search
  queryParams = queryParams || {};
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("box.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

    // -----------------------------------------------------------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState(null);

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const toggleEditModal = (box = null) => {
    setEditingBox(box);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const { data: createData, setData: setCreateData, post: createPost, errors: createErrors, reset: createReset } = useForm({
    name: "",
  });

  const { data: editData, setData: setEditData, post: editPost, errors: editErrors, reset: editReset } = useForm({
    name: "",
    _method: "PUT",
  });

  const handleCreateBox = (e) => {
    e.preventDefault();
    createPost(route("box.store"), {
      onSuccess: () => {
        createReset();
        toggleCreateModal();
      }
    });
  };

  const handleEditBox = (e) => {
    e.preventDefault();
    editPost(route("box.update", editingBox.id), {
      onSuccess: () => {
        editReset();
        toggleEditModal();
      }
    });
  };

  useEffect(() => {
    if (editingBox) {
      setEditData("name", editingBox.name);
    }
  }, [editingBox]);




  const deleteBox = (box) => {
    if (!window.confirm("هل انت متاكد من حذف الصندوق ؟ ")) {
      return;
    }
      router.delete(route("box.destroy", box), {

        onSuccess: (page) => {

      }
    });
  };

  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}

      header={
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                الصناديق
            </h2>

            <div className="flex items-center gap-3">
                {auth.user.permissions.includes("read-box-transaction") && (
                        <Link
                        href={route('box.index.transaction')}
                        className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 "
                        >
                        موجودات الصندوق
                        </Link>
                    )}
                {auth.user.permissions.includes("create-box") && (
                    <button
                    onClick={toggleCreateModal}
                    className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange "
                    >
                    اضافة جديد
                    </button>
                )}

            </div>
        </div>
      }
    >
          <Head title={site_settings.websiteName + " - " +"الصناديق"} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <td>ID</td>
                      <td>الاسم</td>
                      <td>تاريخ الانشاء</td>
                      <td>تاريخ التحديث</td>
                      <td>الاجراءات</td>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={"اسم الصندوق"}
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxes && boxes.data.length > 0 ? (
                      boxes.data.map((box) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={box.id}
                        >
                          <td className="px-3 py-2">{box.id}</td>
                          <th className="px-3 py-2 text-nowrap">{box.name}</th>
                          <td className="px-3 py-2 text-nowrap">
                            {box.created_at}
                          </td>
                          <td className="px-3 py-2 text-nowrap">
                            {box.updated_at}
                          </td>
                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-box") && (
                              <button
                                onClick={() => toggleEditModal(box)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-box") && (
                              <button
                                onClick={() => deleteBox(box.id)}
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
                          لا يوجد صناديق
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {boxes && <Pagination links={boxes.meta.links} />}
            </div>
          </div>
        </div>
      </div>



      {/* Modal for adding a new box */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-black dark:text-white ">إضافة صندوق جديد</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateBox}>
                <div className="mb-4">
                  <InputLabel htmlFor="box_name" value={"اسم الصندوق"} />
                  <TextInput
                    id="box_name"
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




      {/* Modal for editing a box */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">تعديل الصندوق</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditBox}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_box_name" value={"اسم الصندوق"} />
                  <TextInput
                    id="edit_box_name"
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


