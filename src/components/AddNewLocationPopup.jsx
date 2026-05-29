import { XCircle } from "lucide-react";
import { useState } from "react";
import { usePostRequest } from "../services/api";
import { toast } from "react-toastify";
export default function AddNewLocationPopup({
  latitude,
  longitude,
  setShowAddNewLocationPopup,
}) {
  const [formData, setFormData] = useState({
    name: "",
    amenity: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام مکان نباید خالی باشد.";
    if (!formData.amenity.trim())
      newErrors.amenity = "آدرس مکان نباید خالی باشد";
    return newErrors;
  };

  const { mutate: sendNewLocationInfo, isLoading: isSendingNewLocationInfo } =
    usePostRequest();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit logic goes here
    sendNewLocationInfo(
      {
        url: "/places/new_place",
        data: {
          name: formData.name,
          amenity: formData.amenity,
          latitude: latitude,
          longitude: longitude,
        },
      },
      {
        onSuccess: (data) => {
          toast.success("پیشنهاد شما با موفقیت ثبت شد.");
          setShowAddNewLocationPopup(false);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("ثبت پیشنهاد موفقیت آمیز نبود . لطفا مجددا تلاش کنید.");
          }
        },
      },
    );

    setFormData({
      name: "",
      amenity: "",
    });
    setErrors({});
  };

  return (
    <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
      <div
        className="max-w-[350px] mx-auto p-6
                      rounded-2xl shadow-lg mt-10
                      relative bg-white w-1/3
                      min-h-[100px]"
      >
        {/* close button */}
        <XCircle
          className="text-gray-900 absolute left-2 top-2
                      hover:cursor-pointer hover:text-red-500 transition-colors
                     w-7 h-7"
          onClick={() => {
            setShowAddNewLocationPopup(false);
          }}
        />
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          پیشنهاد اضافه کردن مکان
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              نام<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام مکان"
              className="w-full p-2 border-2
                          rounded-lg focus:outline-none
                          bg-white border-gray-300
                          text-gray-900"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Amenity */}
          <div>
            <label className=" text-sm font-medium text-gray-900 mb-1">
              دسته<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amenity"
              value={formData.amenity}
              onChange={handleChange}
              placeholder="دسته بندی مکان مورد نظر"
              className="w-full p-2 border-2
                          rounded-lg focus:outline-none
                          bg-white border-gray-300
                          text-gray-900"
            />
            {errors.amenity && (
              <p className="text-red-500 text-sm mt-1">{errors.amenity}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4
                          hover:outline-none border-none 
                          py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ثبت
          </button>
        </form>
      </div>
    </div>
  );
}
