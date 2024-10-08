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
                        <div className="p-3 ">
                            {/* Tabs for Destinations */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="inline-block">
                                    {destinations.map((destination) => (
                                        <TabsTrigger className="text-xs md:text-base"  key={destination.id} value={destination.name}>
                                            {destination.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {/* Tabs Content for Each Destination */}
                                {destinations.map((destination) => (
                                    <TabsContent key={destination.id} value={destination.name}>
                                        {/* Accordion for Ports */}
                                        <Accordion
                                            type="multiple"

                                            defaultValue={destination.ports.map(port => `item-${port.id}`)}
                                            className="w-full mt-4"
                                        >
                                            <div  className="dark:text-white">
                                                    <span className="font-bold">{destination.name}</span>
                                            </div>

                                            {destination.ports.map((port) => (
                                                <AccordionItem key={port.id} value={`item-${port.id}`}>
                                                    <AccordionTrigger className="dark:text-white">{port.name}</AccordionTrigger>
                                                    <AccordionContent>
                                                        {/* Filter Input for City Name */}
                                                        <div className="mb-4">
                                                            <TextInput
                                                                id={`filter-${port.id}`}
                                                                type="text"
                                                                name="city_name_filter"
                                                                value={cityNameFilters[port.id] || ''}
                                                                placeholder="بحث بالاسم" // "Search by name"
                                                                onChange={(e) => handleFilterChange(port.id, e.target.value)}
                                                                className="block w-64 mt-1" // Smaller width
                                                            />
                                                        </div>

                                                        {/* Table for Cities */}
                                                        <div className='overflow-auto'>
                                                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                                                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base">ID</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base">City</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base">Code</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base">Shipping Fee ($)</th>
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
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.name}</td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.code}</td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">
                                                                                        <span>{Number(city.shipping_fee).toFixed(2)}</span>
                                                                                    </td>
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
