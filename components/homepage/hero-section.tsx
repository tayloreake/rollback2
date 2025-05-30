// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';

const services = [
    { title: 'Household', icon: '/icons/household.png' },
    { title: 'Office', icon: '/icons/office.png' },
    { title: 'Corporate', icon: '/icons/corporate.png' },
    { title: 'Warehousing', icon: '/icons/warehouse.png' },
];

const HeroSection: React.FC = () => {
    return (
        <section className="w-full bg-[url('/assets/Bgs/boxes.png')] bg-cover bg-center">
            <div className='row'>
                <div className="md:bg-[#EDEDED] md:w-1/2 py-16 px-6 clip-path-card lg:px-16 items-center justify-center text-center lg:text-left lg:items-start">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white text-center md:text-left md:!text-gray-900 mb-4 !leading-[1.2]">
                        Experience <br /> Delightful Moving!
                    </h1>
                    <div className="h-0.5 w-24 bg-orange-500 mb-6" />

                    <p className="text-white md:!text-gray-700 mb-8 max-w-md">
                        We support businesses through periods of expansion, succession, and all other important transitions.
                    </p>

                    <div className="grid grid-cols-2 sm:flex gap-6 mb-8">
                        {services.map((service) => (
                            <div key={service.title} className="flex flex-col items-center">
                                <div className="">
                                    <Image src={service.icon} alt={service.title} width={40} height={40} />
                                </div>
                                <span className="mt-2 text-sm font-medium">{service.title}</span>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="mt-12 lg:mt-0 lg:w-1/2 relative">

                    <button className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition">
                        REQUEST QUOTE
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
