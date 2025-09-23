import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { FaTwitter, FaFacebook, FaLinkedin, FaChevronDown } from 'react-icons/fa'
import { Drawer } from 'antd'
import { useRouter } from 'next/router'
import client from '../sanity/config/client-config'
import QuoteForm from './Quote/Form'
import imageUrlBuilder from '@sanity/image-url'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [logoImage, setLogoImage] = useState(null)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
    const servicesDropdownRef = useRef(null)
    const router = useRouter()
    
    // Create urlFor function
    const builder = imageUrlBuilder(client)
    const urlFor = (source) => builder.image(source)

    const mainServicesItems = [
        { name: 'Residential Moving', href: '/services/residential-moving' },
        { name: 'Office Relocation', href: '/services/office-relocation' },
        { name: 'Corporate Staff Relocation', href: '/services/corporate-staff-relocation' },
        { name: 'International Moving', href: '/services/international-moving' },
        { name: 'Storage Services', href: '/services/storage-services' },
        { name: 'Consolidated Moves', href: '/services/consolidated-moves' }
    ]

    useEffect(() => {
        setIsClient(true)
        
        const handleStorageChange = () => {
            try {
                const logos = localStorage.getItem("siteLogos")
                if (logos) {
                    const parsedLogos = JSON.parse(logos)
                    setLogoImage(parsedLogos[0]?.headerLogo)
                }
            } catch (error) {
                console.error('Error parsing site logos:', error)
            }
        }
        
        window.addEventListener("site-logos", handleStorageChange)
        handleStorageChange() // Call once on mount
        
        return () => {
            window.removeEventListener("site-logos", handleStorageChange)
        }
    }, [])

    // Handle click outside for services dropdown
    useEffect(() => {
        if (!isClient) return

        const handleClickOutside = (event) => {
            if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
                setServicesDropdownOpen(false)
            }
        }

        if (servicesDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [servicesDropdownOpen, isClient])


    // Quote Component
    const ShowQuote = () => {
        const [quoteOpen, setQuoteOpen] = useState(false)
        const menuRef = useRef(null)

        useEffect(() => {
            if (!isClient) return
            
            const handleClickOutside = (e) => {
                if (menuRef.current && !menuRef.current.contains(e.target)) {
                    setQuoteOpen(false)
                }
            }

            const handleFormSubmit = () => setQuoteOpen(false)

            document.addEventListener('mousedown', handleClickOutside)
            window.addEventListener("tayloreaFormSubmitted", handleFormSubmit)

            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                window.removeEventListener('tayloreaFormSubmitted', handleFormSubmit)
            }
        }, [])

        return (
            <div ref={menuRef} className='relative inline-block mb-2'>
                <div
                    onClick={() => setQuoteOpen(!quoteOpen)}
                    className='cursor-pointer rounded-lg shadow-sm px-3 py-2 bg-[#FF5000] hover:bg-[#e04400] transition-colors duration-200'
                >
                    <span className='font-medium text-sm text-white'>Get Quote</span>
                </div>

                {isClient && quoteOpen && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-[9999]">
                        <span 
                            className='close-toggle-quote-form' 
                            onClick={() => setQuoteOpen(false)}
                        >
                            X
                        </span>
                        <QuoteForm />
                    </div>
                )}
            </div>
        )
    }

    // Services Dropdown Component
    const ServicesDropdown = () => {
        if (!isClient) {
            return (
                <Link href='/services' className='nav-link-modern'>
                    <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm flex items-center space-x-1'>
                        <span>Services</span>
                        <FaChevronDown size={12} />
                    </div>
                </Link>
            )
        }

        return (
            <div className="relative" ref={servicesDropdownRef}>
                <Link
                    href='/services'
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    className="px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm flex items-center space-x-1"
                >
                    <span>Services</span>
                    <FaChevronDown className={`transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} size={12} />
                </Link>
                
                {servicesDropdownOpen && (
                    <div 
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] animate-fade-in-down"
                        onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                        <div className="py-2">
                            <Link 
                                href='/services'
                                className="block px-4 py-3 text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-[#FF5000]/10 hover:to-[#FF8A50]/10 hover:text-[#FF5000] transition-all duration-200 text-sm border-b border-gray-100 mb-1"
                                onClick={() => setServicesDropdownOpen(false)}
                            >
                                🏠 View All Services
                            </Link>
                            
                            {/* All Services */}
                            <div className="px-4 py-2">
                                {mainServicesItems.map((item, index) => (
                                    <div key={`service-${index}`} className="relative">
                                        {/* Regular service items */}
                                        <Link 
                                            href={item.href}
                                            className="block px-3 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-[#FF5000]/10 hover:to-[#FF8A50]/10 hover:text-[#FF5000] transition-all duration-200 font-medium text-sm rounded-md mb-1"
                                            onClick={() => setServicesDropdownOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Use enhanced styling for all pages (standardized design)
    const [isEnhancedHomePage, setIsEnhancedHomePage] = useState(true)
    useEffect(() => {
        // Always use enhanced styling for consistent design across all pages
        setIsEnhancedHomePage(true)
    }, [router?.asPath])

    return (
        <div className="w-full">
            {/* Phone number bar - always at top */}
            <div className={`w-full hidden md:block ${
                isEnhancedHomePage ? 'fixed top-0 left-0 right-0 z-50' : ''
            }`}>
                <div className={`w-full flex flex-row items-center justify-end px-8 py-2 ${
                    isEnhancedHomePage 
                        ? 'navbar-glass-phone' 
                        : 'bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'
                }`}>
                    <a href='tel:+254721410517'
                        className={`flex flex-row justify-end font-bold hover-glow rounded-lg px-3 py-1 transition-all duration-300 ${
                            isEnhancedHomePage ? 'text-white' : 'text-[#FF5000]'
                        }`}>
                        <span className="mr-2 text-sm text-[#FF5000]">Call: </span>
                        <span className={`text-sm ${
                            isEnhancedHomePage ? 'text-[#FF5000] font-bold' : 'gradient-text'
                        }`}>+254 721410517</span>
                    </a>
                </div>
            </div>
                
            {/* Mobile phone number bar */}
            <div className={`md:hidden w-full ${
                isEnhancedHomePage ? 'fixed top-0 left-0 right-0 z-50' : ''
            }`}>
                <div className={`w-full flex flex-row items-center justify-center px-4 py-2 ${
                    isEnhancedHomePage 
                        ? 'navbar-glass-phone' 
                        : 'bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'
                }`}>
                    <a href='tel:+254721410517'
                        className={`flex flex-row justify-center font-bold hover-glow rounded-lg px-3 py-1 transition-all duration-300 ${
                            isEnhancedHomePage ? 'text-white' : 'text-[#FF5000]'
                        }`}>
                        <span className="mr-2 text-sm text-[#FF5000]">Call: </span>
                        <span className={`text-sm ${
                            isEnhancedHomePage ? 'text-[#FF5000] font-bold' : 'gradient-text'
                        }`}>+254 721410517</span>
                    </a>
                </div>
            </div>
                
            {/* Mobile navbar */}
            <div className={`md:hidden fixed left-0 right-0 z-40 ${
                isEnhancedHomePage 
                    ? 'top-10' 
                    : 'top-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            }`}>
                <div className={`max-w-7xl mx-auto px-4 h-16 flex items-center justify-between ${
                    isEnhancedHomePage 
                        ? 'bg-white/10 backdrop-blur-md rounded-lg mx-4 my-2 border border-white/20' 
                        : ''
                }`}>
                    <Link href='/' className='flex-shrink-0 transition-transform duration-200 hover:scale-105'>
                        <Image 
                            className='object-contain' 
                            src={isClient && logoImage && urlFor ? urlFor(logoImage.image).url() : '/assets/General/logo.png'}
                            width={100} 
                            height={40} 
                            alt='Taylor Movers Logo' 
                        />
                    </Link>
                    
                    <div className='flex items-center space-x-3'>
                        <ShowQuote />
                        <button 
                            onClick={() => setOpen(true)}
                            className={`p-2.5 rounded-lg transition-all duration-200 border shadow-sm ${
                                isEnhancedHomePage 
                                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30 text-black' 
                                    : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 border-gray-200 text-black'
                            }`}
                        >
                            <AiOutlineMenu size={20} className="text-black" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className={`md:hidden ${
                isEnhancedHomePage ? 'h-[120px]' : 'h-[104px]'
            }`}></div>

            {/* Desktop navbar */}
            <div className={`hidden md:flex w-full py-3 px-6 flex-row justify-center items-center ${
                isEnhancedHomePage ? 'fixed top-10 left-0 right-0 z-40' : ''
            }`}>
                <div className={`w-full max-w-7xl flex flex-row justify-between items-center px-6 py-3 animate-fade-in-up ${
                    isEnhancedHomePage 
                        ? 'navbar-glass rounded-2xl shadow-2xl' 
                        : 'glass-card backdrop-blur-md rounded-2xl shadow-xl'
                }`}>
                    <Link href='/' className='hover-scale animate-fade-in-left'>
                        <Image 
                            src={isClient && logoImage && urlFor ? urlFor(logoImage.image).url() : '/assets/General/logo.png'}
                            width={180} 
                            height={42} 
                            alt='Taylor Movers Logo' 
                            className='transition-all duration-300' 
                        />
                    </Link>
                    <nav className={`flex items-center px-3 py-2 animate-fade-in-right ${
                        isEnhancedHomePage 
                            ? 'navbar-glass-nav rounded-xl shadow-lg' 
                            : 'bg-gradient-to-r from-[#FF5000] to-[#FF8A50] rounded-xl shadow-lg'
                    }`}>
                        <Link href='/' className='nav-link-modern'>
                            <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm'>
                                Home
                            </div>
                        </Link>
                        <Link href='/About' className='nav-link-modern'>
                            <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm'>
                                About us
                            </div>
                        </Link>
                        <Link href='/Gallery' className='nav-link-modern'>
                            <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm'>
                                Gallery
                            </div>
                        </Link>
                        <ServicesDropdown />
                        <Link href='/Blog' className='nav-link-modern'>
                            <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm'>
                                Blog
                            </div>
                        </Link>
                        <Link href='/faq' className='nav-link-modern'>
                            <div className='px-3 py-1.5 text-[#FF5000] font-medium hover:bg-white/20 rounded-lg transition-all duration-300 hover-scale text-sm'>
                                FAQ
                            </div>
                        </Link>
                    </nav>
                    <ShowQuote />
                </div>
            </div>
            
            {/* Spacer for desktop navbar on enhanced home page */}
            <div className={`hidden md:block ${
                isEnhancedHomePage ? 'h-[100px]' : ''
            }`}></div>

            {/* Mobile drawer */}
            {isClient && (
                <Drawer 
                    closeIcon={false} 
                    placement="left" 
                    onClose={() => setOpen(false)} 
                    open={open}
                    className='modern-drawer'
                    width={320}
                    styles={{
                        body: {
                            background: '#ffffff',
                            padding: 0
                        }
                    }}
                >
                    <div className='flex flex-col w-full h-full'>
                        {/* Header */}
                        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-white'>
                            <Link href='/' onClick={() => setOpen(false)} className='transition-transform duration-200 hover:scale-105'>
                                <Image 
                                    src={logoImage && urlFor ? urlFor(logoImage.image).url() : '/assets/General/logo.png'}
                                    alt='Taylor Movers Logo' 
                                    width='120' 
                                    height='40' 
                                    className='object-contain' 
                                />
                            </Link>
                            <button 
                                onClick={() => setOpen(false)} 
                                className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
                            >
                                <AiOutlineClose size={20} className='text-gray-600' />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className='flex-1 px-6 py-8 bg-white'>
                            <div className='space-y-1'>
                                <Link href='/' onClick={() => setOpen(false)} className='block'>
                                    <div className='flex items-center py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'>
                                        Home
                                    </div>
                                </Link>
                                
                                <Link href='/About' onClick={() => setOpen(false)} className='block'>
                                    <div className='flex items-center py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'>
                                        About us
                                    </div>
                                </Link>
                                
                                <Link href='/Gallery' onClick={() => setOpen(false)} className='block'>
                                    <div className='flex items-center py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'>
                                        Gallery
                                    </div>
                                </Link>
                                
                                {/* Services with dropdown */}
                                <div>
                                    <button 
                                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                        className='flex items-center justify-between w-full py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'
                                    >
                                        <span>Services</span>
                                        <FaChevronDown 
                                            size={14} 
                                            className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} 
                                        />
                                    </button>
                                    
                                    {mobileServicesOpen && (
                                        <div className='ml-6 mt-2 space-y-3 animate-fade-in-down'>
                                            {/* View all services link */}
                                            <Link 
                                                href='/services' 
                                                onClick={() => {setOpen(false); setMobileServicesOpen(false);}} 
                                                className='block py-2.5 px-3 text-sm font-semibold text-[#FF5000] hover:bg-[#FF5000]/10 rounded-md transition-all duration-200'
                                            >
                                                🏠 View All Services
                                            </Link>
                                            
                                            {/* All Services */}
                                            <div className='space-y-1'>
                                                {mainServicesItems.map((item, index) => (
                                                    <div key={`mobile-service-${index}`}>
                                                        {/* Regular service items */}
                                                        <Link 
                                                            href={item.href} 
                                                            onClick={() => {setOpen(false); setMobileServicesOpen(false);}} 
                                                            className='block py-2.5 px-3 text-sm text-gray-600 hover:text-[#FF5000] hover:bg-gray-50 rounded-md transition-all duration-200'
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <Link href='/Blog' onClick={() => setOpen(false)} className='block'>
                                    <div className='flex items-center py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'>
                                        Blog
                                    </div>
                                </Link>
                                
                                <Link href='/faq' onClick={() => setOpen(false)} className='block'>
                                    <div className='flex items-center py-3 px-3 text-gray-700 hover:text-[#FF5000] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium'>
                                        FAQ
                                    </div>
                                </Link>
                            </div>
                        </nav>

                        {/* Footer */}
                        <div className='px-6 py-6 border-t border-gray-100'>
                            <div className='text-center'>
                                <p className='text-sm text-gray-500 mb-4'>Connect with us</p>
                                <div className='flex justify-center space-x-4'>
                                    <Link href='https://www.linkedin.com/company/taylor-movers-ea/?originalSubdomain=ke'>
                                        <div className='w-10 h-10 rounded-full bg-gray-100 hover:bg-[#FF5000] flex items-center justify-center transition-all duration-200 group'>
                                            <FaLinkedin size={16} className='text-gray-600 group-hover:text-white transition-colors duration-200' />
                                        </div>
                                    </Link>
                                    <Link href='https://twitter.com/taylormoverske'>
                                        <div className='w-10 h-10 rounded-full bg-gray-100 hover:bg-[#FF5000] flex items-center justify-center transition-all duration-200 group'>
                                            <FaTwitter size={16} className='text-gray-600 group-hover:text-white transition-colors duration-200' />
                                        </div>
                                    </Link>
                                    <Link href='https://web.facebook.com/taylormoversea'>
                                        <div className='w-10 h-10 rounded-full bg-gray-100 hover:bg-[#FF5000] flex items-center justify-center transition-all duration-200 group'>
                                            <FaFacebook size={16} className='text-gray-600 group-hover:text-white transition-colors duration-200' />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer>
            )}
        </div>
    )
}

export default Navbar