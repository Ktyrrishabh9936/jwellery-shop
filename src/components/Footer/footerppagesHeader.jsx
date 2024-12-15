import React from 'react'

export default function FooterHead({title}) {
  
  return (
    <div className='  flex  items-center pb-16 bg-pink-400' >
      <div className=" pl-16 py-8 text-6xl sm:text-[clamp(3rem,4vw,5rem)] font-extrabold   font-Inter  text-white relative ">
        <div className=' relative flex flex-col z-0 leading-[4rem] md:leading-[5rem] xl:leading-[7rem]'>
      <span>{title}</span>
        </div>
      </div>
    </div>
  )
}
