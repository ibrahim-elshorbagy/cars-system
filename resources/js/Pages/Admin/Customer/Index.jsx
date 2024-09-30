import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth,site_settings, users, queryParams = null, success ,danger,whatsapp_redirect }) {
  queryParams = queryParams || {};
 // WhatsApp Redirect
  useEffect(() => {
        if (whatsapp_redirect) {
        // Open the WhatsApp link in a new tab
        window.open(whatsapp_redirect, "_blank");
        }
    }, [whatsapp_redirect]);



  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
    const toggleEditModal = (user = null) => {
        if (user) {
            setEditingUser(user);

        setEditData({
            name: user.name,
            user_name: user.user_name,
            email: user.email,
            phone: user.phone,
            whatsapp: user.whatsapp,
            customer_company: user.customer_company,

            _method: "PUT",
        });
        } else {
        setEditingUser(null);
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

    router.get(route("customer.index"), queryParams);
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


  const deleteUser = (user) => {
    if (!window.confirm("هل انت متأكد من حذف المستخدم ؟ ")) {
      return;
    }
    router.delete(route("customer.destroy", user.id), {
      onSuccess: (page) => {

            if (page.props.success) {
            setVisibleSuccess(page.props.success);
            setVisibleDanger(null);
        } else if (page.props.danger) {
            setVisibleDanger(page.props.danger);
            setVisibleSuccess(null);
            }

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
    createPost(route("customer.store"), {
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
    editPost(route("customer.update", editingUser.id), {
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
            العملاء
          </h2>
          {auth.user.permissions.includes("create-user") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة عميل
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"العملاء"} />

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
                      <td className="p-3 text-xs text-nowrap md:text-base">Id</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">اسم المستخدم</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الاسم</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">البريد الإلكتروني</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">اسم الشركه</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الهاتف</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">whatsapp</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">الدور</td>
                      <td className="p-3 text-xs text-nowrap md:text-base">تاريخ الإنشاء</td>
                      <th className="p-3 text-xs text-nowrap md:text-base">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                        <th className="p-3"></th>
                        <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.user_name}
                          placeholder={"اسم المستخدم"}
                          onBlur={(e) =>
                            searchFieldChanged("user_name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("user_name", e)}
                        />
                      </th>
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
                      <th className="p-3">
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
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.data.length > 0 ? (
                      users.data.map((user,index) => (
                        <tr
                                                      className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                          key={user.id}
                        >
                          <td className="px-3 py-2">{user.id}</td>
                          <th className="px-3 py-2 text-nowrap">{user.user_name}</th>
                          <th className="px-3 py-2 text-nowrap">{user.name}</th>
                          <td className="px-3 py-2">{user.email}</td>
                          <td className="px-3 py-2">{user.customer_company}</td>
                          <td className="px-3 py-2">{user.phone ? user.phone : "No Phone"}</td>
                            <td className="px-3 py-2">
                            {user.whatsapp ? (
                                <a
                                href={`https://wa.me/${user.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                                >
                                {user.whatsapp}
                                </a>
                            ) : (
                                "No WhatsApp"
                            )}
                            </td>
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
                          لا يوجد عملاء
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
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">إضافة عميل جديد</h2>
            </div>
            <div className="p-6">
            <form onSubmit={handleCreateUser}>
                <div className="mb-4 text-lg text-gray-700 dark:text-white">معلومات الدخول</div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="mb-4">
                        <InputLabel htmlFor="user_name" value={"اسم المستخدم"} />
                        <TextInput
                            id="user_name"
                            type="text"
                            name="user_name"
                            value={createData.user_name}
                            className="block w-full mt-1"
                            isFocused={true}
                            onChange={(e) => setCreateData("user_name", e.target.value)}
                        />
                        <InputError message={createErrors.user_name} className="mt-2" />
                        </div>
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
                        <div className="mb-4 text-lg text-gray-700 dark:text-white">معلومات اضافيه</div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                              <div className="mb-4">
                        <InputLabel htmlFor="name" value={"شخص الاتصال"} />
                        <TextInput
                            id="name"
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
                        <InputLabel htmlFor="name" value={"اسم الشركه"} />
                        <TextInput
                            id="customer_company"
                            type="text"
                            name="customer_company"
                                            value={createData.customer_company}

                            className="block w-full mt-1"
                            isFocused={true}
                            onChange={(e) => setCreateData("customer_company", e.target.value)}
                        />
                        <InputError message={createErrors.customer_company} className="mt-2" />
                                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                      <InputLabel htmlFor="phone" value={"الهاتف"} />
                      <TextInput
                          id="phone"
                          type="text"
                                          name="phone"
                      placeholder="+962799504930"

                        dir="ltr"
                          value={createData.phone}
                          className="block w-full mt-1"
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
                      placeholder="+962799504930"
                                          
                      dir="ltr"
                      value={createData.whatsapp}
                      className="block w-full mt-1"

                      onChange={(e) => setCreateData("whatsapp", e.target.value)}
                  />
                  <InputError message={createErrors.whatsapp} className="mt-2" />
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

      {/* Modal for editing a user */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="transition-all duration-300 ease-in-out transform scale-95 bg-white rounded-lg shadow-lg sm:w-1/2 dark:bg-gray-800 animate-in">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">تعديل عميل</h2>
            </div>
            <div className="p-6">
                          <form onSubmit={handleEditUser}>
                        <div className="mb-4 text-lg text-gray-700 dark:text-white">معلومات الدخول</div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div className="mb-4">
                        <InputLabel htmlFor="edit_user_name" value={"اسم المستخدم"} />
                        <TextInput
                            id="edit_user_name"
                            type="text"
                            name="user_name"
                            value={editData.user_name}
                            className="block w-full mt-1"
                            isFocused={true}
                            onChange={(e) => setEditData("user_name", e.target.value)}
                        />
                        <InputError message={editErrors.user_name} className="mt-2" />
                        </div>

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
                        <div className="mb-4 text-lg text-gray-700 dark:text-white">معلومات اضافيه</div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                              <div className="mb-4">
                    <InputLabel htmlFor="edit_name" value={"شخص الاتصال"} />
                    <TextInput
                        id="edit_name"
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
                    <InputLabel htmlFor="edit_customer_company" value={"اسم الشركه "} />
                    <TextInput
                        id="edit_customer_company"
                        type="text"
                        name="customer_company"
                        value={editData.customer_company}
                        className="block w-full mt-1"
                        isFocused={true}
                        onChange={(e) => setEditData("customer_company", e.target.value)}
                    />
                    <InputError message={editErrors.customer_company} className="mt-2" />
                                </div>

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
                          placeholder="+962799504930"

                          onChange={(e) => setEditData("phone", e.target.value)}
                      />
                      <InputError message={editErrors.phone} className="mt-2" />
                  </div>
                 <div className="mb-4">
                  <InputLabel htmlFor="edit_whatsapp" value={"whatsapp"} />
                  <TextInput
                      id="edit_whatsapp"
                      type="text"
                      name="whatsapp"
                      value={editData.whatsapp}
                      dir="ltr"
                      className="block w-full mt-1"
                      placeholder="+962799504930"


                      onChange={(e) => setEditData("whatsapp", e.target.value)}
                  />
                  <InputError message={editErrors.whatsapp} className="mt-2" />
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
