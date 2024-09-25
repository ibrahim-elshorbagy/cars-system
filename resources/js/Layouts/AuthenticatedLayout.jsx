import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import SelectInput from "@/Components/SelectInput";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import MySidebar from "./sidebar/MySidebar";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { FaBars } from "react-icons/fa6";

import { FaBell } from "react-icons/fa"; // Notification bell icon
import { router } from '@inertiajs/react';

export default function Authenticated({ user,site_settings,header, children }) {

    const [notifications, setNotifications] = useState(user.notifications || []);

    const handleNotificationClick = (id, e, order) => {
        e.preventDefault();

        router.post(route('notifications.markAsRead', [id, order]), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
            }
        });
    };

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    document.documentElement.dir = "rtl";


    return (
        <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 rtl`}>
            <nav className="fixed top-0 left-0 z-10 w-full bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="mx-auto max-w-7xl">
                    <div className="flex justify-between h-16 px-6">
                        <div className="flex gap-2">
                            <div className="flex items-center shrink-0">
                                {user.permissions.includes("view-admin-dashboard") && (
                                    <Link href={route("admin.dashboard")}>
                                                <img
                                                    src={site_settings.websiteLogo}
                                                    alt="Logo"
                                                    className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200"
                                        />
                                    </Link>
                                )}
                                {user.permissions.includes("for-customer-view-dashboard") && (
                                    <Link href={route("customer.dashboard")}>
                                                <img
                                                    src={site_settings.websiteLogo}
                                                    alt="Logo"
                                                    className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200"

                                                />
                                    </Link>
                                )}
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {user.permissions.includes("view-admin-dashboard") && (
                                    <NavLink
                                        href={route("admin.dashboard")}
                                        active={route().current("admin.dashboard")}
                                    >
                                        { site_settings.websiteName}
                                    </NavLink>
                                )}
                                {user.permissions.includes("for-customer-view-dashboard") && (
                                    <NavLink
                                        href={route("customer.dashboard")}
                                        active={route().current("customer.dashboard")}
                                    >
                                        { site_settings.websiteName}
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Notifications for Desktop */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <ThemeToggleButton />


                            {/* Notification Bell for Desktop */}
                            {/* {(user.roles == "admin" || user.roles == "SystemAdmin") && (
                                <div className="relative ml-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-full dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                                                <FaBell className="w-5 h-5" />
                                                {notifications.length > 0 && (
                                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                        {notifications.length}
                                                    </span>
                                                )}
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <Dropdown.Link
                                                        key={notification.id}
                                                        onClick={(e) => handleNotificationClick(notification.id, e, notification.data.order_id)} // Pass both notification.id and the event
                                                        as="button"
                                                    >
                                                        {t(notification.data.message)} {notification.data.customer_name}
                                                    </Dropdown.Link>
                                                ))
                                            ) : (
                                                <div className="p-2 text-gray-500">{t("No new notifications")}</div>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )} */}

                            {/* Profile and Log Out Links */}
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            البروفيل
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            تسجيل الخروح
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Notification Bell for Mobile */}
                        {/* <div className="flex items-center -mr-2 sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400"
                            >
                                <FaBell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                        </div> */}
                        <div className="flex items-center ml-5 sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400"
                            >
                                <FaBars />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>
                    <div className="pt-2 pb-3 space-y-1">
                        {user.permissions.includes("view-admin-dashboard") && (
                            <ResponsiveNavLink
                                href={route("admin.dashboard")}
                                active={route().current("admin.dashboard")}
                            >
                                لوحة التحكم
                            </ResponsiveNavLink>
                        )}
                        {user.permissions.includes("for-customer-view-dashboard") && (
                            <ResponsiveNavLink
                                href={route("customer.dashboard")}
                                active={route().current("customer.dashboard")}
                            >
                                لوحة التحكم
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                االبروفيل
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                تسجيل الخروح
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="grid justify-between grid-cols-3">
                                    <ThemeToggleButton />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 pt-16 bg-white">
                <MySidebar user={user} site_settings={site_settings}  />
                <div className="flex flex-col flex-1 min-h-screen">
                    {header && (
                        <header className="bg-indigoBlue dark:bg-gray-800">
                            <div className="px-4 py-6 mx-auto text-red-50 sm:px-6 lg:px-14">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="flex flex-col flex-1 bg-white dark:bg-gray-900">{children}</main>
                </div>
            </div>
        </div>
    );
}
