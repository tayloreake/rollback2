import React from 'react'

const PageTitle = ({title}) => {
  return (
    <div className='w-full flex py-3 px-4 md:px-8 text-white bg-[#182C4D]'>
        <div className='font-[500]'>{title}</div>
    </div>
  )
}

export default PageTitle;