import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

// Translation resources
const resources = {
  en: {
    translation: {},
  },
  ar: {
    translation: {
      // Main CRUD Permissions
    "create-main-category-desc": "إذن لإنشاء  الصنف الرئيسي",
    "read-main-category-desc": "إذن لعرض سجل الصنف الرئيسي",
    "update-main-category-desc": "إذن لتحديث  الصنف الرئيسي",
    "delete-main-category-desc": "إذن لحذف  الصنف الرئيسي",
    "create-sub-category-desc": "إذن لإنشاء  الصنف الفرعي",
    "read-sub-category-desc": "إذن لعرض سجل الصنف الفرعي",
    "update-sub-category-desc": "إذن لتحديث  الصنف الفرعي",
    "delete-sub-category-desc": "إذن لحذف  الصنف الفرعي",
    "create-customer-desc": "إذن لإنشاء عميل",
    "read-customer-desc": "إذن لعرض سجل العملاء",
    "update-customer-desc": "إذن لتحديث بيانات العميل",
    "delete-customer-desc": "إذن لحذف بيانات العميل",
    "create-warehouse-desc": "إذن لإنشاء مستودع",
    "read-warehouse-desc": "إذن لعرض سجل المستودعات",
    "update-warehouse-desc": "إذن لتحديث بيانات المستودع",
    "delete-warehouse-desc": "إذن لحذف المستودع",

    // Stock Order Permissions
    "confirme-stock-order-desc": "إذن لتأكيد طلب اضافه المنتجات",

    "add-stock-order-desc": "إذن لإضافة طلب اضافه",
    "all-stock-orders-desc": "إذن لعرض جميع طلبات الاضافه",
    "show-stock-order-desc":"عرض تفاصيل الطلب",
    "edit-stock-order-desc": "إذن لتعديل طلب اضافه",
    "delete-stock-order-desc": "إذن لحذف طلب الاضافه",

    "read-stock-desc": "إذن لعرض جميع المنتجات",

    // Admin Release Order Permissions
    "release-order-confirme-desc": "إذن لتأكيد طلبات الارجاع",
    "admin-orders-index-desc": "إذن لعرض جميع طلبات الارجاع",
    "admin-orders-change-status-desc": "إذن لتغيير حالة طلب الارجاع",
    "admin-orders-make-desc": "إذن لإنشاء طلب ارجاع نيابه عن المستخدم",
    "admin-orders-update-desc": "إذن لتحديث طلب ارجاع ",

    // Only Customer Permissions
    "for-customer-view-dashboard-desc": "الوصول الى لوحة التحكم العميل",
    "for-customer-my-products-report-desc": " تقرير المنتجات الخاصه بالعميل",
    "for-customer-make-release-repuest-desc": "عملية انشاء طلب ارجاع كاملة ",

    //only for System Admin
    "for-SystemAdmin-manage-users-desc": "القدره علي انشاء مستخدمين للنظام",
    "for-SystemAdmin-manage-roles-permissions-desc":"اعطاء صلاحيات لمستخدمين النظام",

    "view-admin-dashboard-desc":"الوصول الى لوحة التحكم  ",
    "Manage Permissions for": " تعديل أذونات ل ",
    "Permission": "الاذن",
    "Assign":"تعيين",
    "Description":"الوصف",
    "Customer CRUD Permissions": "إذن لإنشاء عميل",
    "Main CRUD Permissions": "  اذونات الانشاء الرئيسيه",
    "Warehouse Permissions": "إذن لإنشاء مستودع",
    "Stock Order Permissions": " اذن امكانيه انشاء طلب اضافه لعميل وتاكيد عملية الاضافه",
    "Release Order Permissions": 'اذن امكانية انشاء طلب استرجاع نيابه عن العميل وتاكيد عملية الارجاع',
    "Customer Permissions": "أذونات العميل فقط",
          "Who is not customer": "لغير العملاء",
    "Only SystemAdmin Permissions":"لمدير النظام وفقط"

    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function EditPermissions({ auth, role, rolePermissions }) {
  const { t } = useTranslation();
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
      <Head title={t("Manage Permissions")} />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              {t("Manage Permissions for")}: {role.name}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {t("Permissions")}
                </h3>
                <div className="overflow-auto">
                  <table className="w-full mt-4 text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3 ">{t("Permission")}</th>
                        <th className="px-6 py-3 ">{t("Assign")}</th>
                        <th className="px-6 py-3 ">{t("Description")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Main CRUD Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Main CRUD Permissions")}</th>
                      </tr>
                      {/* Main Category */}
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-main-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-main-category")}
                            onChange={() => handleCheckboxChange("create-main-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("create-main-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-main-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-main-category")}
                            onChange={() => handleCheckboxChange("read-main-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("read-main-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-main-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-main-category")}
                            onChange={() => handleCheckboxChange("update-main-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("update-main-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-main-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-main-category")}
                            onChange={() => handleCheckboxChange("delete-main-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("delete-main-category-desc")}</td>
                      </tr>

                      {/* Sub Category */}
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-sub-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-sub-category")}
                            onChange={() => handleCheckboxChange("create-sub-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("create-sub-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-sub-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-sub-category")}
                            onChange={() => handleCheckboxChange("read-sub-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("read-sub-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-sub-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-sub-category")}
                            onChange={() => handleCheckboxChange("update-sub-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("update-sub-category-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-sub-category</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-sub-category")}
                            onChange={() => handleCheckboxChange("delete-sub-category")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("delete-sub-category-desc")}</td>
                      </tr>



                      {/* Warehouse Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Warehouse Permissions")}</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-warehouse</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-warehouse")}
                            onChange={() => handleCheckboxChange("create-warehouse")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("create-warehouse-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-warehouse</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-warehouse")}
                            onChange={() => handleCheckboxChange("read-warehouse")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("read-warehouse-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-warehouse</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-warehouse")}
                            onChange={() => handleCheckboxChange("update-warehouse")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("update-warehouse-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-warehouse</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-warehouse")}
                            onChange={() => handleCheckboxChange("delete-warehouse")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("delete-warehouse-desc")}</td>
                      </tr>

                     {/* Customer Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Customer CRUD Permissions")}</th>
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
                        <td className="px-6 py-4">{t("create-customer-desc")}</td>
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
                        <td className="px-6 py-4">{t("read-customer-desc")}</td>
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
                        <td className="px-6 py-4">{t("update-customer-desc")}</td>
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
                        <td className="px-6 py-4">{t("delete-customer-desc")}</td>
                      </tr>

                      {/* Stock Orders */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Stock Order Permissions")}</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">confirme-stock-order</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("confirme-stock-order")}
                            onChange={() => handleCheckboxChange("confirme-stock-order")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("confirme-stock-order-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">add-stock-order</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("add-stock-order")}
                            onChange={() => handleCheckboxChange("add-stock-order")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("add-stock-order-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">all-stock-orders</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("all-stock-orders")}
                            onChange={() => handleCheckboxChange("all-stock-orders")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("all-stock-orders-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">Edit-stock-order</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("edit-stock-order")}
                            onChange={() => handleCheckboxChange("edit-stock-order")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("edit-stock-order-desc")}</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">Show-stock-order</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("show-stock-order")}
                            onChange={() => handleCheckboxChange("show-stock-order")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("show-stock-order-desc")}</td>
                            </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-stock-order</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-stock-order")}
                            onChange={() => handleCheckboxChange("delete-stock-order")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("delete-stock-order-desc")}</td>
                      </tr>

                      {/* Release Orders */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Release Order Permissions")}</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">release-order-confirme</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("release-order-confirme")}
                            onChange={() => handleCheckboxChange("release-order-confirme")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("release-order-confirme-desc")}</td>
                      </tr>


                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">admin-orders-index</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("admin-orders-index")}
                            onChange={() => handleCheckboxChange("admin-orders-index")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("admin-orders-index-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">admin-orders-change-status</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("admin-orders-change-status")}
                            onChange={() => handleCheckboxChange("admin-orders-change-status")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("admin-orders-change-status-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">admin-orders-make</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("admin-orders-make")}
                            onChange={() => handleCheckboxChange("admin-orders-make")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("admin-orders-make-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">admin-orders-update</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("admin-orders-update")}
                            onChange={() => handleCheckboxChange("admin-orders-update")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("admin-orders-update-desc")}</td>
                                          </tr>
                     {/*Customer Release Orders */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Customer Permissions")}</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customer-view-dashboard</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-customer-view-dashboard")}
                            onChange={() => handleCheckboxChange("for-customer-view-dashboard")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("for-customer-view-dashboard-desc")}</td>
                      </tr>


                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customer-my-products-report</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-customer-my-products-report")}
                            onChange={() => handleCheckboxChange("for-customer-my-products-report")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("for-customer-my-products-report-desc")}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customer-make-release-repuest</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-customer-make-release-repuest")}
                            onChange={() => handleCheckboxChange("for-customer-make-release-repuest")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("for-customer-make-release-repuest-desc")}</td>
                      </tr>
                     {/*ALL System Users That are not customers */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Who is not customer")}</th>
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
                        <td className="px-6 py-4">{t("view-admin-dashboard-desc")}</td>
                      </tr>
                     {/*Only System Admin */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">{t("Only SystemAdmin Permissions")}</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">SystemAdmin-manage-users</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-SystemAdmin-manage-users")}
                            onChange={() => handleCheckboxChange("for-SystemAdmin-manage-users")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("for-SystemAdmin-manage-users-desc")}</td>
                      </tr>


                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">SystemAdmin-manage-roles-permissions</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-SystemAdmin-manage-roles-permissions")}
                            onChange={() => handleCheckboxChange("for-SystemAdmin-manage-roles-permissions")}
                          />
                        </td>
                        <td className="px-6 py-4">{t("for-SystemAdmin-manage-roles-permissions-desc")}</td>
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
                  {t("Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
