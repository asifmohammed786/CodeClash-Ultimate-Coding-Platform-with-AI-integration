import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
    const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt="" 
      className='w-36 h-36 rounded-full mb-6'/>
      <h1 className='flex item-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData ? userData.name : 'Developer'}! 
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>
            {/* Removed duplicate Get Started button */}
    </div>
  )
}

export default Header
