import Image from 'next/image'
import React, { useState } from 'react'
import {BsBookHalf, BsClipboard, BsFillTelephoneFill, BsPeopleFill, BsTruck, BsWhatsapp} from 'react-icons/bs'
import {MdEmail, MdShareLocation} from 'react-icons/md'
import Link from 'next/link'
import { AiOutlineClose, AiOutlineCloseCircle, AiOutlineMenu} from 'react-icons/ai'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Drawer } from 'antd';

const Navbar = () => {
    const [open, setOpen] = useState(false)
    // const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    const onChange = (e) => {
      setPlacement(e.target.value);
    };


  return (
    <div className='w-full h-full'>
        <div className='w-full h-full'>
            <div className='bg-[#DB421B]  w-full h-full flex flex-row items-center justify-center md:px-8'>
                <div className='max-w-[1720px] flex flex-row items-end justify-end w-full px-2'>
                    <Link href='https://wa.me/254721410517 ' passHref 
                        className='flex flex-row items-center text-white mr-6  bg-[#182C4D] px-2 py-2'>
                            <BsFillTelephoneFill className='mr-1'/> | <BsWhatsapp className='mr-2 ml-1' />
                            +254 721410517
                    </Link>
                    <div className='flex flex-row items-center text-white py-2'>
                        <MdEmail className='mr-2'/>
                        <p className='font-bold text-sm'>sales@taylorea.com</p>
                    </div>
                </div>
            </div>
            <div className='md:hidden py-2 my-2 px-2  md:px-8  flex-row justify-center items-center'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <Link href='/'>
                        <Image src='/assets/General/logo.png' width={105} height={48}  alt='Taylor Movers Logo' />
                    </Link>
                    <AiOutlineMenu size={30} className='ml-4' onClick={() => setOpen(true)}/>
                </div>
            </div>

        
            <div className='hidden md:flex w-full py-2 my-2 px-2  md:px-8  flex-row justify-center items-center'>
                <div className='max-w-[1720px] w-full flex flex-row justify-between'>
                    <Link href='/'>
                        <Image src='/assets/General/logo.png' width={205} height={48}  alt='Taylor Movers Logo' />
                    </Link>
                    <div className='flex flex-row items-center text-sm'>
                        <Link href='/'>
                            <div className='mr-6'>
                                <p>Home</p>
                            </div>
                        </Link>
                        <Link href='/About'>
                            <div className='mr-6'>
                                <p>About Us</p>
                            </div>
                        </Link>
                        <Link href='/Services'>
                            <div className='mr-6'>
                                <p>Services</p>
                            </div>
                        </Link>
                        <Link href='/Blog'>
                            <div className='mr-6'>
                                <p>Blog</p>
                            </div>
                        </Link>
                        <Link href='/Contacts'>
                            <div className='mr-6'>
                                <p>Contact Us</p>
                            </div>
                        </Link>
                        <Link href='/Gallery'>
                            <div className='mr-6'>
                                <p>Gallery</p>
                            </div>
                        </Link>
                        <Link href='/Feedback'>
                            <div className='mr-6'>
                                <p>Feedback</p>
                            </div>
                        </Link>
                        <Link href='/Quote'>
                            <div className='mr-6 cursor-pointer px-4 flex flex-row items-center justify-center py-2 border border-[#DB421B] rounded-full shadow-sm shadow-[#DB421B] animate-pulse'>
                                <p className='text-[#DB421B]'>Request a quote</p>
                                <BsClipboard className='text-[#DB421B] ml-2'/>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
            
            {/* <Link href='https://wa.me/254721410517 ' passHref>
                <div className='bg-[#182C4D] cursor-pointer w-full h-full max-h-[37px] py-2 flex flex-row items-center justify-center md:px-8'>
                    <div className='max-w-[1720px] flex flex-row items-center justify-center w-full py-2'>
                        <p className='font-bold text-sm text-white'>Click here to chat with us now</p>
                    </div>
                </div>
            </Link> */}
        </div>

        <div>
            <Drawer closeIcon={false} placement="left" onClose={onClose} open={open}>
                <div className='flex flex-col w-full h-full '>
                    <div className='flex w-full items-start justify-between'>
                        <Link href='/'>
                            <Image src='/assets/General/logo.png' alt='/' width='150' height='1' />
                        </Link>
                        <div onClick={() => setOpen(false)} className='rounded-full  p-1 cursor-pointer hover:animate-pulse'>
                            <AiOutlineCloseCircle size={20} />
                        </div>
                    </div>

                    <hr  className='my-4 border-3 rounded-full'/>

                    <div className='py-4 flex flex-col my-4'>                    
                        <Link href='/About' onClick={() => setOpen(false)}>
                            <div className='flex flex-row px-4 items-center shadow-sm border-slate-300 rounded-lg py-4'>
                                <BsTruck size={20} className='text-slate-600 mr-2'/>
                                <p className='text-lg'>
                                    About us
                                </p> 
                            </div>
                        </Link>
                        <Link href='/Services?service=Household Moving&&subservice=Premoving' onClick={() => setOpen(false)}>
                            <div className='flex flex-row px-4 my-2 items-center shadow-sm border-slate-300 rounded-lg py-4'>
                                <BsBookHalf size={20} className='text-slate-600 mr-2'/>
                                <p className='text-lg'>
                                    Services
                                </p> 
                            </div>
                        </Link>
                        <Link href='/Blog' onClick={() => setOpen(false)}>
                            <div className='flex flex-row px-4 my-2 items-center shadow-sm border-slate-300 rounded-lg py-4'>
                                <BsPeopleFill size={20} className='text-slate-600 mr-2'/>
                                <p className='text-lg'>
                                    Blog
                                </p> 
                            </div>
                        </Link>
                        <Link href='/Contacts' onClick={() => setOpen(false)}>
                            <div className='flex flex-row px-4 my-2 items-center shadow-sm border-slate-300 rounded-lg py-4'>
                                <MdShareLocation size={20} className='text-slate-600 mr-2'/>
                                <p className='text-lg'>
                                    Contact Us
                                </p> 
                            </div>
                        </Link>
                        <Link href='/Quote' onClick={() => setOpen(false)}>
                            <div className='flex flex-row px-4 my-2 items-center shadow-sm shadow-[#ffefec] rounded-md py-4 animate-pulse '>
                                <BsClipboard size={20} className='text-[#DB421B] mr-2'/>
                                <p className='text-lg text-[#DB421B]'>
                                    Request A Quote
                                </p> 
                            </div>
                        </Link>
                    </div>
                    
                    <div className='flex flex-col my-4 items-center'>
                        <p className=' text-slate-400'> Follow us on:</p>
                        <div className='flex flex-row w-full justify-evenly mt-4'>
                            <Link href='https://www.linkedin.com/company/taylor-movers-ea/?originalSubdomain=ke'>
                                <div className='rounded-full border p-3 cursor-pointer hover:scale-105 ease-in duration-500'>
                                    <FaLinkedin size={20} className='text-slate-500' />
                                </div>
                            </Link>
                            <Link href='https://twitter.com/taylormoverske'>
                                <div className='rounded-full border p-3 cursor-pointer hover:scale-105 ease-in duration-500'>
                                        <FaTwitter size={20} className='text-slate-500' />
                                </div>
                            </Link>
                            <Link href='https://web.facebook.com/taylormoversea'>
                                <div className='rounded-full border p-3 cursor-pointer hover:scale-105 ease-in duration-500'>
                                        <FaFacebook size={20} className='text-slate-500' />
                                </div>
                            </Link>
                            {/* <div className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-500'>
                            <BsFillPersonLinesFill/>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>

       


    </div>
  )
}

export default Navbar