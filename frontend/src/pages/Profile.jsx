import {useState} from 'react'
import PersonalInfoForm from "../components/PersonalInfoForm.jsx"
import ProfileNavbar from "../components/ProfileNavbar.jsx"
import Galley from "../components/Galley.jsx"
import MyComments from '../components/MyComments.jsx'
import FavoriteLocations from '../components/FavoriteLocations.jsx'

const Profile= ()=> {
  const [state,setState]=useState("profileInfo");
  return (
    <div className="h-screen w-screen flex justify-right items-right">
      {
        state==="profileInfo" && <PersonalInfoForm/>
      }
      {
        state==="gallery" && <Galley/>
      }
      {
        state==="myComments" && <MyComments/>
      }
      {
        state==="favoriteLocations" && <FavoriteLocations/>
      }
      <ProfileNavbar setState={setState} state={state}/>
    </div>
  )
}

export default Profile;
