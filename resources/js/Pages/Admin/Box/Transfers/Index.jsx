import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import SelectInput from "@/Components/SelectInput";
import { toast } from 'sonner';

export default function Index({ auth, site_settings, transfers, boxes,boxList, queryParams = null, success, danger }) {
  queryParams = queryParams || {};

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);


  // Form data for creating and editing transfers
  const { data: createData, setData: setCreateData, post: createPost, errors: createErrors, reset: createReset } = useForm({
    from_box_id: '',
    to_box_id: '',
    amount: '',
    description: ''
  });

  const { data: editData, setData: setEditData, post: editPost, errors: editErrors, reset: editReset } = useForm({
    from_box_id: '',
    to_box_id: '',
    amount: '',
    description: '',
    _method: "PUT",
  });

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    if (!isCreateModalOpen) {
      createReset();
    }
  };

//--------------------------------------------------------- This part for admin to make sure he won't sent moeny back to the same box
const [selectedFromBoxEdit, setSelectedFromBoxEdit] = useState("");
const [filteredToBoxesEdit, setFilteredToBoxesEdit] = useState([]);

// When the edit modal is opened, set the initial values
const toggleEditModal = (transfer = null) => {
  if (transfer) {
    setEditingTransfer(transfer);
    setEditData({
      from_box_id: transfer.from_box_id,
      to_box_id: transfer.to_box_id,
      amount: transfer.amount,
      _method: "PUT",
    });


    setSelectedFromBoxEdit(transfer.from_box_id);
  } else {
    setEditingTransfer(null);
    editReset();
    setSelectedFromBoxEdit("");
  }
  setIsEditModalOpen(!isEditModalOpen);
};

const handleEditFromBoxChange = (e) => {
  const selectedBox = e.target.value;
  setEditData("from_box_id", selectedBox);
  setSelectedFromBoxEdit(selectedBox);
};


useEffect(() => {
  if (selectedFromBoxEdit) {
    const filtered = boxList.filter((box) => box.id !== parseInt(selectedFromBoxEdit));
    setFilteredToBoxesEdit(filtered);
  } else {
    setFilteredToBoxesEdit(boxes);
  }
}, [selectedFromBoxEdit, boxes]);


  const handleEditTransfer = (e) => {
    e.preventDefault();
    editPost(route("box-transfer.update", editingTransfer.id), {
      onSuccess: () => {
        editReset();
            toggleEditModal();


      },
    });
  };
//--------------------------------------------------------- This part for admin to make sure he won't sent moeny back to the same box

const [selectedFromBoxCreate, setSelectedFromBoxCreate] = useState("");
const [filteredToBoxes, setFilteredToBoxes] = useState([]);

// Handle from box selection
const handleCreateFromBoxChange = (e) => {
  const selectedBox = e.target.value;
  setCreateData("from_box_id", selectedBox);
  setSelectedFromBoxCreate(selectedBox);
};
useEffect(() => {
  if (selectedFromBoxCreate) {
    const filtered = boxList.filter((box) => box.id !== parseInt(selectedFromBoxCreate));
    setFilteredToBoxes(filtered);
  } else {
    setFilteredToBoxes(boxes);
  }
}, [selectedFromBoxCreate, boxes]);

