import { useState } from "react";
import { Sidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { MdDashboard, MdChevronLeft, MdChevronRight, MdOutlineCategory, MdInventory } from "react-icons/md";
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

const MySidebar = ({ user, direction, site_settings }) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            type: "link",
            text: " الرئيسية (Dashboard)  ",
            href: "admin.dashboard",
            icon: <MdDashboard />,
            permissions: ["view-admin-dashboard"],
        },

        {
            type: "section",
            title: " الشحن (Shipping)",
            icon: <MdDashboard />,
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
        },
        {
            type: "section",
            title: "المحاسبة (Accounting)",
            icon: <MdDashboard />,
            links: [
                            {
                    text: "ارصدة العملاء",
                    href: "customer-credit.index",
                    icon: <TbReportMoney />,
                    permissions: ["read-customer-credit"],
                },
                {
                    text: "تسديد ذمم",
                    href: "bill-payment.index",
                    icon: <RiBillFill />,
                    permissions: ["read-bill"],
                },
                {
                    text: "موجودات الصندوق",
                    href: "box.index.transaction",
                    icon: <PiBagSimpleFill />,
                    permissions: ["read-box-transaction"],
                },
                {
                    text: "التحويلات",
                    href: "box-transfer.index",
                    icon: <TbArrowsTransferUp />,
                    permissions: ["read-box-transfer"],
                },
                {
                    text: "تقرير ذمم العملاء",
                    href: "customers-bills.index",
                    icon: <TbReceiptTax />,
                    permissions: ["customers-bills"],
                },
            ],
        },
        {
            type: "section",
            title: "البيانات",
            icon: <MdDashboard />,
            links: [

                {
                    text: "المزادات (Vendors)",
                    href: "vendor.index",
                    icon: <FaGavel />,
                    permissions: ["read-vendor"],
                },
                {
                    text: "الوجهةات (Destinations)",
                    href: "destination.index",
                    icon: <FaMapMarkerAlt />,
                    permissions: ["read-destination"],
                },
                {
                    text: "خطوط الملاحة (Lines)",
                    href: "line.index",
                    icon: <FaShip />,
                    permissions: ["read-line"],
                },
                {
                    text: "المحطات (Terminals)",
                    href: "terminal.index",
                    icon: <FaTruck />,
                    permissions: ["read-terminal"],
                },
                {
                    text: "المرافق (Facilities)",
                    href: "facility.index",
                    icon: <FaBuilding />,
                    permissions: ["read-facility"],
                },
                {
                    text: "الماركات (Makes)",
                    href: "make.index",
                    icon: <FaCar />,
                    permissions: ["read-make"],
                },
                {
                    text: "الموديلات (Models)",
                    href: "model.index",
                    icon: <FaCogs />,
                    permissions: ["read-model"],
                },
            ],
        },
                {
            type: "section",
            title: "لوحة التحكم",
            icon: <MdDashboard />,
                    links: [
                {
                    text: "الاعدادات",
                    href: "admin.settings.index",
                    icon: <IoMdSettings />,
                    permissions: ["for-SystemAdmin-manage-site-settings"],
                },
                {
                    text: "الصناديق",
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
        },




        //for customer
        {
            type: "section",
            title: "لوحة التحكم",
            icon: <MdDashboard />,
            permissions: ['for-customer-view-dashboard'],
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
        },





    ];

    const filteredMenuItems = menuItems
        .filter((item) => {
            if (item.type === "link") {
                return item.permissions.some((permission) => user.permissions.includes(permission));
            } else if (item.type === "section") {
                const filteredLinks = item.links.filter((link) =>
                    link.permissions.some((permission) => user.permissions.includes(permission))
                );
                return filteredLinks.length > 0 && (!item.permissions || item.permissions.every((permission) => user.permissions.includes(permission)));
            }
            return false;
        })
        .map((item) => {
            if (item.type === "section") {
                return {
                    ...item,
                    links: item.links.filter((link) =>
                        link.permissions.some((permission) => user.permissions.includes(permission))
                    ),
                };
            }
            return item;
        });

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
                        <span className="pt-1">{site_settings.websiteName}</span>
                    </h1>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 rounded-full bg-burntOrange dark:bg-burntOrange transition-all duration-300 ${
                            collapsed ? "rotate-180" : ""
                        }`}
                    >
                        <MdChevronRight size={24} className="text-white " />
                    </button>
                </div>
                <div className="px-6 pt-2">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Menu iconShape="square" className="pt-2 text-white dark:text-white">
                    {filteredMenuItems.map((item, index) => {
                        if (item.type === "link") {
                            return (
                                <MenuItem
                                    key={`link-${index}`}
                                    icon={item.icon}
                                    component={<Link href={route(item.href)} />}
                                    className="py-2 my-2 dark:hover:text-white hover:text-burntOrange"
                                >
                                    {item.text}
                                </MenuItem>
                            );
                        } else if (item.type === "section") {
                            return (
                                <SubMenu
                                    key={`section-${index}`}
                                    icon={item.icon}
                                    label={item.title}
                                    className="py-2 my-2 dark:hover:text-white hover:text-burntOrange"
                                >
                                    {item.links.map((link, idx) => (
                                        <SideNavLink
                                            key={`${idx}-${link.href}`}
                                            href={route(link.href)}
                                            active={route().current(link.href)}
                                            className="flex items-center justify-between px-4 py-2"
                                        >
                                            <div className="flex items-center gap-2 mt-2 ml-5 mr-5 text-base text-gray-400 dark:text-gray-500 hover:text-burntOrange dark:hover:text-burntOrange">
                                                {link.icon}
                                                {link.text}
                                            </div>
                                        </SideNavLink>
                                    ))}
                                </SubMenu>
                            );
                        }
                    })}
                </Menu>
                <div className="px-6 pb-8">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Link href={route("profile.edit")}>
                    <div className="flex items-center p-6 pt-2 mx-auto overflow-hidden ">
                        <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
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
