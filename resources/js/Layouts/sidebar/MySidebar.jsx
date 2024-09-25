import { useState } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { MdDashboard, MdChevronLeft, MdChevronRight,MdOutlineCategory,MdInventory } from "react-icons/md";
import SideNavLink from "@/Components/SideNavLink";
import { Link } from "@inertiajs/react";

import { SiSpringsecurity } from "react-icons/si";
import { FaUser, FaGavel, FaMapMarkerAlt, FaShip, FaTruck, FaBuilding, FaCar, FaCogs } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbArrowsTransferUp } from "react-icons/tb";
import { TbReportMoney } from "react-icons/tb";
import { RiBillFill } from "react-icons/ri";
import { PiBagSimpleFill } from "react-icons/pi";
import { TbReceiptTax } from "react-icons/tb";

const MySidebar = ({ user, direction,site_settings }) => {

    const [collapsed, setCollapsed] = useState(false);

    const sections = [
        { // admin
            title: "لوحة التحكم",
            links: [
                {
                    text: "لوحة التحكم",
                    href: "admin.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["view-admin-dashboard"],
                },
                {
                    text: "الصندايق",
                    href: "box.index",
                    icon: <MdDashboard />,
                    permissions: ["read-box"],
                },
                {
                    text: " المستخدمين",
                    href: "user.index",
                    icon: <FaUser />,
                    permissions: ["read-user"],
                },
                {
                    text: "الصلاحيات ",
                    href: "admin.roles-permissions.index",
                    icon: <SiSpringsecurity />,
                    permissions: ["for-SystemAdmin-manage-roles-permissions"],
                },
            ],
            icon: <MdDashboard />,
        },
        { // admin
        title: "البيانات",
            links: [
            {
                text: "الاعدادات",
                href: "admin.settings.index",
                icon: <IoMdSettings />,  // vendor icon for vendors
                permissions: ["for-SystemAdmin-manage-site-settings"],
            },
            {
                text: "المزادات (Vendors)",
                href: "vendor.index",
                icon: <FaGavel />,  // vendor icon for vendors
                permissions: ["read-vendor"],
            },
            {
                text: "الوجهات (Destinations)",
                href: "destination.index",
                icon: <FaMapMarkerAlt />,  // Map marker icon for destinations
                permissions: ["read-destination"],
            },
            {
                text: "خطوط الملاحه (Lines)",
                href: "line.index",
                icon: <FaShip />,  // Ship icon for lines
                permissions: ["read-line"],
            },
            {
                text: "محطات الشحن (Terminals)",
                href: "terminal.index",
                icon: <FaTruck />,  // Truck icon for terminals
                permissions: ["read-terminal"],
            },
            {
                text: "المرافق (Facilities)",
                href: "facility.index",
                icon: <FaBuilding />,  // Building icon for facilities
                permissions: ["read-facility"],
            },
            {
                text: "المركات (Makes)",
                href: "make.index",
                icon: <FaCar />,  // Car icon for makes
                permissions: ["read-make"],
            },
            {
                text: "الموديلات (Models)",
                href: "model.index",
                icon: <FaCogs />,  // Cogs icon for models
                permissions: ["read-model"],
            },

            ],

        icon: <MdDashboard />,
        },
            {
            title: " الشحن (Shipping)" ,
            links: [
                {
                    text: "العملاء",
                    href: "customer.index",
                    icon: <MdDashboard />,
                    permissions: ["read-customer"],
                },
                {
                    text: "السيارات",
                    href: "car.index",
                    icon: <FaCar />,
                    permissions: ["read-car"],
                },
            ],
            icon: <MdDashboard />,
        },
            {
            title: "المحاسبة (Accounting)",
            links: [
                {
                    text: "المقبوضات",
                    href: "bill-payment.index",
                    icon: <RiBillFill  />,
                    permissions: ["read-bill"],
                },
                {
                    text: "ارصده العملاء",
                    href: "customer-credit.index",
                    icon: <TbReportMoney  />,
                    permissions: ["read-customer-credit"],
                },
                {
                    text: "موجودات الصندوق",
                    href: "box.index.transaction",
                    icon: <PiBagSimpleFill  />,
                    permissions: ["read-box-transaction"],
                },
                {
                    text: "تحويلات",
                    href: "box-transfer.index",
                    icon: <TbArrowsTransferUp  />,
                    permissions: ["read-box-transfer"],
                },
                {
                    text: "تقرير ذمم العملاء",
                    href: "customers-bills.index",
                    icon: <TbReceiptTax  />,
                    permissions: ["customers-bills"],
                },
            ],
            icon: <MdDashboard />,
        },







        { // customer
            title: "لوحة التحكم",
            links: [
                {
                    text: "لوحة التحكم",
                    href: "customer.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["for-customer-view-dashboard"],
                },
                {
                    text: "سياراتي",
                    href: "customer-my-cars.index",
                    icon: <FaCar />,
                    permissions: ["read-my-cars"],
                },
                {
                    text: "المحاسبة",
                    href: "customer-my-credits.index",
                    icon: <PiBagSimpleFill />,
                    permissions: ["read-my-credits"],
                },
                {
                    text: "الذمم",
                    href: "customer-my-bills.index",
                    icon: <TbReceiptTax />,
                    permissions: ["read-my-bills"],
                },
            ],
            icon: <MdDashboard />,
            permissions:['for-customer-view-dashboard']
        },





    ];

    const filteredSections = sections
        .filter((section) =>
            !section.permissions || section.permissions.every((permission) => user.permissions.includes(permission))
        )
        .map((section) => ({
            ...section,
            links: section.links.filter((link) =>
                link.permissions.some((permission) =>
                    user.permissions.includes(permission)
                )
            ),
        }))
        .filter((section) => section.links.length > 0);
    return (
        <div>
            <Sidebar
                rtl={true}
                collapsed={collapsed}
                width="270px"
                collapsedWidth="80px"
                className="h-full transition-all duration-300 bg-indigoBlue dark:bg-gray-800"
                transitionDuration={300}
                backgroundColor="white dark:bg-gray-800"
            >
                <div className="flex items-center justify-between p-4 overflow-hidden">
                    <h1
                        className={`flex gap-2 text-xl font-bold text-white dark:text-white transition-all duration-300 ${
                            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        }`}
                    >
                         <img
                            src="/images/logo.PNG"
                            alt="Logo"
                            className="w-8 h-8"
                        />
                        <span className="pt-1">{ site_settings.websiteName}</span>
                    </h1>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 rounded-full bg-burntOrange dark:bg-burntOrange transition-all duration-300 ${
                            collapsed ? "rotate-180" : ""
                        }`}
                    >

                        <MdChevronRight
                            size={24}
                            className="text-white "
                        />

                    </button>
                </div>
                <div className="px-6 pt-2">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Menu
                    iconShape="square"
                    className="pt-2 text-white dark:text-white"
                >
                    {filteredSections.map((section, index) => (
                        <SubMenu
                            key={`${index}-${section.title}`}
                            icon={section.icon}
                            label={section.title}
                            className="py-2 my-2 dark:hover:text-white hover:text-burntOrange"
                        >
                            {section.links.map((link, idx) => (
                                <SideNavLink
                                    key={`${idx}-${link.href}`}
                                    href={route(link.href)}
                                    active={route().current(link.href)}
                                    className="flex items-center justify-between px-4 py-2"
                                >
                                    <div className="flex items-center gap-2 mt-2 ml-5 mr-5 text-base text-gray-400 dark:text-gray-500 hover:text-burntOrange dark:hover:text-burntOrange">
                                        {link.icon}{link.text}
                                    </div>
                                </SideNavLink>
                            ))}
                        </SubMenu>
                    ))}
                </Menu>
                <div className="px-6 pb-8">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Link href={route("profile.edit")}>
                    <div className="flex items-center p-6 pt-2 mx-auto overflow-hidden ">
                        <div
                            className={`flex items-center ${
                                collapsed ? "" : "gap-3"
                            }`}
                        >
                            <img
                                className="rounded-full w-9 h-9"
                                src={user.profile_photo_url}
                                alt="User avatar"
                            />
                            {!collapsed && (
                                <div className="overflow-hidden">
                                    <div className="overflow-hidden text-sm font-medium text-white dark:text-gray-200 whitespace-nowrap text-ellipsis">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-white dark:text-gray-400">
                                        {user.email}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </Sidebar>
        </div>
    );
};

export default MySidebar;
