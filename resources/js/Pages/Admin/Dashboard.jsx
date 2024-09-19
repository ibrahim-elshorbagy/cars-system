import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

 ;


const Dashboard = ({ auth }) => {


    return (
        <>
            <Head title="لوحة التحكم" />
            <div className="py-12">
                <div className="px-1 mx-auto sm:px-6 lg:px-6">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="gap-4 p-6 text-gray-900 dark:text-gray-100">

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
        header={<DashboardHeader />}
    >
        {page}
    </AuthenticatedLayout>
);

export default Dashboard;
