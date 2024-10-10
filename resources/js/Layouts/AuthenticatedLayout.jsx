import { useState , useEffect} from "react";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import MySidebar from "./sidebar/MySidebar";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { FaBars } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { FaWhatsapp } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion"

export default function Authenticated({ user,site_settings,header, children ,success,danger}) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    document.documentElement.dir = "rtl";

        const menuItems = [
            {
                type: "link",
                text: "الرئيسية (Dashboard)",
                href: "admin.dashboard",
                permissions: ["view-admin-dashboard"],
            },
            {
                type: "section",
                title: "الشحن (Shipping)",
                permissions: ["read-customer", "read-car"],
                links: [
                    { text: "العملاء", href: "customer.index", permissions: ["read-customer"] },
                    { text: "السيارات", href: "car.index", permissions: ["read-car"] },
                    { text: "اسعار الشحن", href: "shipping-prices.index", permissions: ["shipping-price"] },

                ],
            },
            {
                type: "section",
                title: "المحاسبة (Accounting)",
                permissions: ["read-customer-credit", "read-bill", "read-box-transaction", "read-box-transfer", "customers-bills"],
                links: [
                    { text: "ارصدة العملاء", href: "customer-credit.index", permissions: ["read-customer-credit"] },
                    { text: "تسديد ذمم", href: "bill-payment.index", permissions: ["read-bill"] },
                    { text: "موجودات الصندوق", href: "box.index.transaction", permissions: ["read-box-transaction"] },
                    { text: "التحويلات", href: "box-transfer.index", permissions: ["read-box-transfer"] },
                    { text: "تقرير ذمم العملاء", href: "customers-bills.index", permissions: ["customers-bills"] },
                ],
            },
            {
                type: "section",
                title: "البيانات",
                permissions: ["read-vendor", "read-destination", "read-line", "read-terminal", "read-facility", "read-make", "read-model"],
                links: [
                    { text: "تكلفة الشحن (Shipping Fee)", href: "ShippingFee.index", permissions: ["read-ShippingFee"] },
                    { text: "اسعار الشحن (Shipping Prices)", href: "show.shipping-prices", permissions: ["read-shipping-price"] },
                    { text: "الوجهات (Destinations)", href: "destination.index", permissions: ["read-destination"] },
                    { text: "الموانئ (Ports)", href: "port.index", permissions: ["read-port"] },
                    { text: "المدن (Cities)", href: "city.index", permissions: ["read-city"] },
                    { text: "المزادات (Vendors)", href: "vendor.index", permissions: ["read-vendor"] },
                    { text: "خطوط الملاحة (Lines)", href: "line.index", permissions: ["read-line"] },
                    { text: "المحطات (Terminals)", href: "terminal.index", permissions: ["read-terminal"] },
                    { text: "المرافق (Facilities)", href: "facility.index", permissions: ["read-facility"] },
                    { text: "الماركات (Makes)", href: "make.index", permissions: ["read-make"] },
                    { text: "الموديلات (Models)", href: "model.index", permissions: ["read-model"] },
                ],
            },
            {
                type: "section",
                title: "لوحة التحكم",
                permissions: ["for-SystemAdmin-manage-site-settings", "read-box", "read-user", "for-SystemAdmin-manage-roles-permissions"],
                links: [
                    { text: "الاعدادات", href: "admin.settings.index", permissions: ["for-SystemAdmin-manage-site-settings"] },
                    { text: "الصناديق", href: "box.index", permissions: ["read-box"] },
                    { text: "المستخدمين", href: "user.index", permissions: ["read-user"] },
                    { text: "الصلاحيات", href: "admin.roles-permissions.index", permissions: ["for-SystemAdmin-manage-roles-permissions"] },
                ],
            },
            {
                type: "section",
                title: "لوحة التحكم",
                permissions: ["for-customer-view-dashboard"],
                links: [
                    { text: "لوحة التحكم", href: "customer.dashboard", permissions: ["for-customer-view-dashboard"] },
                    { text: "سياراتي", href: "customer-my-cars.index", permissions: ["read-my-cars"] },
                    { text: "المحاسبة", href: "customer-my-credits.index", permissions: ["read-my-credits"] },
                    { text: "الذمم", href: "customer-my-bills.index", permissions: ["read-my-bills"] },
                    { text: "اسعار الشحن", href: "show.shipping-prices", permissions: ['read-shipping-price'] },
                ],
            },
        ];



    const hasSectionPermission = (sectionPermissions) => {
            return sectionPermissions.some(permission => user.permissions.includes(permission));
        };



    useEffect(() => {
        if (success) {
                toast.success("تم بنجاح!", {
                    description: success,
                    duration: 3000,
                });
            }
            if(danger){
                toast.error("حدث مشكلة!", {
                    description: danger,
                    duration: 3000,
                });
            }
        }, [success,danger]);





    return (
        <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 rtl`}>
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

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <ThemeToggleButton />

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
                                               <IoChevronDownOutline />

                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            بياناتي
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

                        <div className="flex items-center sm:hidden">
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
                    <Accordion type="single" collapsible>
                        {menuItems.map((item, index) => {
                            // Render individual links based on permissions
                            if (item.type === "link" && hasSectionPermission(item.permissions)) {
                                return (
                                    <ResponsiveNavLink key={index} href={route(item.href)} active={route().current(item.href)}>
                                        {item.text}
                                    </ResponsiveNavLink>
                                );
                            }

                            // Render sections only if the user has any permission for the section or its links
                            if (item.type === "section" && hasSectionPermission(item.permissions)) {
                                return (
                                    <AccordionItem className='px-3 text-gray-700 dark:text-gray-200' key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{item.title}</AccordionTrigger>
                                        <AccordionContent>
                                            {item.links.map((link, linkIndex) => (
                                                hasSectionPermission(link.permissions) && (
                                                    <ResponsiveNavLink key={linkIndex} href={route(link.href)} active={route().current(link.href)}>
                                                        {link.text}
                                                    </ResponsiveNavLink>
                                                )
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            }

                            return null;
                        })}
                    </Accordion>

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
                                بياناتي
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route("logout")} as="button">
                                تسجيل الخروج
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

        <div className="flex-1 pt-16 sm:flex">
            <div className="hidden sm:flex">
            <MySidebar user={user} site_settings={site_settings} />
            </div>

            <div className="flex-1 overflow-x-hidden bg-white dark:bg-gray-800">
            {header && (
                <header className="bg-indigoBlue dark:bg-gray-900">
                <div className="px-4 py-6 mx-auto text-red-50 sm:px-6 lg:px-14">
                    {header}
                </div>
                </header>
            )}
            <main className="flex flex-col flex-1 bg-white dark:bg-gray-800">{children}</main>
            </div>
        </div>

            <Toaster richColors  />

        <footer dir="ltr" className="py-6 text-white bg-gray-950">
            <div className="container flex flex-col items-center justify-between px-4 mx-auto lg:gap-2">
                <div className="flex flex-col items-center justify-center mb-4 text-sm md:text-base md:mb-0 md:block">
                    Auction Tracking & Accounting System By &nbsp;<a href="https://www.webmaster.com.jo/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Jordan Webmaster™</a>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>All rights reserved © 2024</div>
                        <div className="flex flex-col sm:flex-row">
                            <div>For support</div>
                            <div><a href="https://wa.me/962799504930" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2 text-green-400 hover:text-green-300">
                                <FaWhatsapp className="mr-1" />+962799504930 </a></div></div>
                </div>
            </div>
        </footer>


    </div>
    );



}