//---------------------------------------------------------

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    createPost(route("box-transfer.store"), {
      onSuccess: () => {
        createReset();
            toggleCreateModal();


      },
    });
  };
    //---------------------------------------------------------

      const deleteBox = (record) => {
    if (!window.confirm("هل انت متاكد من حذف الصندوق ؟ ")) {
      return;
    }
      router.delete(route("box-transfer.destroy", record), {

        onSuccess: (page) => {
      }
    });
      };

    //---------------------------------------------------------

  return (
      <AuthenticatedLayout user={auth.user} site_settings={site_settings} success={success} danger={danger}
            header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-tight md:text-xl dark:text-gray-200">
            تحويلات الصناديق
          </h2>
          {auth.user.permissions.includes("create-box-transfer") && (
            <button
              onClick={toggleCreateModal}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              تحويلات الصناديق
            </button>
          )}
        </div>
      }>
      <Head title={site_settings.websiteName + " - " + "تحويلات الصناديق"} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
            <div className="p-3 text-gray-900 md:p-3 dark:text-gray-100">


              <div className="mt-6 overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr >
                      <th className="p-3 text-xs text-nowrap md:text-base">من الصندوق</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">إلى الصندوق</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">القيمة</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">اضافة بواسطة</th>
                      <th className="p-3 text-xs text-nowrap md:text-base">تحديث بواسطة</th>

                      <th className="p-3 text-xs text-nowrap md:text-base">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers && transfers.data.length > 0 ? (
                      transfers.data.map((transfer,index) => (
                          <tr
                              className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                             key={transfer.id}>
                          <td className="p-3 text-xs text-nowrap md:text-base">{transfer.from_box.name}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{transfer.to_box.name}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{transfer.amount}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{transfer.created_by.name}</td>
                          <td className="p-3 text-xs text-nowrap md:text-base">{transfer.updated_by ? transfer.updated_by.name : '' }</td>

                            <td className="px-3 py-2 text-nowrap">
                            {auth.user.permissions.includes("update-box-transfer") && (
                              <button
                                onClick={() => toggleEditModal(transfer)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                تعديل
                              </button>
                            )}
                            {auth.user.permissions.includes("delete-box-transfer") && (
                              <button
                                onClick={() => deleteBox(transfer.id)}
                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                حذف
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">لا توجد تحويلات</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Pagination links={transfers.links} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg md:w-10/12 dark:bg-gray-800">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">إضافة تحويل</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateTransfer}>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {/* From Box Dropdown */}
                            <div className="col-span-1">
                            <InputLabel className="mb-3" htmlFor="from_box_id" value={"من الصندوق"} />
                            <SelectInput
                                id="from_box_id"
                                name="from_box_id"
                                value={createData.from_box_id || ""}
                                onChange={handleCreateFromBoxChange}
                            >
                                <option value="">اختر</option>

                                {auth.user.roles.includes("Accountant") ? (
                                <option value={auth.user.box_id}>
                                    {auth.user.box_name}
                                </option>

                                ) : (
                                boxes.map((box) => (
                                    <option value={box.id} key={box.id}>
                                    {box.name} - {box.balance}
                                    </option>
                                ))
                                )}
                            </SelectInput>
                            <InputError message={createErrors.from_box_id} />
                            </div>

                            {/* To Box Dropdown */}
                            <div className="col-span-1 ">
                            <InputLabel className="mb-3" htmlFor="to_box_id" value={"إلى الصندوق"} />
                            <SelectInput
                                id="to_box_id"
                                name="to_box_id"
                                value={createData.to_box_id || ""}
                                onChange={(e) => setCreateData("to_box_id", e.target.value)}
                            >
                                <option value="">اختر</option>

                                {filteredToBoxes.map((box) => (
                                <option value={box.id} key={box.id}>
                                    {box.name}
                                </option>
                                ))}
                            </SelectInput>
                            <InputError  message={createErrors.to_box_id} />
                                      </div>


                            <div className="col-span-1">
                                <InputLabel  className="mb-3" htmlFor="amount" value={"القيمة"} />
                                <TextInput
                                id="amount"
                                type="number"
                                className="block w-full mt-1"
                                value={createData.amount}
                                onChange={(e) => setCreateData("amount", e.target.value)}
                                />
                                <InputError className="mt-2" message={createErrors.amount} />
                            </div>

                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button type="button" onClick={toggleCreateModal} className="mr-2 bg-gray-500 hover:bg-gray-600">إلغاء</Button>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">إضافة</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg md:w-10/12 dark:bg-gray-800">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل التحويل</h2>
            </div>
            <div className="p-6">
                          <form onSubmit={handleEditTransfer}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div>
                    <InputLabel className="mb-3" htmlFor="from_box_id" value={"من الصندوق"} />
                    <SelectInput
                        id="from_box_id"
                        name="from_box_id"
                        value={editData.from_box_id || ""}
                        onChange={handleEditFromBoxChange}
                    >
                        {auth.user.roles.includes("Accountant") ? (
                        <option value={auth.user.accountant.box_id}>
                            {auth.user.accountant.box_name}
                        </option>
                        ) : (
                        boxes.map((box) => (
                            <option value={box.id} key={box.id}>
                            {box.name} - {box.balance}
                            </option>
                        ))
                        )}
                    </SelectInput>
                    <InputError message={editErrors.from_box_id} />
                    </div>

                    {/* To Box Dropdown (Edit Form) */}
                    <div className="my-4">
                    <InputLabel className="mb-3" htmlFor="to_box_id" value={"إلى الصندوق"} />
                    <SelectInput
                        id="to_box_id"
                        name="to_box_id"
                        value={editData.to_box_id || ""}
                        onChange={(e) => setEditData("to_box_id", e.target.value)}
                    >
                        <option value="">اختر</option>
                        {filteredToBoxesEdit.map((box) => (
                        <option value={box.id} key={box.id}>
                            {box.name}
                        </option>
                        ))}
                    </SelectInput>
                    <InputError message={editErrors.to_box_id} />
                    </div>



                  <div>
                    <InputLabel className="mb-3" htmlFor="amount" value={"القيمة"} />
                    <TextInput
                      id="amount"
                      type="number"
                      value={editData.amount}
                      className="block w-full mt-1"
                      onChange={(e) => setEditData("amount", e.target.value)}
                    />
                    <InputError className="mt-2" message={editErrors.amount} />
                              </div>

                </div>


                <div className="flex justify-end gap-3 mt-4">
                  <Button type="button" onClick={toggleEditModal} className="mr-2 bg-gray-500 hover:bg-gray-600">إلغاء</Button>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">حفظ التعديلات</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
