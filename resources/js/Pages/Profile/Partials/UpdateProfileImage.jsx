import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { useState, useRef } from "react";

export default function UpdateProfileImage({ className = "" }) {

    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);
    const photoInput = useRef(null);

    const { setData, post, errors, processing } = useForm({
        photo: null,
    });

    const updatePhotoPreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoPreview(event.target.result);
                setData("photo", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectNewPhoto = () => {
        photoInput.current.click();
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setData("photo", null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update-photo"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    تحديث الصوره
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <input
                    id="photo"
                    ref={photoInput}
                    type="file"
                    className="hidden"
                    onChange={updatePhotoPreview}
                />

                <div className="mt-2">
                    {photoPreview ? (
                        <img
                            src={photoPreview}
                            alt={user.name}
                            className="object-cover w-20 h-20 rounded-full"
                        />
                    ) : (
                        <span className="block w-20 h-20 bg-gray-200 rounded-full" />
                    )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <SecondaryButton type="button" onClick={selectNewPhoto}>
                        اختيار صوره جديده
                    </SecondaryButton>

                    {user.profile_photo_path && (
                        <SecondaryButton type="button" onClick={removePhoto}>
                            حذف
                        </SecondaryButton>
                    )}
                </div>

                <InputError message={errors.photo} className="mt-2" />

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        حفظ
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
