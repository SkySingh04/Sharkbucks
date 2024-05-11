"use client"
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const SmeListingPage = () => {
    const [loanApplications, setLoanApplications] = useState([]);

    useEffect(() => {
        fetchLoanApplications();
    }, []);

    const fetchLoanApplications = async () => {
        try {
            console.log('Fetching loan applications');
            const querySnapshot = await getDocs(collection(db, "applications"));
            const applicationsData = querySnapshot.docs.map(doc => doc.data());
            // console.log(applicationsData);
            toast.success('Loan applications fetched successfully');
            setLoanApplications(applicationsData);
        } catch (error) {
            console.error('Error fetching loan applications:', error);
            toast.error('Error fetching loan applications');
        }
    };

    return (
        <div className='mt-[6rem] h-screen flex flex-col space-y-10 items-center'>
            <ToastContainer />
            <h1 className="text-4xl font-bold">SME Dashboard</h1>
            <h2 className="text-2xl font-semibold">Existing Loan Applications</h2>
            <ul className="mt-4">
                {loanApplications.length === 0 ? (
                    <li className="text-gray-500">No Loan Applications Found</li>
                ) : (
                    loanApplications.map((application) => (
                        <div key={application.id} className='border border-gray-300 p-4 rounded-md'>
                            <h3 className='text-xl font-semibold'>{application.companyName}</h3>
                            <p className='text-xl font-semibold text-white'>Amount: {application.loanAmount}</p>
                            <p className='text-xl font-semibold text-white'>Status: {application.fundingStatus}</p>
                            <p className='text-xl font-semibold text-white'>Funding Received: {application.fundingReceived}</p>
                            <button onClick={()=>{
                                handleViewApp({applicationId: application.id})
                            }} className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2'>View Application</button>
                        </div>
                    ))
                )}
            </ul>
            </div>
    );
}

export default SmeListingPage;

