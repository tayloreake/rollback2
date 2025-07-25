// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';
import QuoteModal from '../Quote/QuoteModal';
import { Http2ServerRequest } from 'node:http2';
import Link from "next/link";

const services = [
    {
        title: 'Household',
        link: '/services/household-moving',
        icon: '/icons/household.png'
    },
    {
        title: 'Office',
        link: '/services/office-moving',
        icon: '/icons/office.png'
    },
    {
        title: 'Corporate',
        link: '/services/corporate-moving',
        icon: '/icons/corporate.png'
    },
    {
        title: 'Warehousing',
        link: '/services/warehousing-and-storage',
        icon: '/icons/warehouse.png'
    },
];

const HeroSection: React.FC = () => {
    return (
        <section className="w-full bg-[url('/assets/Bgs/taylor-packaging-boxes.png')] bg-cover bg-center">
            <div className='row'>
                <div className="md:bg-[#EDEDED] md:w-1/2 py-16 px-6 clip-path-card lg:px-16 items-center justify-center text-center lg:text-left lg:items-start">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white text-center md:text-left md:!text-gray-900 mb-4 !leading-[1.2]">
                        Experience <br /> Delightful Moving!
                    </h2>
                    <div className="h-0.5 w-24 bg-orange-500 mb-6" />

                    <p className="text-white md:!text-gray-700 mb-8 max-w-md md:block hidden">
                        We support businesses through periods of expansion, succession, and all other important transitions.
                    </p>

                    <div className="grid grid-cols-2 sm:flex gap-6 mb-8">
                        {services.map((service) => (
                            <div key={service?.title} className="flex flex-col">
                                <Link href={service?.link} className="items-center flex flex-col">
                                    <div className="">
                                        <Image src={service.icon} alt={service.title} width={40} height={40} />
                                    </div>
                                    <span className="text-white md:!text-gray-700 mt-2 text-sm font-medium">{service.title}</span>
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="mt-12 lg:mt-0 lg:w-1/2 relative">

                    <span className='absolute bottom-[40px] md:bottom-[20%] left-1/2 transform -translate-x-1/2 transition'><QuoteModal quotebtn={"orange"} /></span>

                </div>
            </div>
        </section >
    );
};

export default HeroSection;
