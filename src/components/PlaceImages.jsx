import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Upload, X, Camera } from "lucide-react";
import { useGetRequest, usePostRequest } from "../services/api";
import { toast } from "react-toastify";

export default function PlaceImages({ pointId, onImageUpload }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch existing images from database
  useEffect(() => {
    fetchImages();
  }, [pointId]);

  const {
    mutate: fetchImg,
    data: fetchOutput,
    isPending: isfetching,
    error,
  } = useGetRequest();

  const fetchImages = () => {
    setLoading(true);
    fetchImg(
      { endpoint: `/places/${pointId}`, params: {} },
      {
        onSuccess: ({ place }) => {
          setImages(place.image_urls || []);
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error fetching images:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(
              "خطایی در دریافت تصاویر این مکان رخ داده است. لطفا دوباره امتحان کنید",
            );
          }
          setLoading(false);
        },
      },
    );
    setLoading(false);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        uploadImage(file);
      }
    });
    // Reset input
    event.target.value = "";
  };

  const { mutate: uploadImg, isLoading: isSubmitting } = usePostRequest();

  const uploadImage = (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    uploadImg(
      {
        url: `/places/${pointId}/images`,
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      },
      {
        onSuccess: (data) => {
          fetchImages(); // re-fetch full image list from server
          if (onImageUpload) {
            onImageUpload(data.image);
          }
          setUploading(false);
          toast.success("تصویر با موفقیت آپلود شد");
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
          setUploading(false);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
          for (let pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col min-h-full p-4 bg-white">
      {/* Images Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <img
                src={image}
                alt={`تصویر ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />

              {/* Image overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Camera size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">هیچ تصویری موجود نیست</p>
          <p className="text-sm">
            برای افزودن تصویر، روی دکمه "افزودن تصویر" کلیک کنید
          </p>
        </div>
      )}

      {/* Upload progress indicator */}
      {uploading &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span>در حال آپلود تصویر...</span>
            </div>
          </div>,
          document.getElementById("portal-root"),
        )}

      {/* Upload Button */}
      <div className="mb-6 text-center shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 m-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
        >
          <Upload size={20} />
          {uploading ? "در حال آپلود..." : "افزودن تصویر"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
