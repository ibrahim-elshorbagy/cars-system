import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { FaBalanceScale, FaMoneyBill, FaShippingFast, FaExclamationCircle, FaMoneyCheckAlt } from "react-icons/fa";



const Dashboard = ({ auth,site_settings,customer_balance,total_won_price,total_shipping_cost,total_require,total_paid }) => {


    return (
        <>
            <Head title={site_settings.websiteName + " - " +"لوحة التحكم"} />
            <div className="">
                <div >
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
                        <div className="gap-4 p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Customer Balance */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaBalanceScale className="mr-3 text-3xl text-green-500" />
                                                <div>
                                                    <CardTitle>Customer Balance</CardTitle>
                                                    <CardDescription>رصيد العميل</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-green-600 dark:text-green-300">
                                                {customer_balance}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Won Price */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaMoneyBill className="mr-3 text-3xl text-blue-500" />
                                                <div>
                                                    <CardTitle>Total Won Price</CardTitle>
                                                    <CardDescription>سعر الشراء الإجمالي</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                                                {total_won_price}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Shipping Cost */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaShippingFast className="mr-3 text-3xl text-purple-500" />
                                                <div>
                                                    <CardTitle>Total Shipping Cost</CardTitle>
                                                    <CardDescription>تكلفة الشحن الإجمالية</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-purple-600 dark:text-purple-300">
                                                {total_shipping_cost}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Paid */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaMoneyCheckAlt className="mr-3 text-3xl text-green-500" />
                                                <div>
                                                    <CardTitle>Total Paid</CardTitle>
                                                    <CardDescription>المجموع المدفوع</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-green-600 dark:text-green-300">
                                                {total_paid}$
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Required */}
                                    <Card className="bg-white dark:bg-gray-900">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <FaExclamationCircle className="mr-3 text-3xl text-red-500" />
                                                <div>
                                                    <CardTitle>Total Required</CardTitle>
                                                    <CardDescription>المجموع المطلوب</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-lg font-bold text-red-600 dark:text-red-300">
                                                {total_require}$
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const DashboardHeader = () => {

    return (
        <h2 className="text-xl font-semibold leading-tight text-white dark:text-gray-200">
            {"لوحة التحكم"}
        </h2>
    );
};

Dashboard.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}
        header={<DashboardHeader />}
    >
        {page}
    </AuthenticatedLayout>
);

export default Dashboard;
