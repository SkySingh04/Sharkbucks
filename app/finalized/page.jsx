'use client'
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from '../firebase';
import Chatbot from '../components/Chatbot';
import './page.css'; // Import custom CSS for styling
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FinalizedBidsPage = () => {
    const [finalizedBids, setFinalizedBids] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        fetchFinalizedBids();
    }, []);

    const fetchFinalizedBids = async () => {
        try {
            console.log('Fetching finalized bids');
            const querySnapshot = await getDocs(collection(db, "applications"));
            const applicationsData = querySnapshot.docs.map(doc => doc.data());
            const filteredApplications = applicationsData.filter(application => application.fundingStatus === 'finalized');
            toast.success('Finalized bids fetched successfully');
            setFinalizedBids(filteredApplications);
        } catch (error) {
            console.error('Error fetching finalized bids:', error);
            toast.error('Error fetching finalized bids');
        }
    };

    const handlePaymentPage = () => {
        router.push("/paymentpage");
    };

    return (
        <div className="page">
            <h1 className="section-title mt-[100px]">Finalized Bids</h1>
            <button className="pref flex justify-end mx-auto border border-amber-500 p-4" onClick={() => { router.push("/investorport") }}> View Personalised Preferences </button>
            <div className='investor-dashboard'>
                {/* Left half: Finalized Bids */}
                <div className='loan-applications'>
                    <h2 className="section-subtitle">Your Finalized Bids</h2>
                    <div className="applications-list">
                        {finalizedBids.length === 0 ? (
                            <p className="no-applications">No Finalized Bids Found</p>
                        ) : (
                            finalizedBids.map((application) => (
                                <div key={application.id} className='application-card'>
                                    <h3 className='company-name'>{application.companyName}</h3>
                                    <p className='loan-details'>Amount: {application.loanAmount}</p>
                                    <p className='loan-details'>Status: {application.fundingStatus}</p>
                                    <p className='loan-details'>Funding Received: {application.fundingReceived}</p>
                                    <div className="button-group">
                                        <button className='view-button' onClick={() => router.push("/viewapplication/?id=" + application.id)}>
                                            View Application
                                        </button>
                                        <button className='bid-button' onClick={handlePaymentPage}>
                                            Finalize Payment
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

export default FinalizedBidsPage;
