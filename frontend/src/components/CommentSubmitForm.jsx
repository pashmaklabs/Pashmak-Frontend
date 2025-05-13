import { useState} from 'react'
import RatingStars from './RatingStars'
import { useNavigate } from "react-router-dom";
import { CameraAdd,CloseCircle } from 'solar-icon-set'
import moment from 'jalali-moment'
import { useUserLogin } from "../stores/login";

export default function CommentSubmitForm(props) {
  const [rate,setRate]=useState(0)
  const [photos,setPhotos]=useState([])
  const [commentText,setCommentText]=useState("")
  const navigate = useNavigate();
  const { userLogin } = useUserLogin();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // const handleDeletePhotoButton=(deletedPhoto)=>{
  //   setPhotos(photos.filter(item=>item!==deletedPhoto))
  // }
  // const handleAddPhotoButton=(e)=>{
  //   e.preventDefault()
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setPhotos([...photos,imageUrl])
  //   }
  // }

  const handleCommentTextChange=(e)=>{
    setCommentText(e.target.value)
  }

  const handleDiscardClick=(e)=>{
    e.preventDefault()
    props.setShowCommentForm(false)
  }

  const handleCommentSubmit=(e)=>{
    e.preventDefault()
    if(userLogin)
    {
      const dummyUser={first_name:"a",last_name:"b",avatar_url:"/profilePhotoPlaceholder.svg",numberOfComments:144}
      const date=moment().locale('fa').format('YYYY/MM/DD');
      //const date="2025-04-10";
      const text=commentText
      const rating=rate;
      const numberOfLikes=1;
      const numberOfDislikes=0;
      const newComments=[{user:dummyUser,created_at:date,content:text,rating:rating,likes:numberOfLikes,dislikes:numberOfDislikes},...props.comments]
      props.setComments(newComments)
      
      props.setShowCommentForm(false)
    }
    else
    {
      setShowLoginPopup(true)
    }
  }
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <form className='flex flex-col w-full items-start justify-center gap-4 h-full'>

        {/*rating*/}
        <div className='flex flex-col items-center justify-center w-full py-2 gap-3 pt-5'>
          <span className='text-gray-900 text-center w-full text-xl'>به این مکان امتیاز بدهید</span>
          <RatingStars onRate={setRate}/>
        </div>

        {/*comment*/}
        <div className='flex items-center justify-center w-full px-3' >
          <textarea className='bg-white text-start text-gray-900 
                    border border-gray-200 rounded-lg w-full focus:outline-none
                    resize-none scrollbar-hide px-2 py-1 h-[100px]' 
                    placeholder='نظر خود را درباره این مکان بنویسید'
                    value={commentText}
                    onChange={handleCommentTextChange}
                    >
          </textarea>
        </div>

        {/*add photo button*/}
        {/* <div className="flex flex-col justify-center items-center w-full gap-2">
          <label className='flex items-center gap-2 justify-center border-gray-300 border rounded-full p-2'>
            <input
                  type="file"
                  accept="image/*"
                  className='hidden'
                  onChange={handleAddPhotoButton}
            />
            <CameraAdd size={24} color='#111827' iconStyle="Outline"/>
            <span className='text-gray-900'>اضافه کردن تصویر</span>
          </label>

          {photos.length > 0 && 
            <div className="flex justify-center items-center
                            gap-x-7 w-[90%] p-2 overflow-y-scroll 
                            h-[100px] border-gray-400 border bg-white
                            rounded-lg scrollbar-hide">
              {
                photos.map((photo,index) => (
                  <div className=' relative flex flex-col justify-center items-center h-[90px] aspect-square rounded-lg' 
                      key={index}
                  >
                    <button className='absolute flex items-center
                                      justify-center top-1 right-1 
                                      bg-white h-[13px] w-[13px] p-0 m-0
                                      border-none focus:outline-none' 
                            onClick={(e)=>{
                                          e.preventDefault();
                                          handleDeletePhotoButton(photo)
                                      }
                                    }
                    >
                      <div className='flex justify-center items-center w-[15px] h-[15px] p-0 m-0'>
                        <CloseCircle size={15} color='#A78BFA' iconStyle='Outline'/>
                      </div>
                    </button>
                    
                    <img className='w-[75px] aspect-square rounded-xl border-[1px] border-gray-400' src={photo}/>
                  </div>
                )
                )
              }
            </div>
          }
        </div> */}

        {/*submit and discard buttons*/}
        <div className="flex justify-center items-center w-full gap-3 ">
          <button
            type="submit"
            onClick={handleCommentSubmit}
            disabled={rate===0}
            className="w-[40%] bg-white border border-purple-500
                                     text-purple-500 text-sm rounded-lg 
                                      focus:outline-none focus:border-purple-500 hover:border-purple-500 
                                      disabled:text-purple-300 disabled:border-purple-300"
          >
            ثبت 
          </button>
          <button
            onClick={handleDiscardClick}
            className="w-[40%] rounded-md text-gray-700
                     bg-gray-400 text-sm border-zinc-700
                       border-[1px] hover:border-zinc-700
                       focus:outline-none"
          >
            لغو
          </button>
        </div>
        {showLoginPopup && (
        <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-3xl shadow-lg w-1/3 max-w-[400px] min-w-[200px]">
          <div className="text-right">
            <p className="mb-4 font-bold text-black">ورود به حساب کاربری</p>
            <p className="mb-4 text-gray-500">لطفا برای استفاده از این امکان وارد حساب کاربری خود شوید</p>
            </div>
            <div className="flex justify-center space-x-10">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
              >
                بعدا
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowLoginPopup(false);
                  navigate("/login");
                }
              }
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
              >
                ورود به حساب
              </button>
            </div>
          </div>
        </div>
        )}

      </form>
    </div>
  )
}
