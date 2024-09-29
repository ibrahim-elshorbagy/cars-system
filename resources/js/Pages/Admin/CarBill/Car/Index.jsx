
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



//------------------------------------------------------- Handel Search + msg

    queryParams = queryParams || {};

    useEffect(() => {
    if (ErrorAlert) {
        alert(ErrorAlert);
    }
    }, [ErrorAlert]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [visibleSuccess, setVisibleSuccess] = useState(success);
    const [visibleDanger, setVisibleDanger] = useState(danger);
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

    useEffect(() => {
        if (danger) {
        setVisibleDanger(danger);
        const timer = setTimeout(() => {
            setVisibleDanger(null);
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [danger]);



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

  const deleteCar = (car) => {
    if (window.confirm("هل انت متأكد من حذف السيارة ؟ ")) {
      router.delete(route("car.destroy", car.id), {
        onSuccess: (page) => {
            setOperationPerformed(true);
            setVisibleSuccess(page.props.success);
            setVisibleDanger(page.props.danger);        },
      });
    }
  };

//-------------------------------------------------------create submit
    const [CreateImages, setCreateImages] = useState([]); // For previewing images
    const [vin, setVin] = useState('');

    const { data: createData, setData: setCreateData, post: createPost, errors: createErrors, reset: createReset } =
        useForm({ images: [], make_id: 0, model_id: '', year: '', color: '', chassis: '', vin: '', });


    const toggleCreateModal = () => {

        setCreateImages([]);
        setIsCreateModalOpen(!isCreateModalOpen);

        if (!isCreateModalOpen) {
            createReset();
            setVin('');
        }

    };

    //------------------------------------------------------- Handel updloing images + pdf


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

// ------------------------------------------------------------------------------------------------------------ handel select make filter models

        const [selectedMakeId, setSelectedMakeId] = useState('');
        const [filteredModels, setFilteredModels] = useState([]);

            useEffect(() => {
            if (selectedMakeId) {
                const filtered = models.filter((model) => {
                return String(model.make_id) === String(selectedMakeId);
                });
                setFilteredModels(filtered);
            } else {
                setFilteredModels([]);
            }
            }, [selectedMakeId, models]);


    const handleMakeSelect = (item) => {

            setSelectedMakeId(item.id);
            setCreateData({
                    ...createData,
                    make_id: item.id,
                    model_id: ''
                });
        };

// ------------------------------------------------------------------------------------------------------------ handel search for make and model and year with VIN

  // Handle VIN input blur event and make a request to Laravel API route
    const handleVinBlur = () => {
    if (!vin) return;
    axios
        .post(route('get-car-info'), { vin })
        .then((response) => {
        const vinData = response.data.response[0];
        const { Make, Model, ModelYear, VIN } = vinData;

        // Ensure all values are properly initialized
        const makeEntry = makes.find((m) => m.name.toLowerCase() === Make.toLowerCase());
        const modelEntry = models.find((mod) => mod.name.toLowerCase() === Model.toLowerCase() && String(mod.make_id) === String(makeEntry?.id));

        // Set createData state properly
        setCreateData({
            ...createData,
            make_id: makeEntry ? makeEntry.id : '',
            model_id: modelEntry ? modelEntry.id : '',
            year: ModelYear || '',
            chassis: VIN || '',
        });

        setSelectedMakeId(makeEntry?.id);
        })
        .catch((error) => {
        console.error('Failed to retrieve VIN data', error);
        });
    };



// ------------------------------------------------------------------------------------------------------------ hnadel submit of creation
  const handleCreateCar = (e) => {
    e.preventDefault();
    createPost(route("car.store"), {
      onSuccess: () => {
        createReset();
        setVin('');
        toggleCreateModal();
        setOperationPerformed(true);

      },
    });
  };
    //------------------------------------------------------- Handel Update submit

    const {data: editData,setData: setEditData,post: editPost,errors: editErrors,reset: editReset,
    } = useForm({
        _method: "PUT",
    });

    const [editOldImages, setEditOldImages] = useState([]);  // Store old image URLs
    const [editNewImages, setEditNewImages] = useState([]);  // Store newly added image files
    const [editVin, setEditVin] = useState('');

    const toggleEditModal = (car = null) => {
        if (car) {
            editReset();
            setEditNewImages([]);
            setEditingCar(car);

            setEditData({
                    make_id: car.make_id,
                    model_id: car.model_id,
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

                    _method: "PUT", });

                setEditOldImages(car.images);
                setEditVin(car.chassis || '');
                setSelectedEditMakeId(car.make_id);
    } else {
      setEditingCar(null);
      editReset();
    }
    setIsEditModalOpen(!isEditModalOpen);
  };




//------------------------------------------------------- Handel update Upload images


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

//------------------------------------------------------------------------------------------------------------------ handel select make filter models


    const [selectedEditMakeId, setSelectedEditMakeId] = useState(editData.make_id || null);
    const [filteredEditModels, setFilteredEditModels] = useState([]);

    useEffect(() => {
    if (selectedEditMakeId) {
        const filtered = models.filter(model => String(model.make_id) === String(selectedEditMakeId));
        setFilteredEditModels(filtered);
    } else {
        setFilteredEditModels(models);
    }
    }, [selectedEditMakeId, models]);

    const handleEditMakeSelect = (item) => {

        setSelectedEditMakeId(item.id);
        setEditData({
                    ...editData,
                    make_id: item.id,
                    model_id: ''
                });

        // // Reset model selection when make changes, unless it's the initial load
        // if (String(item.id) !== String(editData.make_id)) {
        //     setEditData("model_id", null);
        // }
    };


//------------------------------------------------------------------------------------------------------------------ Handel Vin selection on edit

const handleEditVinBlur = () => {
  if (!editVin) return;

  axios
    .post(route('get-car-info'), { vin: editVin })
    .then((response) => {
        const vinData = response.data.response[0];
        const { Make, Model, ModelYear, VIN } = vinData;

        // Ensure all values are properly initialized
        const makeEntry = makes.find((m) => m.name.toLowerCase() === Make.toLowerCase());
        const modelEntry = models.find((mod) => mod.name.toLowerCase() === Model.toLowerCase() && String(mod.make_id) === String(makeEntry?.id));


      // Set editData state properly
      setEditData({
        ...editData,
        make_id: makeEntry ? makeEntry.id : '',
        model_id: modelEntry ? modelEntry.id : '',
        year: ModelYear || '',
        chassis: VIN || '',
      });
      setSelectedEditMakeId(makeEntry?.id);
    })
    .catch((error) => {
      console.error('Failed to retrieve VIN data for editing', error);
    });
};
//------------------------------------------------------------------------------------------------------------------ handle update submit


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
//------------------------------------------------------------------------------------------------------------------

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
              إضافة سيارة
            </button>
          )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +"السيارات"} />

      <div className="">
        <div className="mx-auto ">
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
          <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3">ID</th>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">رقم الشاسيه</th>
                      <th className="p-3">اضافه بواسطه</th>
                      <th className="p-3">تحديث بواسطه</th>
                      <th className="p-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.customer_name}
                          placeholder={"اسم العميل"}
                          onBlur={(e) => searchFieldChanged("customer_name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("customer_name", e)}
                        />
                        </th>
                        <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.chassis}
                          placeholder={"رقم الشاسيه"}
                          onBlur={(e) => searchFieldChanged("chassis", e.target.value)}
                          onKeyPress={(e) => onKeyPress("chassis", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars && cars.data.length > 0 ? (
                      cars.data.map((car,index) => (
                        <tr
                            className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
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
                    <TabsList className="sticky top-0 z-10 flex gap-4 p-4 bg-white border-b justify-content dark:bg-gray-800">
                        <h2 className="text-2xl font-semibold dark:text-white">إضافة سيارة</h2>

                        <div>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        </div>


                    </TabsList>

                    <TabsContent value="general">
                    <div className="flex flex-col justify-between h-[85vh] overflow-auto">

                        <div className="p-3 sm:p-6 ">
                            {/*  Customer Chassis bookingNo */}
                            <div className="grid items-center justify-center gap-5 my-10 md:grid-cols-2 sm:grid-cols-1 ">


                                         <div>
                                            <InputLabel className="text-xl text-nowrap" htmlFor="make_id" value="Make" />
                                            <div className="flex gap-5 mt-2">
                                            <ComboboxMakes
                                                items={makes}
                                                onItemSelect={handleMakeSelect}
                                                placeholder="اختر الماركه"
                                                emptyMessage="لا يوجد مركات"
                                                selectedMakeId={createData.make_id}
                                                value={createData.make_id || ''}

                                            />
                                            <InputError message={'*'} className="mt-2 text-xl" />
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel className="text-xl text-nowrap" htmlFor="model_id" value="Model" />
                                            <div className="flex gap-5 mt-2">
                                            <ComboboxMakes
                                                items={filteredModels}
                                                onItemSelect={(item) => setCreateData("model_id", item.id)}
                                                placeholder="اختر الموديل"
                                                emptyMessage="لا يوجد موديلات"
                                                disabled={!selectedMakeId}
                                                selectedMakeId={createData.model_id}
                                                value={createData.model_id || ''}


                                            />
                                            <InputError message={'*'} className="mt-2 text-xl" />
                                            </div>
                                        </div>






                                <div >
                                    <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="user_id" value={"Customer"} />
                                    <div className="flex gap-5 mt-2">
                                    <ComboboxMakes
                                        items={customers}
                                        onItemSelect={(item) => setCreateData("user_id", item.id)}
                                        selectedMakeId={createData.user_id}
                                        placeholder="اختر العميل"
                                        emptyMessage="لا يوجد عملاء"
                                        />
                                    <InputError message={'*'} className="mt-2 text-xl" />
                                    </div>
                                </div>

                                <div >
                                    <InputLabel htmlFor="vin" className="mt-2 text-xl text-nowrap" value={"VIN"} />
                                    <div className="flex gap-5 mt-2">

                                        <TextInput
                                            id="vin"
                                            type="text"
                                            name="vin"
                                            className="block w-full mt-1"
                                            onChange={(e) => setVin(e.target.value ?? '')}
                                            onBlur={handleVinBlur}
                                            value={vin ?? ''}

                                        />
                                        <InputError  message={'*'} className="mt-2 text-xl"  />
                                    </div>
                                </div>
                                <div >
                                    <InputLabel htmlFor="color" className="mt-2 text-xl text-nowrap" value={"Color"} />
                                    <div className="flex gap-5 mt-2">
                                        <TextInput
                                            id="color"
                                            type="text"
                                            name="color"
                                            value={createData.color}
                                            className="block w-full mt-1"
                                            onChange={(e) => setCreateData("color", e.target.value)}
                                        />
                                        <InputError message={'*'} className="mt-2 text-xl" />
                                    </div>
                                </div>


                                    <div >
                                        <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="year" value="Year" />
                                        <div className="flex gap-5 mt-2">
                                            <TextInput
                                                type="number"
                                                id={`year`}
                                                name="year"
                                                value={createData.year ?? ''}

                                                className="block w-full mt-1"
                                                onChange={(e) => setCreateData('year',e.target.value)}
                                            />
                                            <InputError message={'*'} className="mt-2 text-xl" />

                                        </div>
                                    </div>

                                    <div className="flex gap-5 mt-3 w-fit">
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

                                    <div className="flex gap-5">
                                        <div>
                                            <div className="flex items-center gap-5">
                                                <InputLabel className="text-xl" htmlFor="keys" value="keys" />
                                                <div className="flex gap-5 ">
                                                        <Input
                                                            type="checkbox"
                                                            id={`keys`}
                                                            className="w-6 h-6 rounded mt-0.5"
                                                            onChange={(e) => setCreateData('keys', e.target.checked ? 1 : 0)}
                                                        />

                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-5">
                                                <InputLabel className="text-xl" htmlFor="title" value="Title" />
                                                <div className="flex gap-5 ">

                                                    <Input
                                                        type="checkbox"
                                                        id={`title`}
                                                        className="w-6 h-6 rounded mt-0.5"
                                                        onChange={(e) => setCreateData('title', e.target.checked ? 1 : 0)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                            </div>



                        </div>


                            <div className="p-6">
                                <ul className="mt-2 text-red-600 list-disc list-inside">
                                    {Object.keys(createErrors).map((key) => (
                                        <li key={key}>{createErrors[key]}</li>
                                    ))}
                                </ul>
                            </div>





                        <div className="flex justify-end gap-3 m-5">
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
                    <TabsContent value="shipping">
                        <div className=" flex flex-col justify-between h-[85vh] overflow-auto">

                                <div className="p-6">
                                {/* Vendor + Destination + Shipping Line */}

                                    <div className="grid gap-5 mb-10 sm:grid-cols-1 md:grid-cols-2 ">
                                        <div >
                                        <InputLabel htmlFor="lot" className="my-2 text-xl text-nowrap" value={"Lot / Stok"} />
                                        <TextInput
                                            id="lot"
                                            type="text"
                                            name="lot"
                                            value={createData.lot}
                                            className="block w-full mt-1"
                                            onChange={(e) => setCreateData("lot", e.target.value)}
                                        />

                                        </div>
                                        <div >
                                                <InputLabel htmlFor="bookingNo" className="my-2 text-xl text-nowrap" value={"BookingNo"} />
                                                <TextInput
                                                    id="bookingNo"
                                                    type="text"
                                                    name="bookingNo"
                                                    value={createData.bookingNo}
                                                    className="block w-full mt-1"
                                                    onChange={(e) => setCreateData("bookingNo", e.target.value)}
                                                />

                                        </div>
                                        <div >
                                                <InputLabel htmlFor="container_number" className="my-2 text-xl text-nowrap" value={"Container Number"} />
                                                <TextInput
                                                    id="container_number"
                                                    type="text"
                                                    name="container_number"
                                                    value={createData.container_number}
                                                    className="block w-full mt-1"
                                                    onChange={(e) => setCreateData("container_number", e.target.value)}
                                                />

                                        </div>

                                        <div >
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="vendor_id" value={"Vendor"} />

                                            <ComboboxMakes
                                                items={vendors}
                                                onItemSelect={(item) => setCreateData("vendor_id", item.id)}
                                                placeholder="اختر الماز"
                                                emptyMessage="لا يوجد مزادات"
                                                />

                                        </div>
                                        <div >
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="destination_id" value={"Destination"} />

                                            <ComboboxMakes
                                                items={destinations}
                                                onItemSelect={(item) => setCreateData("destination_id", item.id)}
                                                selectedMakeId={createData.destination_id}

                                                placeholder="اختر الوجهة"
                                                emptyMessage="لا يوجد وحهات"
                                                />

                                        </div>
                                        <div >
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="line_id" value={"Shipping line"} />

                                            <ComboboxMakes
                                                items={lines}
                                                onItemSelect={(item) => setCreateData("line_id", item.id)}
                                                selectedMakeId={createData.line_id}

                                                placeholder="اختر الخط الملاحي"
                                                emptyMessage="لا يوجد خطوط ملاحيه"
                                                />

                                        </div>

                                        <div>
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="facility_id" value={"Facility"} />

                                            <ComboboxMakes
                                                items={facilities}
                                                onItemSelect={(item) => setCreateData("facility_id", item.id)}
                                                selectedMakeId={createData.facility_id}

                                                placeholder="اختر المرفق"
                                                emptyMessage="لا يوجد مرافق"
                                                />

                                        </div>
                                        <div >
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="terminal_id" value={"Terminal"} />

                                            <ComboboxMakes
                                                items={terminals}
                                                onItemSelect={(item) => setCreateData("terminal_id", item.id)}
                                                selectedMakeId={createData.terminal_id}

                                                placeholder="اختر محطة الشحن"
                                                emptyMessage="لا يوجد محطات شحن"
                                                />

                                        </div>


                                        <div >
                                                <InputLabel htmlFor="date_won" className="mt-2 text-xl text-nowrap" value={"Date Won"} />
                                                <TextInput
                                                    id="date_won"
                                                    type="date"
                                                    name="date_won"
                                                    value={createData.date_won}
                                                    className="block w-full mt-1"

                                                    onChange={(e) => setCreateData("date_won", e.target.value)}
                                                />

                                            </div>
                                        <div >
                                                <InputLabel htmlFor="estimate_arrival_date" className="mt-2 text-xl text-nowrap" value={"Estimate Arrival Date"} />
                                                <TextInput
                                                    id="estimate_arrival_date"
                                                    type="date"
                                                    name="estimate_arrival_date"
                                                    value={createData.estimate_arrival_date}
                                                    className="block w-full mt-1"

                                                    onChange={(e) => setCreateData("estimate_arrival_date", e.target.value)}
                                                />

                                        </div>
                                        <div >
                                                <InputLabel htmlFor="arrival_date" className="mt-2 text-xl text-nowrap" value={"Arrival Date"} />
                                                <TextInput
                                                    id="arrival_date"
                                                    type="date"
                                                    name="arrival_date"
                                                    value={createData.arrival_date}
                                                    className="block w-full mt-1"

                                                    onChange={(e) => setCreateData("arrival_date", e.target.value)}
                                                />
                                        </div>

                                        <div>
                                            <InputLabel className="my-2 text-xl text-nowrap" htmlFor="ship_status" value={"Shipping Status"} />
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
                                        </div>

                                        <div >
                                            <InputLabel htmlFor="won_price" className="my-2 text-xl text-nowrap" value={"Won Price"} />
                                            <TextInput
                                                id="won_price"
                                                type="number"
                                                name="won_price"
                                                value={createData.won_price}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("won_price", e.target.value)}
                                            />
                                        </div>

                                        <div >
                                            <InputLabel htmlFor="shipping_cost" className="my-2 text-xl text-nowrap" value={"Shipping Cost"} />
                                            <TextInput
                                                id="shipping_cost"
                                                type="number"
                                                name="shipping_cost"
                                                value={createData.shipping_cost}
                                                className="block w-full mt-1"

                                                onChange={(e) => setCreateData("shipping_cost", e.target.value)}
                                            />
                                        </div>



                                    </div>




                                    <div className="p-6">
                                        <ul className="mt-2 text-red-600 list-disc list-inside">
                                            {Object.keys(createErrors).map((key) => (
                                                <li key={key}>{createErrors[key]}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>





                                <div className="flex justify-end gap-3 m-5">
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
                    <TabsContent value="photos">
                    <div className="flex flex-col justify-between  h-[85vh] ">

                            <div className="p-6">

                                        <div className="md:w-1/2 lg:w-1/4">
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
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>

                    </div>

                    <h2 className="text-2xl font-semibold dark:text-white">إضافة سيارة</h2>

                </TabsList>

                <TabsContent value="general">
                    <div className=" flex flex-col justify-between h-[85vh] overflow-auto">

                                <div className="p-6 ">


                                    <div className="grid items-center justify-center gap-5 my-10 sm:grid-cols-2 md:grid-cols-2 ">

                                                <div>
                                                <InputLabel className="text-xl text-nowrap" htmlFor="edit_make_id" value="Make" />
                                                <div className="flex gap-5 mt-2">
                                                <ComboboxMakes
                                                    items={makes}
                                                    onItemSelect={handleEditMakeSelect}
                                                    selectedMakeId={selectedEditMakeId}
                                                    placeholder="اختر الماركه"
                                                    emptyMessage="لا يوجد مركات"
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl" />
                                                </div>
                                            </div>
                                            <div>
                                                <InputLabel className="text-xl text-nowrap" htmlFor="edit_model_id" value="Model" />
                                                <div className="flex gap-5 mt-2">
                                                <ComboboxMakes
                                                    items={filteredEditModels}
                                                    onItemSelect={(item) => setEditData("model_id", item.id)}
                                                    selectedMakeId={editData.model_id}
                                                    placeholder="اختر الموديل"
                                                    emptyMessage="لا يوجد موديلات"
                                                    disabled={!selectedEditMakeId}
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl" />
                                                </div>
                                            </div>





                                        <div >
                                              <InputLabel className="text-xl text-nowrap" htmlFor="user_id" value={"Customer"} />
                                            <div className="flex gap-5 mt-2">

                                            <ComboboxMakes
                                                items={customers}
                                                onItemSelect={(item) => setEditData("user_id", item.id)}
                                                selectedMakeId={editData.user_id}
                                                placeholder="اختر العميل"
                                                emptyMessage="لا يوجد عملاء"
                                                />
                                                  <InputError message={'*'} className="mt-2 text-xl" />
                                                </div>
                                        </div>

                                        <div>
                                        <InputLabel htmlFor="edit_vin" className="mt-2 text-xl text-nowrap" value={"VIN"} />
                                        <div className="flex gap-5 mt-2">
                                            <TextInput
                                            id="edit_vin"
                                            type="text"
                                            name="edit_vin"
                                            className="block w-full mt-1"
                                            value={editVin ?? ''}
                                            onChange={(e) => setEditVin(e.target.value ?? '')}
                                            onBlur={handleEditVinBlur}
                                            />
                                            <InputError message={'*'} className="mt-2 text-xl" />
                                        </div>
                                        </div>


                                    <div >
                                        <InputLabel htmlFor="edit_color" className="mt-2 text-xl text-nowrap" value={"Color"} />
                                            <div className="flex gap-5 mt-2">
                                                <TextInput
                                                    id="edit_color"
                                                    type="text"
                                                    name="color"
                                                    value={editData.color}

                                                    className="block w-full mt-1"
                                                    onChange={(e) => setEditData("color", e.target.value)}
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl" />
                                            </div>
                                      </div>

                                        <div >
                                        <InputLabel className="mt-2 text-xl text-nowrap" htmlFor="edit_year" value="Year" />
                                            <div className="flex gap-5 mt-2">

                                                <TextInput
                                                    type="number"
                                                    id={`edit_year`}
                                                    name="year"
                                                    value={editData.year}


                                                    className="block w-full mt-1"
                                                    onChange={(e) => setEditData('year',e.target.value)}
                                                />
                                                <InputError message={'*'} className="mt-2 text-xl" />
                                            </div>
                                    </div>


                                <div className="flex gap-5 w-fit">
                                    <InputLabel htmlFor="edit_carfax_report" className="mt-2 text-xl text-nowrap" value={"Carfax Report"} />
                                    <Input
                                        id="edit_carfax_report"
                                        type="file"
                                        name="carfax_report"
                                        className="block w-full mt-1"
                                        onChange={(e) => setEditData("carfax_report", e.target.files[0])}  // Store the file directly
                                    />
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="flex gap-5">
                                    <InputLabel className="text-xl" htmlFor="edit_keys" value="Keys" />
                                    <Input
                                        type="checkbox"
                                        id={`edit_keys`}
                                        checked={editData.keys == 1}

                                        className="w-6 h-6 rounded mt-0.5"
                                        onChange={(e) => setEditData('keys', e.target.checked ? 1 : 0)}
                                    />
                                    </div>
                                    <div className="flex gap-5">
                                    <InputLabel className="text-xl" htmlFor="edit_title" value="Title" />
                                    <Input
                                        type="checkbox"
                                        id={`edit_title`}
                                        checked={editData.title == 1}
                                        className="w-6 h-6 rounded mt-0.5"
                                        onChange={(e) => setEditData('title', e.target.checked ? 1 : 0)}
                                    />
                                    </div>
                                </div>


                                </div>





                                <div className="p-6">
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

                                        <div className="grid items-center justify-center grid-cols-1 gap-5 my-10 md:grid-cols-2 ">

                                                <div >
                                                        <InputLabel htmlFor="edit_lot" className="my-2 text-xl text-nowrap" value={"Lot / Stok"} />
                                                        <TextInput
                                                            id="edit_lot"
                                                            type="text"
                                                            name="lot"
                                                            value={editData.lot}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("lot", e.target.value)}
                                                        />

                                                </div>
                                                <div >
                                                        <InputLabel htmlFor="edit_bookingNo" className="my-2 text-xl text-nowrap" value={"bookingNo"} />
                                                        <TextInput
                                                            id="edit_bookingNo"
                                                            type="text"
                                                            name="bookingNo"
                                                            value={editData.bookingNo}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("bookingNo", e.target.value)}
                                                        />

                                                </div>
                                                <div >
                                                        <InputLabel htmlFor="edit_container_number" className="my-2 text-xl text-nowrap" value={"Container Number"} />
                                                        <TextInput
                                                            id="edit_container_number"
                                                            type="text"
                                                            name="container_number"
                                                            value={editData.container_number}

                                                            className="block w-full mt-1"

                                                            onChange={(e) => setEditData("container_number", e.target.value)}
                                                        />

                                                </div>

                                                <div >
                                                    <InputLabel className="text-xl text-nowrap" htmlFor="edit_vendor_id" value={"Vendor"} />

                                                    <ComboboxMakes
                                                        items={vendors}
                                                        onItemSelect={(item) => setEditData("vendor_id", item.id)}
                                                        selectedMakeId={editData.vendor_id}

                                                        placeholder="اختر الماز"
                                                        emptyMessage="لا يوجد مزادات"
                                                        />

                                                </div>
                                                <div >
                                                    <InputLabel className="text-xl text-nowrap" htmlFor="edit_destination_id" value={"Destination"} />

                                                    <ComboboxMakes
                                                        items={destinations}
                                                    onItemSelect={(item) => setEditData("destination_id", item.id)}
                                                        selectedMakeId={editData.destination_id}

                                                        placeholder="اختر الوجهة"
                                                        emptyMessage="لا يوجد وحهات"
                                                        />

                                                </div>
                                                <div >
                                                    <InputLabel className="text-xl text-nowrap" htmlFor="edit_line_id" value={"Shipping line"} />

                                                    <ComboboxMakes
                                                        items={lines}
                                                    onItemSelect={(item) => setEditData("line_id", item.id)}
                                                        selectedMakeId={editData.line_id}

                                                        placeholder="اختر الخط الملاحي"
                                                        emptyMessage="لا يوجد خطوط ملاحيه"
                                                        />
                                                </div>

                                            <div >
                                                    <InputLabel className="text-xl text-nowrap" htmlFor="edit_facility_id" value={"Facility"} />

                                                    <ComboboxMakes
                                                        items={facilities}
                                                    onItemSelect={(item) => setEditData("facility_id", item.id)}
                                                        selectedMakeId={editData.facility_id}

                                                        placeholder="اختر المرفق"
                                                        emptyMessage="لا يوجد مرافق"
                                                        />
                                                </div>
                                                <div >
                                                    <InputLabel className="text-xl text-nowrap" htmlFor="edit_terminal_id" value={"Terminal"} />

                                                    <ComboboxMakes
                                                        items={terminals}
                                                    onItemSelect={(item) => setEditData("terminal_id", item.id)}
                                                        selectedMakeId={editData.terminal_id}

                                                        placeholder="اختر محطة الشحن"
                                                        emptyMessage="لا يوجد محطات شحن"
                                                        />

                                                </div>

                                                <div >
                                                    <InputLabel htmlFor="edit_date_won" className="my-2 text-xl text-nowrap" value={"Date Won "} />
                                                    <TextInput
                                                        id="edit_date_won"
                                                        type="date"
                                                        name="date_won"
                                                        value={editData.date_won}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("date_won", e.target.value)}
                                                    />
                                                </div>
                                            <div >
                                                    <InputLabel htmlFor="edit_estimate_arrival_date" className="my-2 text-xl text-nowrap" value={"Estimate Arrival Date"} />
                                                    <TextInput
                                                        id="edit_estimate_arrival_date"
                                                        type="date"
                                                        name="estimate_arrival_date"
                                                        value={editData.estimate_arrival_date}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("estimate_arrival_date", e.target.value)}
                                                    />
                                            </div>
                                            <div >
                                                    <InputLabel htmlFor="edit_arrival_date" className="my-2 text-xl text-nowrap" value={"Arrival Date"} />
                                                    <TextInput
                                                        id="edit_arrival_date"
                                                        type="date"
                                                        name="arrival_date"
                                                        value={editData.arrival_date}

                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("arrival_date", e.target.value)}
                                                    />

                                          </div>
                                              <div >
                                                    <InputLabel className="my-2 text-xl text-nowrap" htmlFor="ship_status" value={"Shipping Status"} />
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
                                                </div>



                                                <div >
                                                    <InputLabel htmlFor="edit_won_price" className="my-2 text-xl text-nowrap" value={"Won Price "} />
                                                    <TextInput
                                                        id="edit_won_price"
                                                        type="number"
                                                        name="won_price"
                                                        value={editData.won_price}
                                                        className="block w-full mt-1"

                                                        onChange={(e) => setEditData("won_price", e.target.value)}
                                                    />
                                                </div>

                                                <div >
                                                    <InputLabel htmlFor="edit_shipping_cost" className="my-2 text-xl text-nowrap" value={"Shipping Cost"} />
                                                    <TextInput
                                                        id="edit_shipping_cost"
                                                        type="number"
                                                        name="shipping_cost"
                                                        className="block w-full mt-1"
                                                        value={editData.shipping_cost}
                                                        onChange={(e) => setEditData("shipping_cost", e.target.value)}
                                                    />
                                                </div>







                                            </div>

                                        <div className="p-6">
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

                                            <div className="mb-5 md:w-1/2 lg:w-1/4">
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

                                            <div className="p-6">
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
  const [selectedMake, setSelectedMake] = useState(null);

  // Use useEffect to sync selectedMake with selectedMakeId prop changes
  useEffect(() => {
    if (selectedMakeId) {
      const newSelectedMake = items.find((item) => item.id === selectedMakeId) || null;
      setSelectedMake(newSelectedMake);
    } else {
      setSelectedMake(null); // Reset if no selectedMakeId
    }
  }, [selectedMakeId, items]); // Re-run if selectedMakeId or items change

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
                {items &&
                  items.map((item) => (
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
                          selectedMake?.id === item.id ? 'opacity-100' : 'opacity-0'
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

