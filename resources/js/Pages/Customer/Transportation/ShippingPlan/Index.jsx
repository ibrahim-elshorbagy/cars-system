import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function CustomerShippingPlanIndex({ site_settings, auth, destinations, success, danger }) {
    // State for active Destination Tab
    const [activeTab, setActiveTab] = useState(destinations.length > 0 ? destinations[0].name : '');



    // State for city name filter per port
    const [cityNameFilters, setCityNameFilters] = useState({});

    /**
     * Handle city name filter change
     */
    const handleFilterChange = (portId, value) => {
        setCityNameFilters(prevFilters => ({
            ...prevFilters,
            [portId]: value,
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            site_settings={site_settings}
            header={<h2 className="text-xl font-semibold">اسعار الشحن (Shipping Prices)</h2>}
        >
            <div className="py-2">
                <div className="px-2 mx-auto">
                    {/* Shipping Plans Card */}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-900 sm:rounded-lg">
                        <div className="px-3 py-4">
                            {/* Tabs for Destinations */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    {/* <div className='mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white'>Destinations</div> */}
                                    <div className='relative'>
                                        <div className="absolute -top-3 left-5 px-3 py-0.5 bg-indigo-500 text-white text-sm font-semibold rounded-full">Destinations</div>
                                        <TabsList className="inline-block gap-4 p-5 rounded-lg shadow-lg bg-gradient-to-r from-indigo-200 to-purple-300 dark:from-gray-800 dark:to-gray-700">
                                            {destinations.map((destination) => (
                                                <TabsTrigger
                                                    className="px-4 py-2 m-1 text-xs font-bold text-indigo-600 transition-all bg-white border border-indigo-300 rounded-lg md:text-xl dark:bg-gray-800 dark:text-white dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                                                    key={destination.id}
                                                    value={destination.name}
                                                >
                                                    {destination.name}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>

                                {/* Tabs Content for Each Destination */}
                                {destinations.map((destination) => (
                                    <TabsContent key={destination.id} value={destination.name}>
                                        {/* Accordion for Ports */}
                                        <Accordion
                                            type="multiple"

                                            defaultValue={destination.ports.map(port => `item-${port.id}`)}
                                            className="w-full mt-4"
                                        >
                                            <div  className="my-2 text-left dark:text-white">
                                                    <span className="font-bold ">Destination : {destination.name}</span>
                                            </div>

                                            {destination.ports.map((port) => (
                                                <AccordionItem key={port.id} value={`item-${port.id}`}>
                                                    <AccordionTrigger className="justify-end gap-2 bg-blue-100 rounded-sm dark:bg-indigo-600 dark:text-white">Port : {port.name}</AccordionTrigger>

                                                    <AccordionContent>
                                                        {/* Filter Input for City Name */}
                                                        <div className="mb-4">
                                                            <TextInput
                                                                id={`filter-${port.id}`}
                                                                type="text"
                                                                name="city_name_filter"
                                                                value={cityNameFilters[port.id] || ''}
                                                                placeholder="بحث بالاسم"
                                                                onChange={(e) => handleFilterChange(port.id, e.target.value)}
                                                                className="block w-64 mt-2"
                                                            />
                                                        </div>

                                                        {/* Table for Cities */}
                                                        <div className='overflow-auto'>
                                                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                                                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base w-fit">ID</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base md:w-96">Shipping Price USD</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base md:w-32">Code</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base min-w-28 md:w-96">City</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {port.cities
                                                                        .filter(city => {
                                                                            const filter = cityNameFilters[port.id] || '';
                                                                            return city.name.toLowerCase().includes(filter.toLowerCase());
                                                                        })
                                                                        .map((city, index) => {
                                                                            return (
                                                                                <tr key={city.id}
                                                                                    className={`${
                                                                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                                                                    } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}>

                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.id}</td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">
                                                                                        <span>{Number(city.shipping_fee).toFixed(2)}</span>
                                                                                    </td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.code}</td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.name}</td>

                                                                                </tr>
                                                                            );
                                                                        })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
