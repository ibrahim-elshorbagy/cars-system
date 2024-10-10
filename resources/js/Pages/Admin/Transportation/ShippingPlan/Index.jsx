// resources/js/Pages/Admin/Transportation/ShippingPlan/Index.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function ShippingPlanIndex({ site_settings, auth, destinations }) {
    // State for active Destination Tab
    const [activeTab, setActiveTab] = useState(destinations.length > 0 ? destinations[0].name : '');




    //-----------------------------------------------------------------------------------

    // State to track which city row is being edited
    const [editingRowKey, setEditingRowKey] = useState(null); // Unique key for the row being edited

    // Initialize useForm for individual editing
    const {
        data: editData,
        setData: setEditData,
        post: savePost,
        processing: saveProcessing,
        errors: saveErrors,
        reset: saveReset,
    } = useForm({
        shipping_plan_id: null,
        port_id: null,
        destination_id: null,
        city_id: null,
        shipping_fee: '',
    });

    /**
     * Generate a unique key for each row based on port_id, destination_id, and city_id
     */
    const generateRowKey = (port_id, destination_id, city_id) => {
        return `${port_id}_${destination_id}_${city_id}`;
    };

    /**
     * Handle Edit button click
     */
    const handleEditClick = (port, destination, city) => {
        const rowKey = generateRowKey(port.id, destination.id, city.id);
        setEditingRowKey(rowKey);
        setEditData({
            shipping_plan_id: city.shipping_plan_id,
            port_id: port.id,
            destination_id: destination.id,
            city_id: city.id,
            shipping_fee: city.shipping_fee,
        });
    };

    /**
     * Handle Cancel button click
     */
    const handleCancelClick = () => {
        setEditingRowKey(null);
        saveReset();
    };

    /**
     * Handle Save button click
     */
    const handleSaveClick = (e) => {
        e.preventDefault();

        // Validate the shipping_fee before sending
        if (editData.shipping_fee === '' || isNaN(editData.shipping_fee) || editData.shipping_fee < 0) {
            alert('الرجاء ادخال قيمة صحيحة'); // "Please enter a valid value" in Arabic
            return;
        }

        // Submit the form data to 'update-single' route
        savePost(route('shipping-prices.update'), {
            onSuccess: () => {
                setEditingRowKey(null);
                saveReset();


            },
            onError: () => {
            },
        });
    };

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
                        <div className="px-3 py-4 ">
                            <form onSubmit={handleSaveClick}>
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
                                                className="w-full mt-4 "
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
                                                                    placeholder="بحث بالاسم" // "Search by name"
                                                                    onChange={(e) => handleFilterChange(port.id, e.target.value)}
                                                                    className="block w-64 mt-2" // Smaller width (8rem)
                                                                />
                                                                {/* Optional: Display validation error if any */}
                                                                {saveErrors.city_name_filter && (
                                                                    <InputError message={saveErrors.city_name_filter} className="mt-1" />
                                                                )}
                                                            </div>

                                                            {/* Table for Cities */}
                                                            <div className='overflow-auto'>
                                                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                                                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th className="p-3 text-xs w-fit text-nowrap md:text-base">ID</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base md:w-96">Shipping Price USD</th>
                                                                        <th className="p-3 text-xs text-nowrap md:text-base md:w-32">Code</th>
                                                                        <th className="p-3 text-xs text-left text-nowrap md:text-base min-w-28 md:w-96">City</th>
                                                                        <th className="p-3 text-xs text-left text-nowrap md:text-base">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {port.cities
                                                                        .filter(city => {
                                                                            const filter = cityNameFilters[port.id] || '';
                                                                            return city.name.toLowerCase().includes(filter.toLowerCase());
                                                                        })
                                                                        .map((city, index) => {
                                                                            const rowKey = generateRowKey(port.id, destination.id, city.id);
                                                                            const isEditing = editingRowKey === rowKey;

                                                                            return (
                                                                                <tr key={city.id}
                                                                                    className={`${
                                                                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                                                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}>

                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.id}</td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">
                                                                                        {isEditing ? (
                                                                                            <>
                                                                                                <input
                                                                                                    type="number"
                                                                                                    step="0.01"
                                                                                                    value={editData.shipping_fee}
                                                                                                    onChange={(e) => setEditData('shipping_fee', e.target.value)}
                                                                                                    className="w-full p-1 border rounded"
                                                                                                />
                                                                                                {saveErrors.shipping_fee && (
                                                                                                    <InputError message={saveErrors.shipping_fee} className="mt-1" />
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <span>{Number(city.shipping_fee).toFixed(2)}</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="p-3 text-xs text-nowrap md:text-base">{city.code}</td>
                                                                                    <td className="p-3 text-xs text-left text-nowrap md:text-base">{city.name}</td>

                                                                                    <td className="p-3 text-xs text-left text-nowrap md:text-base" >
                                                                                        {isEditing ? (
                                                                                            <div className='flex justify-end gap-2'>
                                                                                                <button
                                                                                                    type="submit"
                                                                                                    disabled={saveProcessing}
                                                                                                    className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                                                                                                >
                                                                                                    {saveProcessing ? 'حفظ...' : 'حفظ'}
                                                                                                </button>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={handleCancelClick}
                                                                                                    className="px-2 py-1 text-white bg-gray-600 rounded hover:bg-gray-700"
                                                                                                >
                                                                                                    الغاء
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => handleEditClick(port, destination, city)}
                                                                                                className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                                                                                            >
                                                                                                تعديل
                                                                                            </button>
                                                                                        )}
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
