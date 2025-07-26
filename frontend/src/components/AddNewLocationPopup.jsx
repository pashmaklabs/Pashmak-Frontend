import { XCircle } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function AddNewLocationPopup({
  lat,
  lng,
  setShowAddNewLocationPopup,
}) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    images: [],
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
    if (!formData.address.trim())
      newErrors.address = "آدرس مکان نباید خالی باشد";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit logic goes here
    console.log("Form Submitted:", formData);

    setFormData({
      name: "",
      address: "",
      phone: "",
      images: [],
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

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              آدرس<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="آدرس مکان شامل کشور، استان، شهر و ..."
              className="w-full p-2 border-2
                          rounded-lg focus:outline-none
                          bg-white border-gray-300
                          text-gray-900"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              شماره تماس
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="شماره تماس"
              className="w-full p-2 border-2
                          rounded-lg focus:outline-none
                          bg-white border-gray-300
                          text-gray-900"
            />
          </div>

          {/* Images */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">افزودن تصویر (اختیاری)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.images.map((file, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full border"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4
                          hover:outline-none border-none 
                          py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
