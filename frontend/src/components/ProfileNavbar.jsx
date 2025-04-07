import React from 'react'
import {UserRounded,Gallery,ChatLine,Bookmark} from "solar-icon-set";


export default function ProfileNavbar(props) {
  const profilePhoto="/hardcode_pp.jpg";
    return (
      <div className="flex-col h-full w-[30%] bg-white items-center justify-center border-gray-400 border-l-[1px]">
          <div className="relative w-full">
              <span className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-[#45454575] to-[#26262600] to-[30%]"/>
              <img src={profilePhoto} alt="profile_picture" className="w-full h-full"/>
              <span className="absolute bottom-4 right-4 text-white text-lg font-bold">
                      پشمکعلی پشمک نژاد
              </span>
          </div>
          <div>
            <div className='flex w-full items-center justify-end p-1 mt-3 pr-0'>
              <button className="text-gray-900 bg-white mt-2 p-1 pb-3 pr-3 w-full text-right hover:border-white active:border-white "
                      onClick={()=>props.setState("profileInfo")}>
                اطلاعات حساب کاربری
              </button>
              <div className="mr-[25px] mt-2">
                <UserRounded size={26} color='#111827' iconStyle='Outline'/>
              </div>
              {props.state==="profileInfo" && <span className="bg-gray-900 h-[40px] w-[14px] pr-0 text-gray-900 rounded-tl-lg rounded-bl-lg p-0" />}
            </div>

            <div className='flex w-full items-center justify-end p-1 mt-3 pr-0'>
              <button className="text-gray-900 bg-white p-1 pb-3 pr-3 w-full text-right hover:border-white "
                      onClick={()=>props.setState("gallery")}>
                گالری
              </button>
              <div className="mr-[25px] ">
                <Gallery size={26} color='#111827' iconStyle='Outline'/>
              </div>
              {props.state==="gallery" && <span className="bg-gray-900 h-[40px] w-[14px] pr-0 text-gray-900 rounded-tl-lg rounded-bl-lg p-0" ></span>}
            </div>

            <div className='flex w-full items-center justify-end p-1 mt-3 pr-0'>
              <button className="text-gray-900 bg-white p-1 pb-3 pr-3 w-full text-right hover:border-white"
                      onClick={()=>props.setState("myComments")}>
                نظرات
              </button>
              <div className="mr-[25px] ">
                <ChatLine size={26} color='#111827' iconStyle='Outline'/>
              </div>
              {props.state==="myComments" && <span className="bg-gray-900 h-[40px] w-[14px] pr-0 text-gray-900 rounded-tl-lg rounded-bl-lg p-0" ></span>}
            </div>

            <div className='flex w-full items-center justify-end p-1 mt-3 pr-0'>
              <button className="text-gray-900 bg-white p-1 pb-3 pr-3 w-full text-right hover:border-white"
                      onClick={()=>props.setState("favoriteLocations")}>
                مکان های مورد علاقه
              </button>
              <div className="mr-[25px] ">
                <Bookmark size={26} color='#111827' iconStyle='Broken'/>
              </div>
              {props.state==="favoriteLocations" && <span className="bg-gray-900 h-[40px] w-[14px] pr-0 text-gray-900 rounded-tl-lg rounded-bl-lg p-0" ></span>}
            </div>

          </div>
      </div>

    )
}
