import React, { useState } from "react";
import { toast } from "react-toastify";

const AddSchedulePopup = ({
  weeklySchedule,
  isPopupOpen,
  setIsPopupOpen,
}) => {
  const [timeRecords, setTimeRecords] = useState({});

  const [dropdownRows, setDropdownRows] = useState([
    { day: "All Days", startTime: "", endTime: "" },
  ]);

  const handleAddRow = () => {
    if (dropdownRows.length < 7) {
      setDropdownRows([
        ...dropdownRows,
        { day: "All Days", startTime: "", endTime: "" },
      ]);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...dropdownRows];
    updatedRows[index][field] = value;
    setDropdownRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...dropdownRows];
    updatedRows.splice(index, 1);
    setDropdownRows(updatedRows);
  };

  const handleSave = () => {
    const newRecords = { ...timeRecords };
    dropdownRows.forEach((row) => {
        console.log(row);
      if (row.day && row.startTime && row.endTime) {
        if (row.day === "All Days") {
          Object.keys(weeklySchedule).forEach((day) => {
            newRecords[day] = {
              startTime: row.startTime,
              endTime: row.endTime,
            };
          });
        } else if (row.day === "Odd Days") {
          Object.keys(weeklySchedule).forEach((day, index) => {
            if (index % 2 !== 0) {
              newRecords[day] = {
                startTime: row.startTime,
                endTime: row.endTime,
              };
            }
          });
        } else if (row.day === "Even Days") {
          Object.keys(weeklySchedule).forEach((day, index) => {
            if (index % 2 === 0) {
              newRecords[day] = {
                startTime: row.startTime,
                endTime: row.endTime,
              };
            }
          });
        } else {
          newRecords[row.day] = {
            startTime: row.startTime,
            endTime: row.endTime,
          };
        }
      }
    });

    setTimeRecords(newRecords);
    setDropdownRows([{ day: "All Days", startTime: "", endTime: "" }]);
    setIsPopupOpen("none");
    toast.success("بازه های زمانی فرستاده شد.");
    
  };

  if (isPopupOpen==="none") return null;

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[50]"
    >
      <div className=" bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
        <h2 className="text-lg font-bold mb-4">بازه ی زمانی را انتخاب کنید</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="max-h-52 overflow-y-auto">
            {dropdownRows.length == 0 && (
              <p className="text-gray-500 text-sm mr-1">هیچ بازه زمانی انتخاب نشده است</p>
            )}
            {dropdownRows.map((row, index) => (
              <div key={index} className="flex items-center gap-2 w-[60%] mt-2">
                <select
                  value={row.day}

                  onChange={(e) => handleRowChange(index, "day", e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="All Days">همه ی روزها</option>
                  <option value="Odd Days">روزهای فرد</option>
                  <option value="Even Days">روزهای زوج</option>
                  {Object.keys(weeklySchedule).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <label className="text-sm font-medium text-gray-700">از</label>
                <input
                  type="time"
                  value={row.startTime}
                  onChange={(e) => handleRowChange(index, "startTime", e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
                <span>تا</span>
                <input
                  type="time"
                  value={row.endTime}
                  onChange={(e) => handleRowChange(index, "endTime", e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
                <img
                  src="/closeWhiteBg.svg"
                  alt="delete"
                  className="w-9 h-9 cursor-pointer"
                  onClick={() => handleDeleteRow(index)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-start gap-2 mb-4 mt-4">
            <button
              type="button"
              className="px-4 py-2  bg-white  text-blue-500 rounded-md mr-1"
              onClick={handleAddRow}
              disabled={dropdownRows.length >= 7}
            >
              افزودن
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setIsPopupOpen("none")}
            >
              انصراف
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-purple-500 text-white rounded-md"
              onClick={handleSave}
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddLinkPopup = ({ isPopupOpen, setIsPopupOpen }) => {
  const [link, setLink] = useState("");
    const [error, setError] = useState("");

  const handleSave = () => {
    if (!link) {
      setError("لطفا یک لینک وارد کنید");
      return;
    }
    setIsPopupOpen("none");
    toast.success("لینک فرستاده شد.");
  };

  if (isPopupOpen==="none") return null;

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[50]"
    >
      <div className=" bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
        <h2 className="text-lg font-bold mb-4">لینک را وارد کنید</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              لینک
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setIsPopupOpen("none")}
            >
              انصراف
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-purple-500 text-white rounded-md"
              onClick={handleSave}
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AddPhonePopup = ({ isPopupOpen, setIsPopupOpen }) => {
  const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const handleSave = () => {
    if (!phone) {
      setError("لطفا یک شماره تلفن وارد کنید");
      return;
    }
    setIsPopupOpen("none");
    toast.success("شماره تلفن فرستاده شد.");
  };
    if (isPopupOpen==="none") return null;
    return (
    <div
      id="popup-overlay"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[50]"
    >
      <div className=" bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-bold mb-4">شماره تلفن را وارد کنید</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره تلفن
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setIsPopupOpen("none")}
            >
              انصراف
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-purple-500 text-white rounded-md"
              onClick={handleSave}
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export { AddSchedulePopup, AddLinkPopup, AddPhonePopup };
