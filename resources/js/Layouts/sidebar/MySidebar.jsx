import { useState } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { MdDashboard, MdChevronLeft, MdChevronRight,MdOutlineCategory,MdInventory } from "react-icons/md";
import {FaUser} from "react-icons/fa";
import SideNavLink from "@/Components/SideNavLink";
import { Link } from "@inertiajs/react";

import { SiSpringsecurity } from "react-icons/si";


const MySidebar = ({ user, direction }) => {

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
                    text: "كل المستخدمين",
                    href: "user.index",
                    icon: <FaUser />,
                    permissions: ["for-SystemAdmin-manage-users"],
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
        { // customer
            title: "لوحة التحكم",
            links: [
                {
                    text: "لوحة التحكم",
                    href: "customer.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["for-customer-view-dashboard"],
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
                        <span className="pt-1">WebsiteName</span>
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
                            className="py-2 my-2 dark:hover:text-white hover:text-black"
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
