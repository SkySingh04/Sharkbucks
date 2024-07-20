'use client'
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from '../firebase'; // Import auth for Firebase Authentication
import './page.css'; // Import custom CSS for styling
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged for Firebase Authentication

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BidFinalized = () => {
    const [loanApplications, setLoanApplications] = useState([]);
    const [userId, setUserId] = useState(null); // State to store user ID
    const router = useRouter();
    
    useEffect(() => {
        // Fetch user ID and details on auth state change
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUserId(user.uid);
                fetchLoanApplications(user.uid); // Fetch loan applications with the user ID
            } else {
                router.push("/login");
            }
        });
    }, []);

    const fetchLoanApplications = async (userId) => {
        try {
            console.log('Fetching loan applications');
            const querySnapshot = await getDocs(collection(db, "bids"));
            const applicationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Include the id field in application data
            const finalizedApplications = applicationsData.filter(application => application.status === 'finalized' && application.userId === userId);
            toast.success('Loan applications fetched successfully');
            setLoanApplications(finalizedApplications);
        } catch (error) {
            console.error('Error fetching loan applications:', error);
            toast.error('Error fetching loan applications');
        }
    };

    const handleViewApp = (applicationId) => {
        router.push("/viewapplication/?id=" + applicationId);
    };

    return (
        <div className="page">
            <ToastContainer />
            <h1 className="section-title mt-[100px] text-4xl font-bold text-center">SME's to invest</h1>
            <button className="pref flex justify-end mx-auto border border-amber-500 p-4 rounded-lg mt-4" onClick={() => { router.push("/investorport") }}>View Personalised Preferences</button>
            <div className='investor-dashboard grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
                {/* Left half: Loan Applications */}
                <div className='loan-applications bg-white shadow-lg rounded-lg p-6'>
                    <h2 className="section-subtitle text-2xl font-semibold mb-4">SMEs looking for funding</h2>
                    <div className="applications-list space-y-4">
                        {loanApplications.length === 0 ? (
                            <p className="no-applications text-center text-gray-500">No Loan Applications Found</p>
                        ) : (
                            loanApplications.map((application) => (
                                <div key={application.id} className='application-card p-4 bg-gray-100 rounded-lg shadow-md'>
                                    <h3 className='company-name text-xl font-bold mb-2'>{application.companyName}</h3>
                                    <p className='loan-details text-gray-700'>Amount: {application.loanAmount}</p>
                                    <p className='loan-details text-gray-700'>Status: {application.status}</p>
                                    <p className='loan-details text-gray-700'>Funding Received: {application.fundingReceived}</p>
                                    <div className="button-group mt-4 flex space-x-4">
                                        <button className='view-button bg-blue-500 text-white px-4 py-2 rounded-lg' onClick={() => handleViewApp(application.id)}>
                                            View Application
                                        </button>
                                        <button className='bid-button bg-green-500 text-white px-4 py-2 rounded-lg' onClick={() => router.push("/bidding/?id=" + application.id)}>
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BidFinalized ;
