import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth, site_settings, transfers, boxes, queryParams = null, success, danger }) {
  queryParams = queryParams || {};

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);
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
    const filtered = boxes.filter((box) => box.id !== parseInt(selectedFromBoxEdit));
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
        setOperationPerformed(true);

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
    const filtered = boxes.filter((box) => box.id !== parseInt(selectedFromBoxCreate));
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
        setOperationPerformed(true);

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
            setOperationPerformed(true);
            setVisibleSuccess(page.props.success);
            setVisibleDanger(page.props.danger);
      }
    });
      };

    //---------------------------------------------------------

  return (
      <AuthenticatedLayout user={auth.user} site_settings={site_settings}
            header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
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
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">


              <div className="mt-6">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr >
                      <th className="px-3 py-3">من الصندوق</th>
                      <th className="px-3 py-3">إلى الصندوق</th>
                      <th className="px-3 py-3">القيمة</th>
                      <th className="px-3 py-3">اضافه بواسطه</th>
                      <th className="px-3 py-3">تحديث بواسطه</th>

                      <th className="px-3 py-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers && transfers.data.length > 0 ? (
                      transfers.data.map((transfer) => (
                        <tr className="border-b" key={transfer.id}>
                          <td className="px-3 py-3 text-nowrap">{transfer.from_box.name}</td>
                          <td className="px-3 py-3 text-nowrap">{transfer.to_box.name}</td>
                          <td className="px-3 py-3 text-nowrap">{transfer.amount}</td>
                          <td className="px-3 py-3 text-nowrap">{transfer.created_by.name}</td>
                          <td className="px-3 py-3 text-nowrap">{transfer.updated_by ? transfer.updated_by.name : '' }</td>

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
          <div className="w-1/2 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">إضافة تحويل</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateTransfer}>
                    <div >
                        <div>
                            {/* From Box Dropdown */}
                            <div>
                            <InputLabel className="mb-3" htmlFor="from_box_id" value={"من الصندوق"} />
                            <SelectInput
                                id="from_box_id"
                                name="from_box_id"
                                value={createData.from_box_id || ""}
                                onChange={handleCreateFromBoxChange}
                            >
                                <option value="">اختر</option>

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
                            <InputError message={createErrors.from_box_id} />
                            </div>

                            {/* To Box Dropdown */}
                            <div className="my-4">
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
                        </div>



                  <div>
                    <InputLabel htmlFor="amount" value={"القيمة"} />
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
          <div className="w-1/2 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold dark:text-white">تعديل التحويل</h2>
            </div>
            <div className="p-6">
                          <form onSubmit={handleEditTransfer}>

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
                    <InputLabel htmlFor="amount" value={"القيمة"} />
                    <TextInput
                      id="amount"
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData("amount", e.target.value)}
                    />
                    <InputError className="mt-2" message={editErrors.amount} />
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
