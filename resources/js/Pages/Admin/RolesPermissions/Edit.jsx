import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function EditPermissions({ auth, role, rolePermissions }) {

  const { data, setData, put } = useForm({ permissions: rolePermissions });

  const handleCheckboxChange = (permission) => {
    if (data.permissions.includes(permission)) {
      setData("permissions", data.permissions.filter((perm) => perm !== permission));
    } else {
      setData("permissions", [...data.permissions, permission]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.roles-permissions.update", role.id), { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={"الصلاحيات"} />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              صلاحيات : {role.name}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  صلاحيات
                </h3>
                <div className="overflow-auto">
                  <table className="w-full mt-4 text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3 ">الاذن</th>
                        <th className="px-6 py-3 ">منح</th>
                        <th className="px-6 py-3 ">وصف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Main CRUD Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات الانشاء الاساسيه</th>
                      </tr>
                      {/* Main Box */}
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-box</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-box")}
                            onChange={() => handleCheckboxChange("create-box")}
                          />
                        </td>
                        <td className="px-6 py-4">انشاء صندوق</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-box</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-box")}
                            onChange={() => handleCheckboxChange("read-box")}
                          />
                        </td>
                        <td className="px-6 py-4">كل الصناديق</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-box</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-box")}
                            onChange={() => handleCheckboxChange("update-box")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث صندوق</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-box</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-box")}
                            onChange={() => handleCheckboxChange("delete-box")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف صندوق</td>
                      </tr>


                     {/* Customer Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">انشاء عميل</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-customer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-customer")}
                            onChange={() => handleCheckboxChange("create-customer")}
                          />
                        </td>
                        <td className="px-6 py-4">انشاء عميل</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-customer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-customer")}
                            onChange={() => handleCheckboxChange("read-customer")}
                          />
                        </td>
                        <td className="px-6 py-4">كل العملاء</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-customer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-customer")}
                            onChange={() => handleCheckboxChange("update-customer")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث عميل</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-customer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-customer")}
                            onChange={() => handleCheckboxChange("delete-customer")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف عميل</td>
                      </tr>

                     {/*ALL System Users That are not customers */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">مستخدمي النظام</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">view-dashboard</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("view-admin-dashboard")}
                            onChange={() => handleCheckboxChange("view-admin-dashboard")}
                          />
                        </td>
                        <td className="px-6 py-4">لوحة تحكم الخاصه بمستخدمي النظام</td>
                      </tr>
                     {/*Only System Admin */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">مستخدمي النظام</th>
                      </tr>


                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-user</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-user")}
                            onChange={() => handleCheckboxChange("create-user")}
                          />
                        </td>
                        <td className="px-6 py-4">انشاء مستخدم</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-user</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-user")}
                            onChange={() => handleCheckboxChange("read-user")}
                          />
                        </td>
                        <td className="px-6 py-4">كل المستخدمين</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-user</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-user")}
                            onChange={() => handleCheckboxChange("update-user")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث مستخدم</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-user</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-user")}
                            onChange={() => handleCheckboxChange("delete-user")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف مستخدم</td>
                      </tr>



                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                 حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
