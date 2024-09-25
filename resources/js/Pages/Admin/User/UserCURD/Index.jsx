import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth,site_settings, users, queryParams = null, success ,roles,boxes,danger}) {
  queryParams = queryParams || {};

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

    const [selectedRole, setSelectedRole] = useState(""); // For create modal
    const [editSelectedRole, setEditSelectedRole] = useState(""); // For edit modal

  // Toggle Create Modal
  const toggleCreateModal = () => {
      setIsCreateModalOpen(!isCreateModalOpen);
      setSelectedRole("");
      createReset();
  };

  // Toggle Edit Modal
    const toggleEditModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            const roleId = Array.isArray(user.role_id) ? user.role_id[0] : user.role_id;
            setEditSelectedRole(roleId);
        setEditData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            whatsapp: user.whatsapp,

            role: roleId,
            _method: "PUT",
        });
        } else {
        setEditingUser(null);
            setEditSelectedRole("");
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

    router.get(route("user.index"), queryParams);
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
        setOperationPerformed(false);

      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger,operationPerformed]);


  const deleteUser = (user) => {
    if (!window.confirm("هل انت متأكد من حذف المستخدم ؟ ")) {
      return;
    }
    router.delete(route("user.destroy", user.id), {
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
    phone: "",
    whatsapp: "",

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
    phone: "",
    whatsapp: "",

    _method: "PUT",
  });

  // Handle Create
  const handleCreateUser = (e) => {
    e.preventDefault();
    createPost(route("user.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };

  // Handle Edit
  const handleEditUser = (e) => {
    e.preventDefault();
    editPost(route("user.update", editingUser.id), {
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
            المستخدمين
          </h2>
          {auth.user.permissions.includes("create-user") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة مستخدم
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"المستخدمين"} />

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
                      <td>البريد الإلكتروني</td>
                      <td>الهاتف</td>
                      <td>whatsapp</td>
                      <td>الدور</td>
                      <td>تاريخ الإنشاء</td>
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
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.email}
                          placeholder={"البريد الإلكتروني"}
                          onBlur={(e) =>
                            searchFieldChanged("email", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("email", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.data.length > 0 ? (
                      users.data.map((user) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={user.id}
                        >
                          <td className="px-3 py-2">{user.id}</td>
                          <th className="px-3 py-2 text-nowrap">{user.name}</th>
                          <td className="px-3 py-2">{user.email}</td>
                          <td className="px-3 py-2">{user.phone}</td>
                          <td className="px-3 py-2">{user.whatsapp}</td>
                          <td className="px-3 py-2">{user.role}</td>
                          <td className="px-3 py-2 text-nowrap">
                            {user.created_at}
                          </td>
                          <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-user") && (user.id !=1) && (
                              <button
                                 onClick={() => toggleEditModal(user)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-user") && (user.id !=1) &&  (
                              <button
                                onClick={() => deleteUser(user)}
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
                          لا يوجد مستخدمين
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {users && <Pagination links={users.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new user */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">إضافة مستخدم جديد</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateUser}>
                <div className="mb-4">
                  <InputLabel htmlFor="user_name" value={"اسم المستخدم"} />
                  <TextInput
                    id="user_name"
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
                        <SelectInput
                        name="role"
                        id="role"
                        className="block w-full mt-1"
                        value={createData.role}
                        onChange={(e) => {
                            setCreateData("role", e.target.value);
                            setSelectedRole(e.target.value); // Track role change
                        }}
                        >
                        <option value="">اختر</option>
                        {roles.map((role) => (
                            <option value={role.id} key={role.id}>
                            {role.name}
                            </option>
                        ))}
                        </SelectInput>
                        <InputError message={createErrors.role} className="mt-2" />
                    </div>
                    {/* Conditionally render the box selection if role is Accountant */}
                    {selectedRole == 4 && (
                    <div className="mb-4">
                        <InputLabel htmlFor="box_id" value={"اختر الصندوق"} />
                        <SelectInput
                        name="box_id"
                        id="box_id"
                        className="block w-full mt-1"
                        value={createData.box_id}
                        onChange={(e) => setCreateData("box_id", e.target.value)}
                        >
                        <option value="">اختر الصندوق</option>
                        {boxes.map((box) => (
                            <option value={box.id} key={box.id}>
                            {box.name}
                            </option>
                        ))}
                        </SelectInput>
                        <InputError message={createErrors.box_id} className="mt-2" />
                    </div>
                    )}

                <div className="mb-4">
                  <InputLabel htmlFor="user_email" value={"البريد الإلكتروني"} />
                  <TextInput
                    id="user_email"
                    type="email"
                    name="email"
                    value={createData.email}
                    className="block w-full mt-1"
                    onChange={(e) => setCreateData("email", e.target.value)}
                  />
                  <InputError message={createErrors.email} className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                      <InputLabel htmlFor="phone" value={"الهاتف"} />
                      <TextInput
                          id="phone"
                          type="text"
                          name="phone"
                          dir="ltr"
                          value={createData.phone}
                          className="block w-full mt-1"
                          isFocused={true}
                          onChange={(e) => setCreateData("phone", e.target.value)}
                      />
                      <InputError message={createErrors.phone} className="mt-2" />
                  </div>
                 <div className="mb-4">
                  <InputLabel htmlFor="whatsapp" value={"whatsapp"} />
                  <TextInput
                      id="whatsapp"
                      type="text"
                      name="whatsapp"
                      dir="ltr"
                      value={createData.whatsapp}
                      className="block w-full mt-1"
                      isFocused={true}
                      onChange={(e) => setCreateData("whatsapp", e.target.value)}
                  />
                  <InputError message={createErrors.whatsapp} className="mt-2" />
                  </div>
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="user_password" value={"كلمة المرور"} />
                  <TextInput
                    id="user_password"
                    type="password"
                    name="password"
                    value={createData.password}
                    className="block w-full mt-1"
                    onChange={(e) => setCreateData("password", e.target.value)}
                  />
                  <InputError message={createErrors.password} className="mt-2" />
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

      {/* Modal for editing a user */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">تعديل المستخدم</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditUser}>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_user_name" value={"اسم المستخدم"} />
                  <TextInput
                    id="edit_user_name"
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
                        <SelectInput
                        name="role"
                        id="edit_user_role"
                        className="block w-full mt-1"
                        value={editData.role}
                        onChange={(e) => {
                            setEditData("role", e.target.value);
                            setEditSelectedRole(e.target.value); // Track role change
                        }}
                        >
                        <option value="">اختر</option>
                        {roles.map((role) => (
                            <option value={role.id} key={role.id}>
                            {role.name}
                            </option>
                        ))}
                        </SelectInput>
                        <InputError message={editErrors.role} className="mt-2" />
                    </div>
                    {/* Conditionally render the box selection if role is Accountant */}
                    {editSelectedRole == 4 && (
                    <div className="mb-4">
                        <InputLabel htmlFor="edit_box_id" value={"اختر الصندوق"} />
                        <SelectInput
                        name="box_id"
                        id="edit_box_id"
                        className="block w-full mt-1"
                        value={editData.box_id}
                        onChange={(e) => setEditData("box_id", e.target.value)}
                        >
                        <option value="">اختر الصندوق</option>
                        {boxes.map((box) => (
                            <option value={box.id} key={box.id}>
                            {box.name}
                            </option>
                        ))}
                        </SelectInput>
                        <InputError message={editErrors.box_id} className="mt-2" />
                    </div>
                    )}

                <div className="mb-4">
                  <InputLabel htmlFor="edit_user_email" value={"البريد الإلكتروني"} />
                  <TextInput
                    id="edit_user_email"
                    type="email"
                    name="email"
                    value={editData.email}
                    className="block w-full mt-1"
                    onChange={(e) => setEditData("email", e.target.value)}
                  />
                  <InputError message={editErrors.email} className="mt-2" />
                              </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                      <InputLabel htmlFor="edit_phone" value={"الهاتف"} />
                      <TextInput
                          id="edit_phone"
                          type="text"
                          name="phone"
                          dir="ltr"
                          value={editData.phone}
                          className="block w-full mt-1"
                          isFocused={true}
                          onChange={(e) => setEditData("phone", e.target.value)}
                      />
                      <InputError message={createErrors.phone} className="mt-2" />
                  </div>
                 <div className="mb-4">
                  <InputLabel htmlFor="edit_whatsapp" value={"whatsapp"} />
                  <TextInput
                      id="edit_whatsapp"
                      type="text"
                      name="whatsapp"
                      dir="ltr"
                      value={editData.whatsapp}
                      className="block w-full mt-1"
                      isFocused={true}
                      onChange={(e) => setEditData("whatsapp", e.target.value)}
                  />
                  <InputError message={createErrors.whatsapp} className="mt-2" />
                  </div>
                </div>
                <div className="mb-4">
                  <InputLabel htmlFor="edit_user_password" value={"كلمة المرور"} />
                  <TextInput
                    id="edit_user_password"
                    type="password"
                    name="password"
                    value={editData.password}
                    className="block w-full mt-1"
                    placeholder="اكتب في حالة اردت تغيرها"
                    onChange={(e) => setEditData("password", e.target.value)}
                  />
                  <InputError message={editErrors.password} className="mt-2" />
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
