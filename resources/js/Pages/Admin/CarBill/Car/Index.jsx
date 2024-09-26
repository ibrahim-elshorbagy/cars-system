import React, { useState, useEffect } from "react";
import { Head,Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import SelectInput from "@/Components/SelectInput";
import { FiLock } from 'react-icons/fi';

import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import Input from "@/Components/ui/input";


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs"


export default function Index({ auth,site_settings, cars,customers, makes,models,vendors,destinations,lines,facilities,terminals,shipStatus, queryParams = null, success,ErrorAlert,danger }) {
  queryParams = queryParams || {};

    useEffect(() => {
     if (ErrorAlert) {
         alert(ErrorAlert); // Display the error message in an alert
     }
    }, [ErrorAlert]);


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [visibleSuccess, setVisibleSuccess] = useState(success);
  const [operationPerformed, setOperationPerformed] = useState(false);

    useEffect(() => {
    if (success && operationPerformed) {
        setVisibleSuccess(success);
        const timer = setTimeout(() => {
        setVisibleSuccess(null);
        setOperationPerformed(false);
        }, 3000);
        return () => clearTimeout(timer);
    }
    }, [success, operationPerformed]);




  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;

    router.get(route("car.index"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key === "Enter") {
      searchFieldChanged(name, e.target.value);
    }
  };
//------------------------------------------------------- Handel delete
  const [visibleDanger, setVisibleDanger] = useState(danger);
  useEffect(() => {
    if (danger) {
      setVisibleDanger(danger);
      const timer = setTimeout(() => {
        setVisibleDanger(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [danger]);



  const deleteCar = (car) => {
    if (window.confirm("هل انت متأكد من حذف السياره ؟ ")) {
      router.delete(route("car.destroy", car.id), {
        onSuccess: (page) => {
            setOperationPerformed(true);
            setVisibleSuccess(page.props.success);
            setVisibleDanger(page.props.danger);        },
      });
    }
  };
    //------------------------------------------------------- Handel images + create submit
    const [CreateImages, setCreateImages] = useState([]); // For previewing images

    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        errors: createErrors,
        reset: createReset,
    } = useForm({
        images: [],
    });


        const toggleCreateModal = () => {
            setCreateImages([]);
        setIsCreateModalOpen(!isCreateModalOpen);
        if (!isCreateModalOpen) {
        createReset();
        }

    };



    // Handle Carfax Report upload
    const handleCarfaxReportChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        setCreateData("carfax_report", file); // Store file in form data
    };

    // Handle image file selection
    const handleCreateImageSelect = (event) => {
        const files = Array.from(event.target.files); // Convert files list to array

        const selectedImages = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file), // Create a URL for preview
        }));

        setCreateImages((prevImages) => [...prevImages, ...selectedImages]);
        setCreateData("images", [...createData.images, ...files]); // Add files to form data
    };


    // Delete image from preview and form data
    const deleteImageOnCreation = (index) => {
        setCreateImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove from preview
        const newImageFiles = [...createData.images];
        newImageFiles.splice(index, 1); // Remove from form data
        setCreateData("images", newImageFiles); // Update form data
    };


  const handleCreateCar = (e) => {
    e.preventDefault();
    createPost(route("car.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };
//------------------------------------------------------- Handel images + Update submit
    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        errors: editErrors,
        reset: editReset,
    } = useForm({

        _method: "PUT",
    });

    const [editOldImages, setEditOldImages] = useState([]);  // Store old image URLs
    const [editNewImages, setEditNewImages] = useState([]);  // Store newly added image files

    const toggleEditModal = (car = null) => {
        if (car) {
            setEditNewImages([]);
      setEditingCar(car);
      setEditData({
            id: car.id,
            user_id: car.user_id,
            box_id: car.box_id,
            chassis: car.chassis,
            title: car.title,
            keys: car.keys,
            lot: car.lot,
            bookingNo:car.bookingNo,
            container_number:car.container_number,
            color:car.color,
            year:car.year,
            vendor_id: car.vendor_id,
            destination_id: car.destination_id,
            line_id: car.line_id,
            terminal_id: car.terminal_id,
            make_id: car.make_id,
            model_id: car.model_id,
            facility_id: car.facility_id,
            carfax_report: car.carfax_report,
            ship_status: car.ship_status,
            won_price: car.won_price,
            shipping_cost: car.shipping_cost,
            estimate_arrival_date: car.estimate_arrival_date,
            arrival_date: car.arrival_date,
            date_won: car.date_won,
            images: [],
            old_images_url: car.images,

            _method: "PUT",
      });
    setEditOldImages(car.images);
    } else {
      setEditingCar(null);
      editReset();
    }
    setIsEditModalOpen(!isEditModalOpen);
  };






    // Handle new image selection
    const handleEditImageSelect = (event) => {
        const files = Array.from(event.target.files);  // Convert files list to array

        const selectedImages = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),  // Create a URL for preview
        }));

        setEditNewImages((prevImages) => [...prevImages, ...selectedImages]);
        setEditData("images", [...editData.images, ...files]);  // Add files to form data
    };

    // Delete old image
    const deleteOldImage = (index) => {
        setEditOldImages((prevImages) => prevImages.filter((_, i) => i !== index));  // Remove from preview
        const newImageUrls = [...editOldImages];
        newImageUrls.splice(index, 1);  // Remove from form data
        setEditData("old_images_url", newImageUrls);  // Update form data
    };

    // Delete new image
    const deleteNewImage = (index) => {
        setEditNewImages((prevImages) => prevImages.filter((_, i) => i !== index));  // Remove from preview
        const newImageFiles = [...editData.images];
        newImageFiles.splice(index, 1);  // Remove from form data
        setEditData("images", newImageFiles);  // Update form data
    };


  const handleEditCar = (e) => {
    e.preventDefault();
    editPost(route("car.update", editingCar.id), {
      onSuccess: () => {
        editReset();
            toggleEditModal();
        setOperationPerformed(true);

      },
    });
  };

  return (
    <AuthenticatedLayout
          user={auth.user}
          site_settings={site_settings}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            السيارات
          </h2>
          {auth.user.permissions.includes("create-car") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              إضافة سياره
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"السيارات"} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
                                      {visibleDanger && (
            <div className="px-4 py-2 mb-4 text-white bg-red-600 rounded">
              {visibleDanger}
            </div>
          )}
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">اسم العميل</th>
                      <th className="px-3 py-3">رقم الشاسيه</th>
                      <th className="px-3 py-3">اضافه بواسطه</th>
                      <th className="px-3 py-3">تحديث بواسطه</th>
                      <th className="px-3 py-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.customer_name}
                          placeholder={"اسم العميل"}
                          onBlur={(e) => searchFieldChanged("customer_name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("customer_name", e)}
                        />
                        </th>
                        <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.chassis}
                          placeholder={"رقم الشاسيه"}
                          onBlur={(e) => searchFieldChanged("chassis", e.target.value)}
                          onKeyPress={(e) => onKeyPress("chassis", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars && cars.data.length > 0 ? (
                      cars.data.map((car) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={car.id}
                        >
                          <td className="px-3 py-2">{car.id}</td>
                          <td className="px-3 py-2 text-nowrap">{car.customer_name}</td>
                          <td className="px-3 py-2 text-nowrap">{car.chassis}</td>
                          <td className="px-3 py-2 text-nowrap">{car.created_by}</td>
                          <td className="px-3 py-2 text-nowrap">{car.updated_by}</td>
                          <td className="flex justify-center gap-2 px-3 py-2 text-center">
                            {auth.user.permissions.includes("update-car") && (
                              <button
                                onClick={() => toggleEditModal(car)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}

                                {auth.user.permissions.includes("delete-car") && (
                                    car.cant ? (
                                        <div className="flex items-center">
                                        <FiLock className="text-red-600" /> {/* Lock icon */}
                                        <span className="ml-2 text-red-600 dark:text-red-500"></span> {/* Display "Locked" */}
                                        </div>
                                    ) : (
                                        <button
                                        onClick={() => deleteCar(car)}
                                        className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                        >
                                        حذف
                                        </button>
                                    )
                                )}

                            <Link
                                href={route("car.show", car.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                            >
                            مشاهده
                            </Link>

                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center">
                          لا يوجد سيارات
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {cars && <Pagination links={cars.meta.links} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new car */}
      {isCreateModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

            <form onSubmit={handleCreateCar} className="relative w-10/12 overflow-y-auto transition-all duration-300 ease-in-out transform bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">
                <Tabs defaultValue="general" >
                    <TabsList className="sticky top-0 z-10 flex p-4 bg-white border-b justify-content dark:bg-gray-800">
                        <div>
                        <TabsTrigger bsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="shipping">shipping</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        </div>

                        <h2 className="text-2xl font-semibold dark:text-white">إضافة سياره</h2>

                    </TabsList>

                    <TabsContent value="general">
                    <div className="flex flex-col justify-between h-[85vh] overflow-auto">

                        <div className="p-6 ">
                            {/*  Customer Chassis bookingNo */}
                            <div className="grid items-center justify-center grid-cols-6 gap-5 my-10 ">
                                <div className="flex col-span-2 gap-5">
                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="user_id" value={"العميل"} />
                                    <ComboboxMakes
                                        items={customers}
                                        onItemSelect={(item) => setCreateData("user_id", item.id)}
                                        placeholder="اختر العميل"
                                        emptyMessage="لا يوجد عملاء"
                                        />
                                    <InputError message={'*'} className="mt-2 text-xl" />
                                </div>

                                <div className="flex col-span-2 gap-5">
                                    <InputLabel htmlFor="chassis" className="mt-2 text-xl text-nowrap" value={"رقم الشاسي"} />
                                    <TextInput
                                        id="chassis"
                                        type="text"
                                        name="chassis"
                                        value={createData.chassis}
                                        className="block w-full mt-1"
                                        onChange={(e) => setCreateData("chassis", e.target.value)}
                                    />
                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                    {/* <InputError message={createErrors.chassis} className="mt-2" /> */}
                                </div>
                            </div>



                            {/* Color Year Keys Title  */}
                            <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">

                                    <div className="flex col-span-2 gap-5">
                                      <InputLabel htmlFor="color" className="mt-2 text-xl text-nowrap" value={"لون السياره"} />

                                        <TextInput
                                            id="color"
                                            type="text"
                                            name="color"
                                            value={createData.color}
                                            className="block w-full mt-1"
                                            onChange={(e) => setCreateData("color", e.target.value)}
                                        />
                                        <InputError message={'*'} className="mt-2 text-xl"  />
                                    </div>
                                        <div className="flex col-span-2 gap-5">
                                        <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="year" value="السنه" />
                                        <TextInput
                                            type="number"
                                            id={`year`}
                                            name="year"
                                            value={createData.year}

                                            className="block w-full mt-1"
                                            onChange={(e) => setCreateData('year',e.target.value)}
                                        />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                  </div>
                                  <div>
                                        <div className="flex gap-5">
                                        <InputLabel className="text-xl" htmlFor="keys" value="keys" />
                                        <Input
                                            type="checkbox"
                                            id={`keys`}
                                            className="w-6 h-6 rounded mt-0.5"
                                            onChange={(e) => setCreateData('keys', e.target.checked ? 1 : 0)}
                                        />
                                            <InputError message={'*'} className="mt-1 text-xl"  />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex gap-5">
                                        <InputLabel className="text-xl" htmlFor="title" value="Title" />
                                        <Input
                                            type="checkbox"
                                            id={`title`}
                                            className="w-6 h-6 rounded mt-0.5"
                                            onChange={(e) => setCreateData('title', e.target.checked ? 1 : 0)}
                                        />
                                            <InputError message={'*'} className="mt-1 text-xl"  />
                                        </div>
                                    </div>
                              </div>




                              {/* Makes + Model */}

                            <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                    <div className="flex col-span-3 gap-5">
                                        <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="make_id" value={"(Make) المركه"} />

                                        <ComboboxMakes
                                            items={makes}
                                            onItemSelect={(item) => setCreateData("make_id", item.id)}
                                            placeholder="اختر المركه"
                                            emptyMessage="لا يوجد مركات"
                                            />
                                        <InputError message={'*'} className="mt-2 text-xl" />
                                    </div>

                                    <div className="flex col-span-3 gap-5">
                                        <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="model_id" value={"(Model) الموديل"} />

                                        <ComboboxMakes
                                            items={models}
                                            onItemSelect={(item) => setCreateData("model_id", item.id)}
                                            placeholder="اختر المرفق"
                                            emptyMessage="لا يوجد مرافق"
                                            />
                                        <InputError message={'*'} className="mt-2 text-xl" />
                                    </div>

                              </div>



                            {/* PDF Upload */}

                            <div className="flex col-span-2 gap-5 w-fit">
                                <InputLabel htmlFor="carfax_report" className="mt-2 text-xl text-nowrap" value={"Carfax Report"} />
                                <Input
                                    id="date_won"
                                    type="file"
                                    name="carfax_report"
                                    className="block w-full mt-1"

                                    onChange={handleCarfaxReportChange}
                                />
                                <InputError message={createErrors.carfax_report} className="mt-2" />
                            </div>



                            <div>
                                <ul className="mt-2 text-red-600 list-disc list-inside">
                                    {Object.keys(createErrors).map((key) => (
                                        <li key={key}>{createErrors[key]}</li>
                                    ))}
                                </ul>
                            </div>




                        </div>

                        <div className="flex justify-end m-5">
                                <button
                                    type="button"
                                    onClick={toggleCreateModal}
                                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                >
                                    إلغاء
                                </button>
                        </div>
                    </div>

                    </TabsContent>
                    <TabsContent value="shipping">
                        <div className=" flex flex-col justify-between h-[85vh] overflow-auto">

                                <div className="p-6">
                                {/* Vendor + Destination + Shipping Line */}

                                    <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">
                                        <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="lot" className="mt-2 text-xl text-nowrap" value={"lot/Sotok"} />
                                                    <TextInput
                                                        id="lot"
                                                        type="text"
                                                        name="lot"
                                                        value={createData.lot}
                                                        className="block w-full mt-1"
                                                        onChange={(e) => setCreateData("lot", e.target.value)}
                                                    />
                                                    <InputError message={'*'} className="mt-2 text-xl" />
                                        </div>

                                        <div className="flex col-span-2 gap-5">
                                                <InputLabel htmlFor="bookingNo" className="mt-2 text-xl text-nowrap" value={"bookingNo"} />
                                                <TextInput
                                                    id="bookingNo"
                                                    type="text"
                                                    name="bookingNo"
                                                    value={createData.bookingNo}
                                                    className="block w-full mt-1"
                                                    onChange={(e) => setCreateData("bookingNo", e.target.value)}
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                        <div className="flex col-span-2 gap-5">
                                                <InputLabel htmlFor="container_number" className="mt-2 text-xl text-nowrap" value={"Container Number"} />
                                                <TextInput
                                                    id="container_number"
                                                    type="text"
                                                    name="container_number"
                                                    value={createData.container_number}
                                                    className="block w-full mt-1"
                                                    onChange={(e) => setCreateData("container_number", e.target.value)}
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                    </div>

                                <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="vendor_id" value={"(Vendor) المزاد"} />

                                            <ComboboxMakes
                                                items={vendors}
                                                onItemSelect={(item) => setCreateData("vendor_id", item.id)}
                                                placeholder="اختر الماز"
                                                emptyMessage="لا يوجد مزادات"
                                                />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="destination_id" value={"(Destination) الوجه"} />

                                            <ComboboxMakes
                                                items={destinations}
                                                onItemSelect={(item) => setCreateData("destination_id", item.id)}
                                                placeholder="اختر الوجه"
                                                emptyMessage="لا يوجد وحهات"
                                                />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="line_id" value={"(Shipping line) الخط الملاحي"} />

                                            <ComboboxMakes
                                                items={lines}
                                                onItemSelect={(item) => setCreateData("line_id", item.id)}
                                                placeholder="اختر الخط الملاحي"
                                                emptyMessage="لا يوجد خطوط ملاحيه"
                                                />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                </div>





                                    {/* Facility + Terminal */}

                                <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                    <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="facility_id" value={"(Facility) المرفق"} />

                                            <ComboboxMakes
                                                items={facilities}
                                                onItemSelect={(item) => setCreateData("facility_id", item.id)}
                                                placeholder="اختر المرفق"
                                                emptyMessage="لا يوجد مرافق"
                                                />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="terminal_id" value={"(Terminal) محطة الشحن"} />

                                            <ComboboxMakes
                                                items={terminals}
                                                onItemSelect={(item) => setCreateData("terminal_id", item.id)}
                                                placeholder="اختر محطة الشحن"
                                                emptyMessage="لا يوجد محطات شحن"
                                                />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>


                                    </div>






                                    {/* Dates */}

                                    <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">
                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="date_won" className="mt-2 text-xl text-nowrap" value={"تاريخ الشراء "} />
                                            <TextInput
                                                id="date_won"
                                                type="date"
                                                name="date_won"
                                                value={createData.date_won}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("date_won", e.target.value)}
                                            />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                        </div>
                                    <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="estimate_arrival_date" className="mt-2 text-xl text-nowrap" value={"تاريخ الوصول المقدر"} />
                                            <TextInput
                                                id="estimate_arrival_date"
                                                type="date"
                                                name="estimate_arrival_date"
                                                value={createData.estimate_arrival_date}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("estimate_arrival_date", e.target.value)}
                                            />
                                            <InputError message={'*'} className="mt-2 text-xl"  />
                                    </div>
                                    <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="arrival_date" className="mt-2 text-xl text-nowrap" value={"تاريخ الوصول"} />
                                            <TextInput
                                                id="arrival_date"
                                                type="date"
                                                name="arrival_date"
                                                value={createData.arrival_date}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("arrival_date", e.target.value)}
                                            />
                                            <InputError message={'*'} className="mt-2 text-xl" />
                                    </div>
                                    </div>


                                {/* Won Price  --  Shipping Cost */}


                                <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">

                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="won_price" className="mt-2 text-xl text-nowrap" value={"(Won Price) سعر الشراء "} />
                                            <TextInput
                                                id="won_price"
                                                type="number"
                                                name="won_price"
                                                value={createData.won_price}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("won_price", e.target.value)}
                                            />
                                            <InputError  message={'*'} className="mt-2 text-xl"  />
                                        </div>

                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="shipping_cost" className="mt-2 text-xl text-nowrap" value={"(Shipping Cost) سعر النقل"} />
                                            <TextInput
                                                id="shipping_cost"
                                                type="number"
                                                name="shipping_cost"
                                                value={createData.shipping_cost}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("shipping_cost", e.target.value)}
                                            />
                                            <InputError  message={'*'} className="mt-2 text-xl" />
                                        </div>

                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="ship_status" value={" (ship Status) حالة الشحن"} />
                                            <SelectInput
                                                id="ship_status"
                                                name="ship_status"
                                                value={createData.ship_status || ""}
                                                onChange={(e) => setCreateData("ship_status", e.target.value)}
                                            >
                                                <option value="">اختر</option>

                                                {shipStatus.map((box) => (
                                                <option value={box.name} key={box.id}>
                                                    {box.name}
                                                </option>
                                                ))}
                                            </SelectInput>
                                            <InputError  message={'*'} className="mt-2 text-xl" />
                                        </div>


                                    </div>

                                    <div>
                                        <ul className="mt-2 text-red-600 list-disc list-inside">
                                            {Object.keys(createErrors).map((key) => (
                                                <li key={key}>{createErrors[key]}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>





                                <div className="flex justify-end m-5">
                                    <button
                                        type="button"
                                        onClick={toggleCreateModal}
                                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        إلغاء
                                    </button>
                                  </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="photos">
                    <div className="flex flex-col justify-between  h-[85vh] ">

                            <div className="p-6">

                                    <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">
                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="images" className="mt-2 text-xl text-nowrap" value={"images"} />
                                            <Input
                                                id="images"
                                                type="file"
                                                name="images"
                                                multiple
                                                className="block w-full mt-1"
                                                onChange={handleCreateImageSelect}
                                            />
                                            <InputError message={createErrors.images} className="mt-2" />
                                        </div>
                                    </div>
                                {/* Images Preview and Deletion */}
                                    <div className="gap-4 mt-4 columns-5">
                                        {CreateImages.map((image, index) => (
                                            <div key={index} className="relative mb-4 break-inside-avoid">
                                                <span
                                                    className="absolute text-3xl font-bold text-red-500 cursor-pointer top-3 left-3"
                                                    onClick={() => deleteImageOnCreation(index)}
                                                >
                                                    &times;
                                                </span>
                                                <img
                                                    className="w-full h-auto rounded-lg"
                                                    src={image.url}
                                                    alt={image.name}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                <div>
                                    <ul className="mt-2 text-red-600 list-disc list-inside">
                                        {Object.keys(createErrors).map((key) => (
                                            <li key={key}>{createErrors[key]}</li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                            <div className="flex justify-end gap-2 m-5">
                                    <button
                                        type="button"
                                        onClick={toggleCreateModal}
                                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                                    >
                                        حفظ
                                    </button>
                            </div>
                        </div>

                    </TabsContent>

                </Tabs>
            </form>

          </div>


      )}















      {/* Modal for editing a car */}
      {isEditModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleEditCar} className="relative w-10/12 max-h-screen overflow-y-auto transition-all duration-300 ease-in-out transform bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-in">

        <Tabs defaultValue="general" >
                <TabsList className="sticky top-0 z-10 flex p-4 bg-white border-b justify-content dark:bg-gray-800">
                    <div>
                    <TabsTrigger bsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>

                    </div>

                    <h2 className="text-2xl font-semibold dark:text-white">إضافة سياره</h2>

                </TabsList>

                <TabsContent value="general">
                    <div className=" flex flex-col justify-between h-[85vh] overflow-auto">

                                <div className="p-6 ">


                                {/*  Customer Chassis  */}

                                <div className="grid items-center justify-center grid-cols-6 gap-5 my-10 ">
                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="user_id" value={"العميل"} />
                                            <ComboboxMakes
                                                items={customers}
                                                onItemSelect={(item) => setEditData("user_id", item.id)}
                                                selectedMakeId={editData.user_id}
                                                placeholder="اختر العميل"
                                                emptyMessage="لا يوجد عملاء"
                                                />
                                            <InputError  message={'*'} className="mt-2 text-xl"  />
                                    </div>

                                        <div className="flex col-span-2 gap-5">
                                            <InputLabel htmlFor="edit_chassis" className="mt-2 text-xl text-nowrap" value={"رقم الشاسي"} />
                                            <TextInput
                                                id="edit_chassis"
                                                type="text"
                                                name="chassis"
                                                value={editData.chassis}
                                                className="block w-full mt-1"

                                                onChange={(e) => setEditData("chassis", e.target.value)}
                                            />
                                            {/* <InputError message={editErrors.chassis} className="mt-2" /> */}
                                            <InputError message={'*'} className="mt-2 text-xl" />
                                        </div>

                                </div>





                                    {/* Color Year Keys Title  */}


                                <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">

                                        <div className="flex col-span-2 gap-5">
                                        <InputLabel htmlFor="edit_color" className="mt-2 text-xl text-nowrap" value={"لون السياره"} />

                                            <TextInput
                                                id="edit_color"
                                                type="text"
                                                name="color"
                                                value={editData.color}

                                                className="block w-full mt-1"
                                                onChange={(e) => setEditData("color", e.target.value)}
                                            />
                                            <InputError  message={'*'} className="mt-2 text-xl" />
                                        </div>
                                            <div className="flex col-span-2 gap-5">
                                            <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="edit_year" value="السنه" />
                                            <TextInput
                                                type="number"
                                                id={`edit_year`}
                                                name="year"
                                                value={editData.year}


                                                className="block w-full mt-1"
                                                onChange={(e) => setEditData('year',e.target.value)}
                                            />
                                                <InputError  message={'*'} className="mt-2 text-xl" />
                                    </div>
                                    <div>
                                            <div className="flex gap-5">
                                            <InputLabel className="text-xl" htmlFor="edit_keys" value="مفاتيح" />
                                            <Input
                                                type="checkbox"
                                                id={`edit_keys`}
                                                checked={editData.keys == 1}

                                                className="w-6 h-6 rounded mt-0.5"
                                                onChange={(e) => setEditData('keys', e.target.checked ? 1 : 0)}
                                            />
                                                <InputError  message={'*'} className="mt-1 text-xl " />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex gap-5">
                                            <InputLabel className="text-xl" htmlFor="edit_title" value="title" />
                                            <Input
                                                type="checkbox"
                                                id={`edit_title`}
                                                checked={editData.title == 1}
                                                className="w-6 h-6 rounded mt-0.5"
                                                onChange={(e) => setEditData('title', e.target.checked ? 1 : 0)}
                                            />
                                                <InputError  message={'*'} className="mt-1 text-xl" />
                                            </div>
                                        </div>
                                </div>









                                {/* Makes + Model */}

                                <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_make_id" value={"(Make) المركه"} />

                                            <ComboboxMakes
                                                items={makes}
                                                onItemSelect={(item) => setEditData("make_id", item.id)}
                                                selectedMakeId={editData.make_id}

                                                placeholder="اختر المركه"
                                                emptyMessage="لا يوجد مركات"
                                                />
                                            <InputError  message={'*'} className="mt-2 text-xl" />
                                        </div>

                                        <div className="flex col-span-3 gap-5">
                                            <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_model_id" value={"(Model) الموديل"} />

                                            <ComboboxMakes
                                                items={models}
                                            onItemSelect={(item) => setEditData("model_id", item.id)}
                                                selectedMakeId={editData.model_id}

                                                placeholder="اختر المرفق"
                                                emptyMessage="لا يوجد مرافق"
                                                />
                                            <InputError  message={'*'} className="mt-2 text-xl"  />
                                        </div>

                                </div>






                                    {/* Upload */}





                                <div className="flex col-span-2 gap-5 w-fit">
                                    <InputLabel htmlFor="edit_carfax_report" className="mt-2 text-xl text-nowrap" value={"Carfax Report"} />
                                    <Input
                                        id="edit_carfax_report"
                                        type="file"
                                        name="carfax_report"
                                        className="block w-full mt-1"
                                        onChange={(e) => setEditData("carfax_report", e.target.files[0])}  // Store the file directly
                                    />
                                    <InputError message={editErrors.carfax_report} className="mt-2" />
                                </div>


                                <div>
                                    <ul className="mt-2 text-red-600 list-disc list-inside">
                                        {Object.keys(editErrors).map((key) => (
                                            <li key={key}>{editErrors[key]}</li>
                                        ))}
                                    </ul>
                                </div>



                                </div>

                                <div className="flex justify-end gap-2 m-5">

                                    <button
                                        type="button"
                                        onClick={() => toggleEditModal()}
                                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                                    >
                                        حفظ التغييرات
                                    </button>
                                </div>
                    </div>

                </TabsContent>
                <TabsContent value="shipping">

                            <div className="flex flex-col justify-between h-[85vh] overflow-auto">

                                <div className="p-6">

                                        <div className="grid items-center justify-center grid-cols-6 gap-5 my-10 ">

                                                <div className="flex col-span-2 gap-5">
                                                        <InputLabel htmlFor="edit_lot" className="mt-2 text-xl text-nowrap" value={"lot/Sotok"} />
                                                        <TextInput
                                                            id="edit_lot"
                                                            type="text"
                                                            name="lot"
                                                            value={editData.lot}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("lot", e.target.value)}
                                                        />
                                                        <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>
                                                <div className="flex col-span-2 gap-5">
                                                        <InputLabel htmlFor="edit_bookingNo" className="mt-2 text-xl text-nowrap" value={"bookingNo"} />
                                                        <TextInput
                                                            id="edit_bookingNo"
                                                            type="text"
                                                            name="bookingNo"
                                                            value={editData.bookingNo}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("bookingNo", e.target.value)}
                                                        />
                                                        <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>
                                                <div className="flex col-span-2 gap-5">
                                                        <InputLabel htmlFor="edit_container_number" className="mt-2 text-xl text-nowrap" value={"Container Number"} />
                                                        <TextInput
                                                            id="edit_container_number"
                                                            type="text"
                                                            name="container_number"
                                                            value={editData.container_number}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("container_number", e.target.value)}
                                                        />
                                                        <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>

                                                </div>



                                        {/* Vendor + Destination + Shipping Line */}

                                        <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                                <div className="flex col-span-3 gap-5">
                                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_vendor_id" value={"(Vendor) المزاد"} />

                                                    <ComboboxMakes
                                                        items={vendors}
                                                        onItemSelect={(item) => setEditData("vendor_id", item.id)}
                                                        selectedMakeId={editData.vendor_id}

                                                        placeholder="اختر الماز"
                                                        emptyMessage="لا يوجد مزادات"
                                                        />
                                                    <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>
                                                <div className="flex col-span-3 gap-5">
                                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_destination_id" value={"(Destination) الوجه"} />

                                                    <ComboboxMakes
                                                        items={destinations}
                                                    onItemSelect={(item) => setEditData("destination_id", item.id)}
                                                        selectedMakeId={editData.destination_id}

                                                        placeholder="اختر الوجه"
                                                        emptyMessage="لا يوجد وحهات"
                                                        />
                                                    <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>
                                                <div className="flex col-span-3 gap-5">
                                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_line_id" value={"(Shipping line) الخط الملاحي"} />

                                                    <ComboboxMakes
                                                        items={lines}
                                                    onItemSelect={(item) => setEditData("line_id", item.id)}
                                                        selectedMakeId={editData.line_id}

                                                        placeholder="اختر الخط الملاحي"
                                                        emptyMessage="لا يوجد خطوط ملاحيه"
                                                        />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                                </div>

                                        </div>



                                        {/* Facility + Terminal */}


                                        <div className="grid items-center justify-center grid-cols-9 gap-5 mb-10 ">
                                            <div className="flex col-span-3 gap-5">
                                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_facility_id" value={"(Facility) المرفق"} />

                                                    <ComboboxMakes
                                                        items={facilities}
                                                    onItemSelect={(item) => setEditData("facility_id", item.id)}
                                                        selectedMakeId={editData.facility_id}

                                                        placeholder="اختر المرفق"
                                                        emptyMessage="لا يوجد مرافق"
                                                        />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                                </div>
                                                <div className="flex col-span-3 gap-5">
                                                    <InputLabel className="mt-1 text-xl text-nowrap" htmlFor="edit_terminal_id" value={"(Terminal) محطة الشحن"} />

                                                    <ComboboxMakes
                                                        items={terminals}
                                                    onItemSelect={(item) => setEditData("terminal_id", item.id)}
                                                        selectedMakeId={editData.terminal_id}

                                                        placeholder="اختر محطة الشحن"
                                                        emptyMessage="لا يوجد محطات شحن"
                                                        />
                                                    <InputError  message={'*'} className="mt-2 text-xl" />
                                                </div>


                                        </div>



                                        {/* Dates */}


                                        <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">
                                                <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="edit_date_won" className="mt-2 text-xl text-nowrap" value={"تاريخ الشراء "} />
                                                    <TextInput
                                                        id="edit_date_won"
                                                        type="date"
                                                        name="date_won"
                                                        value={editData.date_won}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("date_won", e.target.value)}
                                                    />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                                </div>
                                            <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="edit_estimate_arrival_date" className="mt-2 text-xl text-nowrap" value={"تاريخ الوصول المقدر"} />
                                                    <TextInput
                                                        id="edit_estimate_arrival_date"
                                                        type="date"
                                                        name="estimate_arrival_date"
                                                        value={editData.estimate_arrival_date}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("estimate_arrival_date", e.target.value)}
                                                    />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                            </div>
                                            <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="edit_arrival_date" className="mt-2 text-xl text-nowrap" value={"تاريخ الوصول"} />
                                                    <TextInput
                                                        id="edit_arrival_date"
                                                        type="date"
                                                        name="arrival_date"
                                                        value={editData.arrival_date}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("arrival_date", e.target.value)}
                                                    />
                                                    <InputError  message={'*'} className="mt-2 text-xl" />
                                            </div>
                                        </div>


                                        {/* Won Price  --  Shipping Cost */}


                                        <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">

                                                <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="edit_won_price" className="mt-2 text-xl text-nowrap" value={"(Won Price) سعر الشراء "} />
                                                    <TextInput
                                                        id="edit_won_price"
                                                        type="number"
                                                        name="won_price"
                                                        value={editData.won_price}
                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("won_price", e.target.value)}
                                                    />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                                </div>

                                                <div className="flex col-span-2 gap-5">
                                                    <InputLabel htmlFor="edit_shipping_cost" className="mt-2 text-xl text-nowrap" value={"(Shipping Cost) سعر النقل"} />
                                                    <TextInput
                                                        id="edit_shipping_cost"
                                                        type="number"
                                                        name="shipping_cost"
                                                        className="block w-full mt-1"
                                                        value={editData.shipping_cost}
                                                        onChange={(e) => setEditData("shipping_cost", e.target.value)}
                                                    />
                                                    <InputError  message={'*'} className="mt-2 text-xl"  />
                                                </div>

                                                <div className="flex col-span-2 gap-5">
                                                    <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="ship_status" value={" (ship Status) حالة الشحن"} />
                                                    <SelectInput
                                                        id="ship_status"
                                                        name="ship_status"
                                                        value={editData.ship_status || ""}
                                                        onChange={(e) => setEditData("ship_status", e.target.value)}
                                                    >
                                                        <option value="">اختر</option>

                                                        {shipStatus.map((box) => (
                                                        <option value={box.name} key={box.id}>
                                                            {box.name}
                                                        </option>
                                                        ))}
                                                    </SelectInput>
                                                    <InputError message={'*'} className="mt-2 text-xl"  />
                                                </div>

                                                </div>

                                        <div>
                                            <ul className="mt-2 text-red-600 list-disc list-inside">
                                                {Object.keys(editErrors).map((key) => (
                                                    <li key={key}>{editErrors[key]}</li>
                                                ))}
                                            </ul>
                                        </div>


                                </div>

                                <div className="flex justify-end gap-2 m-5">

                                    <button
                                        type="button"
                                        onClick={() => toggleEditModal()}
                                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                                    >
                                        حفظ التغييرات
                                    </button>
                                </div>

                            </div>

                </TabsContent>

                <TabsContent value="photos">
                    <div className="flex flex-col justify-between h-[85vh] overflow-auto">

                                  <div className="p-6">
                                        <div className="grid items-center justify-center grid-cols-6 gap-5 mb-10 ">

                                            <div className="flex col-span-2 gap-5">
                                                <InputLabel htmlFor="edit_images" className="mt-2 text-xl text-nowrap" value={"images"} />
                                                <Input
                                                    id="edit_images"
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    className="block w-full mt-1"
                                                    onChange={handleEditImageSelect}
                                                />
                                                <InputError message={editErrors.images} className="mt-2" />
                                            </div>
                                        </div>

                                            {/* Preview Old Images */}
                                            <div className="gap-4 columns-5">
                                                {editOldImages.map((image, index) => (
                                                    <div key={index} className="relative mb-4 break-inside-avoid">
                                                        <span
                                                            className="absolute text-3xl font-bold text-red-500 cursor-pointer top-3 left-3"
                                                            onClick={() => deleteOldImage(index)}  // Delete old image
                                                        >
                                                            &times;
                                                        </span>
                                                        <img className="w-full h-auto rounded-lg" src={image} alt={`Car Image ${index + 1}`} />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Preview New Images */}
                                            <div className="gap-4 mt-5 columns-5">
                                                {editNewImages.map((image, index) => (
                                                    <div key={index} className="relative mb-4 break-inside-avoid">
                                                        <span
                                                            className="absolute text-3xl font-bold text-red-500 cursor-pointer top-3 left-3"
                                                            onClick={() => deleteNewImage(index)}  // Delete new image
                                                        >
                                                            &times;
                                                        </span>
                                                        <img className="w-full h-auto rounded-lg" src={image.url} alt={image.name} />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <ul className="mt-2 text-red-600 list-disc list-inside">
                                                    {Object.keys(editErrors).map((key) => (
                                                        <li key={key}>{editErrors[key]}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                    </div>

                                    <div className="flex justify-end gap-2 m-5">

                                        <button
                                            type="button"
                                            onClick={() => toggleEditModal()}
                                            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                        >
                                            إلغاء
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white rounded bg-burntOrange hover:bg-burntOrangeHover"
                                        >
                                            حفظ التغييرات
                                                    </button>

                                    </div>



                    </div>



                </TabsContent>
        </Tabs>



            </form>


        </div>
      )}
    </AuthenticatedLayout>
  );
}

// Combobox for selecting makes
function ComboboxMakes({ items, onItemSelect, placeholder, selectedMakeId, emptyMessage }) {
  const [open, setOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState(selectedMakeId ? items.find((item) => item.id === selectedMakeId) : null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedMake ? selectedMake.name : placeholder}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="ابحث ..." />
          <CommandList>
            {items && items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items && items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      setSelectedMake(item);
                      onItemSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedMake?.id === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
