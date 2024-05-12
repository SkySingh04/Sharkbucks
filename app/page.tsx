'use client'
import React, { useEffect, useState } from 'react';
import { FaHandshake, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';
import styles from './Home.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  // State to store random bids
  const [randomBids, setRandomBids] = useState<any[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bids'));
        const bidsData = querySnapshot.docs.map(doc => doc.data());
        console.log(bidsData);
        setRandomBids(bidsData);
        console.log(randomBids)
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    }
    fetchBids();
  }, []);

  // Settings for the carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex justify-space-between">
      {/* <h1 className="text-4xl font-bold text-center mt-[60px] ">#EveryoneIsASHARK</h1> */}
      <div className=''>
      {/* Carousel displaying random bids */}
      <h2 className="text-4xl font-bold text-center mt-[60px] ">Top Bids This Week!</h2>
      <Slider {...carouselSettings} className="w-1/6 max-w-screen-lg mx-auto ">
        
        {randomBids.map((bid, index) => (

          <div key={index} className="p-4 rounded-md">
            <h2 className="text-lg font-bold">{bid.companyName}</h2>
            <p>Amount: {bid.loanAmount}</p>
            <p>Interest Rate: {bid.interestRate}</p>
          </div>
        ))}
      </Slider>
      </div>
      </div>
      <div className="flex flex-wrap items-center justify-center mt-8 md:space-x-[100px]">
        <Link href={{ pathname: '/login', query: { userType: 'investor' } }}>
          <div className={`card bg-gray-900 mx-6 investors-card items-center justify-center lg:h-[300px] lg:w-[500px] text-white font-semibold px-6 py-4 rounded-md cursor-pointer transition-transform  duration-300 ${styles.hoverEffect}`}>
            <FaHandshake className="text-4xl mx-auto mb-4" />
            <h1 className="text-2xl mx-auto text-center mb-2">Investor Dashboard</h1>
            <h1 className='mx-auto text-center '>Find your next investment!</h1>
          </div>
        </Link>

        <Link href={{ pathname: '/login', query: { userType: 'sme' } }}>
          <div className={`card bg-gray-900 mx-6 smes-card items-center justify-center lg:h-[300px] lg:w-[500px]  text-white font-semibold px-6 py-4 rounded-md cursor-pointer transition-transform duration-300 ${styles.hoverEffect}`}>
            <FaBuilding className="text-4xl mx-auto mb-4 " />
            <h1 className="text-2xl mb-2 mx-auto text-center">SME's Dashboard</h1>
            <h1 className='mx-auto text-center'>Find Investors right away!</h1>
          </div>
        </Link>
      </div>
    </div>
  );
}
