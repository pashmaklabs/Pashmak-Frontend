import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { Camera, TextBold } from "solar-icon-set";

const PersonalInfo = () => {
    // hard code 
    let default_firstname="پشمکعلی"
    const [firstname, setFirstname] = useState(default_firstname);
    const [firstNameChanged,setFirstNameChanged]=useState(false);
    // hard code 
    let default_lastname="پشمک نژاد"
    const [lastname, setLastname] = useState(default_lastname);
    const [lastNameChanged,setLastNameChanged]=useState(false);
    //hard code
    let default_aboutMe="خسته ام"
    const [aboutMe, setAboutMe] = useState(default_aboutMe);
    const [aboutMeChanged,setAboutMeChanged]=useState(false);
    //hard code
    let defaultProfilePicture="/hardcode_pp.jpg"
    const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
    const [profilePictureChanged,setProfilePictureChanged]=useState(false);
    //hard code
    let defaultBirthDate="1323-12-01"
    const [birthDate,setBirthDate]=useState(defaultBirthDate);
    const [birthDateChanged,setBirthDateChanged]=useState(false);
    //hard code
    const rating=3;
    const percentage = (rating / 5) * 360;


    const [submited,setSubmited]=useState(false);

    const navigate = useNavigate();
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmited(true)
        toast.success("تغییرات با موفقیت اعمال شد");
        };


    const handleNameChange = (e, setter) => {
        const value = e.target.value;
        if (/^[\u0600-\u06FFa-zA-Z\s]*$/.test(value)) {
        setter(value);
        }
    };

    const handleBirthDateChange=(e)=>{
        setBirthDate(e.target.value)
    }

    const handleChangePasswordClick= () =>{
        navigate(routes.changePassword);
    };

    const handleDiscardChangesClick=()=>{
        setFirstname(default_firstname)
        setLastname(default_lastname)
    }

    const handlePhotoChange=(e)=>{
        const file = e.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
        }
    }

    useEffect(() => {
        if (firstname !== default_firstname) {
            setFirstNameChanged(true);
        } else {
            setFirstNameChanged(false);
        }
        if (lastname !== default_lastname) {
            setLastNameChanged(true);
        } else {
            setLastNameChanged(false);
        }
        if (aboutMe !== default_aboutMe) {
            setAboutMeChanged(true);
        } else {
            setAboutMeChanged(false);
        }
        if(profilePicture !== defaultProfilePicture){
            setProfilePictureChanged(true)
        } else {
            setProfilePictureChanged(false)
        }
        if(birthDate !== defaultBirthDate){
            setBirthDateChanged(true)
        } else {
            setBirthDateChanged(false)
        }
        setSubmited(false)
    }, [firstname, lastname, aboutMe,profilePicture,birthDate]);

    return (
        <form className="flex flex-col items-center justify-center
                         h-full w-full max-w-[77%] bg-white 
                         bg-gradient-to-tr from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            <div className="flex flex-col w-[40%] h-[95%] items-center justify-center border-[1px] border-gray-700 rounded-3xl bg-white ">
                <div className="flex items-center justify-center w-full pt-0 h-[35%] gap-x-[25%]">
                    <div className="relative w-24 h-[314px] flex items-center justify-center">

                        <div className="absolute w-[102px] aspect-square rounded-full border-8 border-gray-700"/>

                        <div
                            className="absolute w-[110px] aspect-square rounded-full"
                            style={{
                            background: `conic-gradient(#facc15 ${percentage}deg, transparent 0deg)`,
                            WebkitMask: "radial-gradient(white 60%, transparent 61%)",
                            mask: "radial-gradient(white 60%, transparent 61%)",
                            }}
                        />

                        <div className="absolute w-[85px] aspect-square bg-white rounded-full" />

                        <span className="relative text-xl font-bold text-gray-900">{rating.toFixed(1)} / 5</span>
                    </div>

                    <div className="relative flex w-[200px] justify-center">
                        <img
                            src={profilePicture}
                            alt="User"
                            className="rounded-full w-[200px] aspect-square border-gray-400 border-[2px]" />
                        <div className="">
                            <label className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-200 pt-[6px] px-[6px] pb-0 rounded-full shadow cursor-pointer hover:bg-gray-300 transition">
                                <Camera size={20} color="#111827" iconStyle="Outline"/>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange} />
                            </label>  
                        </div>
                    </div>
                </div>

                <div className="w-[80%] relative mt-[20px] ">
                    <input
                        placeholder="نام"
                        value={firstname}
                        onChange={(e) => handleNameChange(e, setFirstname)}
                        dir="rtl"
                        className="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                                    text-gray-900 placeholder:text-right focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="w-[80%] relative mt-[20px]">
                    <input
                        placeholder="نام خانوادگی"
                        value={lastname}
                        onChange={(e) => handleNameChange(e, setLastname)}
                        dir="rtl"
                        className={`w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                            text-secondary placeholder:text-right focus:outline-none focus:border-primary`}
                    />
                </div>

                <div className="w-[80%] relative mt-[20px] ">
                    <input
                        placeholder="تاریخ تولد"
                        type="date"
                        value={birthDate}
                        onChange={(e) => handleBirthDateChange(e)}
                        dir="rtl"
                        className={`border px-3 py-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                <div className="w-[80%] relative mt-[20px] pb-0">
                        <textarea
                            placeholder="درباره من"
                            value={aboutMe}
                            onChange={(e) => handleNameChange(e, setAboutMe)}
                            dir="rtl"
                            className={`w-full rounded-lg border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                                text-secondary placeholder:text-right  h-[109px] focus:outline-none focus:border-primary`}
                        />
                </div>

                <div className="w-[80%] relative mt-[20px]">
                    <button
                        onClick={handleChangePasswordClick}
                        className={`w-full py-2 rounded-md text-white transition duration-300 text-sm sm:text-base bg-primary`}
                    >
                        تغییر رمز عبور
                    </button>
                    
                </div>

                <div className="flex gap-3 w-[80%] mx-auto mt-[20px]">
                    <button
                        onClick={handleDiscardChangesClick}
                        disabled={!firstNameChanged && !lastNameChanged && !aboutMeChanged && !profilePictureChanged && !birthDateChanged}
                        className={`w-[42.85%] py-2 rounded-md text-gray-700 bg-gray-400 text-sm sm:text-base border-zinc-700 border-[1px]`}
                    >
                        لغو
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={(!firstNameChanged && !lastNameChanged && !aboutMeChanged && !profilePictureChanged && !birthDateChanged) || submited}
                        className={`w-full py-2 rounded-md text-white transition duration-300 text-sm sm:text-base ${
                        (!firstNameChanged && !lastNameChanged && !aboutMeChanged && !profilePictureChanged && !birthDateChanged) || (!firstname || !lastname) || submited
                            ? "bg-slate-400"
                            : "bg-primary"
                        }`}
                    >
                        تایید تغییرات
                    </button>
                </div>
            </div>
        </form>
    );
};

// Signup.propTypes = {
//   handleSignup: PropTypes.func.isRequired
// };

export default PersonalInfo;
