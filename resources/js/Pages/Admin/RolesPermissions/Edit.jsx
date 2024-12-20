import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function EditPermissions({ auth, role,site_settings, rolePermissions }) {

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
      <AuthenticatedLayout user={auth.user} site_settings={site_settings}

            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        الصلاحيات
                    </h2>
                </div>
            }

      >
      <Head title={site_settings.websiteName + " - " +"الصلاحيات"} />
      <div className="">
        <div className="mx-auto max-w-7xl ">
          <div className="p-6 overflow-hidden bg-white shadow-sm dark:bg-gray-800">

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-6">
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
                        <th className="px-6 py-3 " colSpan="3">اذونات الانشاء الاساسيه :صندوق</th>
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










                     {/* Money */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">الصندوق و التحويلات</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-box-transaction</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-box-transaction")}
                            onChange={() => handleCheckboxChange("read-box-transaction")}
                          />
                        </td>
                        <td className="px-6 py-4">حركات الصندوق</td>
                      </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-box-transfer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-box-transfer")}
                            onChange={() => handleCheckboxChange("create-box-transfer")}
                          />
                        </td>
                        <td className="px-6 py-4">اضافة تحويل</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-box-transfer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-box-transfer")}
                            onChange={() => handleCheckboxChange("read-box-transfer")}
                          />
                        </td>
                        <td className="px-6 py-4">سجل التحويلات</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-box-transfer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-box-transfer")}
                            onChange={() => handleCheckboxChange("update-box-transfer")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث تحويل </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-box-transfer</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-box-transfer")}
                            onChange={() => handleCheckboxChange("delete-box-transfer")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف التحويل</td>
                      </tr>




















                        {/* Main CRUD Permissions for  (Destinations) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول الوجهات (Destinations)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-destination</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-destination")}
                            onChange={() => handleCheckboxChange("create-destination")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء وجهة</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-destination</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-destination")}
                            onChange={() => handleCheckboxChange("read-destination")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض الوجهةات</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-destination</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-destination")}
                            onChange={() => handleCheckboxChange("update-destination")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث وجهة</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-destination</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-destination")}
                            onChange={() => handleCheckboxChange("delete-destination")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف وجهة</td>
                        </tr>









                        {/* Main CRUD Permissions for  (Ports) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول الموانئ (Ports)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-port</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-port")}
                            onChange={() => handleCheckboxChange("create-port")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء ميناء</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-port</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-port")}
                            onChange={() => handleCheckboxChange("read-port")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض الموانئ</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-port</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-port")}
                            onChange={() => handleCheckboxChange("update-port")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث ميناء</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-port</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-port")}
                            onChange={() => handleCheckboxChange("delete-port")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف ميناء</td>
                        </tr>





                        {/* Main CRUD Permissions for  (Citites) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول المدن (Citites)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-city</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-city")}
                            onChange={() => handleCheckboxChange("create-city")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء مدينة</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-city</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-city")}
                            onChange={() => handleCheckboxChange("read-city")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض المدن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-city</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-city")}
                            onChange={() => handleCheckboxChange("update-city")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث المدينة</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-city</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-city")}
                            onChange={() => handleCheckboxChange("delete-city")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف المدينة</td>
                        </tr>





                        {/* Main CRUD Permissions for Shpping Fees */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول تكلفة الشحن (Shipping Fee)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-ShippingFee</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-ShippingFee")}
                            onChange={() => handleCheckboxChange("create-ShippingFee")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء تكلفة شحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-ShippingFee</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-ShippingFee")}
                            onChange={() => handleCheckboxChange("read-ShippingFee")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض تكلفة شحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-ShippingFee</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-ShippingFee")}
                            onChange={() => handleCheckboxChange("update-ShippingFee")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث تكلفة شحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-ShippingFee</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-ShippingFee")}
                            onChange={() => handleCheckboxChange("delete-ShippingFee")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف تكلفة شحن</td>
                        </tr>











                        {/* Main CRUD Permissions for Shpping Prices */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات  اسعار الشحن (Shipping Prices)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">shipping-price</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("shipping-price")}
                            onChange={() => handleCheckboxChange("shipping-price")}
                            />
                        </td>
                        <td className="px-6 py-4">تعديل اسعار الشحن</td>
                        </tr>


                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-shipping-price</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-shipping-price")}
                            onChange={() => handleCheckboxChange("read-shipping-price")}
                            />
                        </td>
                        <td className="px-6 py-4">مشاهدة اسعار الشحن</td>
                        </tr>

                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customer-read-shipping-price</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("customer-read-shipping-price")}
                            onChange={() => handleCheckboxChange("customer-read-shipping-price")}
                            />
                        </td>
                        <td className="px-6 py-4">مشاهدة اسعار الشحن للعميل</td>
                        </tr>









                            {/* Main CRUD Permissions for المزادات (Vendors) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول المزادات (Vendors)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-vendor</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-vendor")}
                            onChange={() => handleCheckboxChange("create-vendor")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء مزاد</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-vendor</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-vendor")}
                            onChange={() => handleCheckboxChange("read-vendor")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض المزادات</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-vendor</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-vendor")}
                            onChange={() => handleCheckboxChange("update-vendor")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث مزاد</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-vendor</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-vendor")}
                            onChange={() => handleCheckboxChange("delete-vendor")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف مزاد</td>
                        </tr>














                        {/* Main CRUD Permissions for خطوط الملاحه (Lines) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول خطوط الملاحه (Lines)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-line</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-line")}
                            onChange={() => handleCheckboxChange("create-line")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء خط ملاحي</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-line</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-line")}
                            onChange={() => handleCheckboxChange("read-line")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض خطوط الملاحه</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-line</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-line")}
                            onChange={() => handleCheckboxChange("update-line")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث خط ملاحي</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-line</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-line")}
                            onChange={() => handleCheckboxChange("delete-line")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف خط ملاحي</td>
                        </tr>










                        {/* Main CRUD Permissions for محطات الشحن (Terminals) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول محطات الشحن (Terminals)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-terminal</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-terminal")}
                            onChange={() => handleCheckboxChange("create-terminal")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء محطة شحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-terminal</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-terminal")}
                            onChange={() => handleCheckboxChange("read-terminal")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض محطات الشحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-terminal</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-terminal")}
                            onChange={() => handleCheckboxChange("update-terminal")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث محطة شحن</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-terminal</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-terminal")}
                            onChange={() => handleCheckboxChange("delete-terminal")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف محطة شحن</td>
                        </tr>








                        {/* Main CRUD Permissions for ماركه (Make) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول ماركه (Make)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-make</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-make")}
                            onChange={() => handleCheckboxChange("create-make")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء ماركه</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-make</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-make")}
                            onChange={() => handleCheckboxChange("read-make")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض المركات</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-make</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-make")}
                            onChange={() => handleCheckboxChange("update-make")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث ماركه</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-make</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-make")}
                            onChange={() => handleCheckboxChange("delete-make")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف ماركه</td>
                        </tr>






                        {/* Main CRUD Permissions for المودل (Model) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول الموديل (Model)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-model</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-model")}
                            onChange={() => handleCheckboxChange("create-model")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء مودل</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-model</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-model")}
                            onChange={() => handleCheckboxChange("read-model")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض المودلات</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-model</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-model")}
                            onChange={() => handleCheckboxChange("update-model")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث مودل</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-model</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-model")}
                            onChange={() => handleCheckboxChange("delete-model")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف مودل</td>
                        </tr>





                            {/* Main CRUD Permissions for المرافق (Facilities) */}
                        <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات جداول المرافق (Facilities)</th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-facility</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("create-facility")}
                            onChange={() => handleCheckboxChange("create-facility")}
                            />
                        </td>
                        <td className="px-6 py-4">انشاء مرفق</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-facility</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("read-facility")}
                            onChange={() => handleCheckboxChange("read-facility")}
                            />
                        </td>
                        <td className="px-6 py-4">عرض المرافق</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-facility</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("update-facility")}
                            onChange={() => handleCheckboxChange("update-facility")}
                            />
                        </td>
                        <td className="px-6 py-4">تحديث مرفق</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-facility</td>
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-facility")}
                            onChange={() => handleCheckboxChange("delete-facility")}
                            />
                        </td>
                        <td className="px-6 py-4">حذف مرفق</td>
                        </tr>








                     {/* Car Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات سيارات</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-car</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-car")}
                            onChange={() => handleCheckboxChange("create-car")}
                          />
                        </td>
                        <td className="px-6 py-4">اضافة سياراه</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-car</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-car")}
                            onChange={() => handleCheckboxChange("read-car")}
                          />
                        </td>
                        <td className="px-6 py-4">كل السيارات</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-car</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-car")}
                            onChange={() => handleCheckboxChange("update-car")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث سيارة</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-car</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-car")}
                            onChange={() => handleCheckboxChange("delete-car")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف سيارة</td>
                      </tr>





                     {/* Customer Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">اذونات العملاء</th>
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
                        <td className="px-6 py-4">اضافة عميل</td>
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




                     {/* customer credit Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">ارصده العملاء</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-customer-credit</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-customer-credit")}
                            onChange={() => handleCheckboxChange("create-customer-credit")}
                            disabled={role.id == 2 ||role.id == 3}

                          />
                        </td>
                        <td className="px-6 py-4">اضافة رصيد</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-customer-credit</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-customer-credit")}
                            onChange={() => handleCheckboxChange("read-customer-credit")}

                          />
                        </td>
                        <td className="px-6 py-4">سجل الرصيد</td>
                      </tr>


                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">reverse-customer-credit</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("reverse-customer-credit")}
                            onChange={() => handleCheckboxChange("reverse-customer-credit")}

                            disabled={role.id == 2 ||role.id == 3}
                          />
                        </td>
                        <td className="px-6 py-4">عملية رصيد عكسيه</td>
                        </tr>

                                          {/*
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-customer-credit</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-customer-credit")}
                            onChange={() => handleCheckboxChange("update-customer-credit")}
                          />
                        </td>
                        <td className="px-6 py-4">تحديث رصيد </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-customer-credit</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-customer-credit")}
                            onChange={() => handleCheckboxChange("delete-customer-credit")}
                          />
                        </td>
                        <td className="px-6 py-4">حذف رصيد</td>
                      </tr> *
                      /}






                    {/* Payment Permissions */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">الذمم</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customers-bills</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("customers-bills")}
                            onChange={() => handleCheckboxChange("customers-bills")}
                          />
                        </td>
                        <td className="px-6 py-4">تقرير ذمم العملاء</td>
                        </tr>
                     <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-bill</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("read-bill")}
                            onChange={() => handleCheckboxChange("read-bill")}
                          />
                        </td>
                        <td className="px-6 py-4">مشاهدة حركات الذمم</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">create-billPayment</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("create-billPayment")}
                            onChange={() => handleCheckboxChange("create-billPayment")}
                            disabled={role.id == 2 ||role.id == 3}

                          />
                        </td>
                        <td className="px-6 py-4">انشاء عمليه تسديد ذمه </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">update-billPayment</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("update-billPayment")}
                            onChange={() => handleCheckboxChange("update-billPayment")}
                            disabled={role.id == 2 ||role.id == 3}

                          />
                        </td>
                        <td className="px-6 py-4">تحديث عملية تسديد ذمه </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">delete-billPayment</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("delete-billPayment")}
                            onChange={() => handleCheckboxChange("delete-billPayment")}
                            disabled={role.id == 2 ||role.id == 3}

                          />
                        </td>
                        <td className="px-6 py-4">حذف عملية تسديد ذمه</td>
                      </tr>







                     {/*ALL System Users That are not customers */}
                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">الوصول للوحه التحكم</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">view-dashboard</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("view-admin-dashboard")}
                            onChange={() => handleCheckboxChange("view-admin-dashboard")}
                            disabled={role.id == 3}
                          />
                        </td>
                        <td className="px-6 py-4">لوحة تحكم الخاصه بمستخدمي النظام</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">customer-view-dashboard</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={data.permissions.includes("for-customer-view-dashboard")}
                            onChange={() => handleCheckboxChange("for-customer-view-dashboard")}
                            disabled={role.id != 3}

                          />
                        </td>
                        <td className="px-6 py-4">لوحة التحكم الخاصه ب العملاء </td>
                      </tr>




                    <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">للعملاء فقط</th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-my-cars</td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            disabled={true}
                            checked={data.permissions.includes("read-my-cars")}
                          />
                        </td>
                        <td className="px-6 py-4">الوصول للسيارة الخاصه به</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-my-credits</td>
                        <td className="px-6 py-4">
                        <input
                            disabled={true}
                            type="checkbox"
                            checked={data.permissions.includes("read-my-credits")}
                          />
                        </td>
                        <td className="px-6 py-4">الوصول لحركاته الماليه </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">read-my-bills</td>
                        <td className="px-6 py-4">
                            <input
                            disabled={true}
                            type="checkbox"
                            checked={data.permissions.includes("read-my-bills")}
                          />
                        </td>
                        <td className="px-6 py-4">الوصول الي الذمم الخاصه به </td>
                    </tr>







                    {/*Only System Admin */}

                      <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">انشاء مستخدم للنظام</th>
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


                    <tr className="border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
                        <th className="px-6 py-3 " colSpan="3">مدير النظام فقط</th>
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
                        <td className="px-6 py-4">تعديل صلاحيات النظام</td>
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
