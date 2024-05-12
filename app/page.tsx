import React from 'react';
import { FaHandshake, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <h1 className="text-4xl font-bold text-center">#EveryoneIsASHARK</h1>
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
