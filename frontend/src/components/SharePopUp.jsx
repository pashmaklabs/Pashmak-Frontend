import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SharePopup({
  onClose,
  shareUrl,
  placeName,
  placeAddress,
}) {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "popup-overlay") {
        onClose();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[50]"
    >
      <div className="bg-white rounded-xl shadow-2xl w-[28rem] p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-semibold">اشتراک گذاری</h2>
          <img
            src="/closeWhiteBg.svg"
            alt="close"
            onClick={onClose}
            className="absolute top-1 left-1 w-8 h-8 cursor-pointer"
          />
        </div>
        <hr className="my-4 border-gray-300" />

        <div className="mb-4">
          <div className="font-bold text-gray-800">{placeName}</div>
          <div className="text-sm text-gray-500 mt-1">{placeAddress}</div>
        </div>

        <div className="flex mb-4 h-8 shadow-sm rounded overflow-hidden">
          <button
            onClick={() => toast.success("لینک مکان موردنظر کپی شد")}
            className="bg-blue-600 text-white px-2 hover:bg-blue-700 focus:outline-none flex items-center justify-center h-8"
          >
            کپی لینک
          </button>

          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-white h-8 text-gray-500 border-l border-gray-300 px-2 py-2 text-sm focus:outline-none text-left"
          />
        </div>

        <div className="flex justify-around mt-4 bg-gray-100 p-4 rounded-lg">
          <a
            href={`https://t.me/share/url?url=${shareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-blue-500"
          >
            <img
              src="/telegram_app.svg"
              alt="telegram"
              className="w-8 h-8 mb-1"
            />
            <span className="text-xs">تلگرام</span>
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&body=${shareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-red-500"
          >
            <img src="/gmail_app.svg" alt="gmail" className="w-8 h-8 mb-1" />
            <span className="text-xs">جیمیل</span>
          </a>
          <a
            href={`https://x.com/share?url=${shareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-black"
          >
            <img src="/x_app.svg" alt="x" className="w-8 h-8 mb-1" />
            <span className="text-xs">ایکس</span>
          </a>
        </div>
      </div>
    </div>
  );
}
