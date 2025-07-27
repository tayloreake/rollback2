'use client'; // Required for interactivity in app directory
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { BsBookHalf, BsClipboard, BsFillTelephoneFill, BsPeopleFill, BsTruck, BsWhatsapp } from 'react-icons/bs'
import { MdEmail, MdShareLocation } from 'react-icons/md'
import Link from 'next/link'
import { AiOutlineClose, AiOutlineCloseCircle, AiOutlineMenu } from 'react-icons/ai'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Drawer } from 'antd';
import QuoteForm from './Quote/Form'
import { set } from 'sanity';
import { urlFor } from '../lib/sanity';


const Navbar = () => {
    const [open, setOpen] = useState(false)
    // const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');
    const [logoImage, setLogoImage] = useState(null);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onChange = (e) => {
        setPlacement(e.target.value);
    };



    const ShowQuote = () => {
        const [open, setOpen] = useState(false);
        const menuRef = useRef(null);
        useEffect(() => {
            // Add event listener to close the drawer when clicking outside of it
            window.addEventListener("tayloreaFormSubmitted", () => setOpen(false));

            return () => document.removeEventListener('tayloreaFormSubmitted', () => setOpen(false));
        }, []);

        useEffect(() => {
            const handler = (e) => {
                if (menuRef.current && !menuRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            const handleManualStorageChange = () => {
                const logos = localStorage.getItem("siteLogos");
                setLogoImage(JSON.parse(logos)[0]?.headerLogo);
            };
            window.addEventListener("site-logos", handleManualStorageChange);
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
        }, []);

        return (
            <div
                className='relative inline-block mb-2 '>
                <div
                    onClick={() => setOpen(!open)}
                    className=''>
                    <div className='right-slanted-box items-center px-2 md:px-4 py-2 bg-[#FF5000] cursor-pointer text-white'>
                        <span className='font-semibold md:text-sm text-xs'>Request a quote</span>
                    </div>
                </div>

                {open && (
                    <div
                        className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-[9999]">
                        <span className='close-toggle-quote-form' onClick={() => setOpen(false)}>X</span>
                        <QuoteForm />
                    </div>
                )}
            </div>

        )
    }

    return (
        <div className='w-full h-full z-50'>
            <div className='h-full container'>
                <div className='bg-[#]  w-full h-full flex flex-row items-center justify-center md:px-8'>
                    <div className=' flex items-end justify-end w-full'>
                        <a href='tel:+254721410517'
                            className='flex flex-row justify-end font-bold text-[#FF5000] py-2'>
                            <span className='text-gray-800 mr-2'>Call: </span>
                            +254 721410517
                        </a>
                        {/* <div className='flex flex-row items-center text-white py-2'>
                        <MdEmail className='mr-2'/>
                        <p className='font-bold text-sm'>sales@taylorea.com</p>
                    </div> */}
                    </div>
                </div>
                <div className='md:hidden py-2 my-2  md:px-4  flex-row justify-center items-center'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <Link href='/'>
                            {!logoImage ?
                                <Image className='object-contain' src='/assets/General/logo.png' width={120} height={100} alt='Taylor Movers Logo' />
                                : <Image
                                    src={urlFor(logoImage?.image).url()}
                                    alt={logoImage?.alt}
                                    width={120}
                                    height={1}
                                    className='object-contain'
                                />
                            }
                        </Link>
                        <AiOutlineMenu size={40} className='mx-2' onClick={() => setOpen(true)} />
                        <ShowQuote />
                    </div>
                </div>


                <div className='hidden md:flex w-full py-2 my-2 px-2  md:px-8  flex-row justify-center items-center'>
                    <div className='w-full flex flex-row justify-between'>
                        <Link href='/'>
                            {!logoImage ?
                                <Image src='/assets/General/logo.png' width={205} height={48} alt='Taylor Movers Logo' />
                                : <Image
                                    src={urlFor(logoImage?.image).url()}
                                    alt={logoImage?.alt}
                                    width={200}
                                    height={1}
                                    className='object-contain w-[150px] md:w-[250px]'
                                />}
                        </Link>
                        <div className='mb-2 left-slanted-box !pl-[32px] text-white font-[500] bg-[#FF5000] px-3 flex flex-row items-center text-sm'>
                            <Link href='/'>
                                <div className='mr-6'>
                                    Home
                                </div>
                            </Link>
                            <Link href='/About'>
                                <div className='mr-6'>
                                    About Us
                                </div>
                            </Link>
                            <Link href='/Services'>
                                <div className='mr-6'>
                                    Services
                                </div>
                            </Link>
                            <Link href='/Blog'>
                                <div className='mr-6'>
                                    Blog
                                </div>
                            </Link>
                            <Link href='/Contacts'>
                                <div className='mr-6'>
                                    Contact Us
                                </div>
                            </Link>
                            <Link href='/Gallery'>
                                <div className='mr-6'>
                                    Gallery
                                </div>
                            </Link>
                            {/* <Link href='/Feedback'>
                                <div className='mr-6'>
                                    Feedback
                                </div>
                            </Link> */}
                        </div>

                        <ShowQuote />


                    </div>
                </div>
            </div>

            <div>
                <Drawer closeIcon={false} placement="left" onClose={onClose} open={open}>
                    <div className='flex flex-col w-full h-full '>
                        <div className='flex w-full items-start justify-between'>
                            <Link href='/'>
                                <Image src='/assets/General/logo.png' alt='/' width='200' height='1' />
                            </Link>
                            <div onClick={() => setOpen(false)} className='rounded-full  p-1 cursor-pointer hover:animate-pulse'>
                                <AiOutlineCloseCircle size={20} />
                            </div>
                        </div>

                        <hr className='my-4 border-3 rounded-full' />

                        <div className=' flex flex-col font-bold'>
                            <Link href='/' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    Home
                                </div>
                            </Link>
                            <Link href='/About' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    About us
                                </div>
                            </Link>
                            <Link href='/Services?service=Household Moving&&subservice=Premoving' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    Services
                                </div>
                            </Link>
                            <Link href='/Blog' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    Blog
                                </div>
                            </Link>
                            <Link href='/Contacts' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    Contact Us
                                </div>
                            </Link>
                            <Link href='/Gallery' onClick={() => setOpen(false)}>
                                <div className='flex flex-row px-4 items-center py-2'>
                                    Gallery
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