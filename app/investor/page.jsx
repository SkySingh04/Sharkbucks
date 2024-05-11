'use client'
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from '../firebase';
import Chatbot from '../components/Chatbot';
import './page.css'; // Import custom CSS for styling
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const SmeListingPage = () => {
    const [loanApplications, setLoanApplications] = useState([]);
    const router = useRouter()
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

    const handleViewApp = (applicationId) => {
        router.push("/lication/?id=" + applicationId)
    };

    return (
        <div>
            
            <h1 className="section-title mt-[100px]">Investor Dashboard</h1>
            <button className="" onClick={()=>{router.push("/investorport")}}> VIEW PERSONALISED STARTUP LIST MADE JUST FOR YOU!!!</button>
        <div className='investor-dashboard'>
            
            {/* Left half: Loan Applications */}
            <div className='loan-applications'>
                <h2 className="section-subtitle">SMEs looking for funding</h2>
                <div className="applications-list">
                    {loanApplications.length === 0 ? (
                        <p className="no-applications">No Loan Applications Found</p>
                    ) : (
                        loanApplications.map((application) => (
                            <div key={application.id} className='application-card'>
                                <h3 className='company-name'>{application.companyName}</h3>
                                <p className='loan-details'>Amount: {application.loanAmount}</p>
                                <p className='loan-details'>Status: {application.fundingStatus}</p>
                                <p className='loan-details'>Funding Received: {application.fundingReceived}</p>
                                <div className="button-group">
                                    <button className='view-button' onClick={() => handleViewApp(application.id)}>
                                        View Application
                                    </button>
                                    <button className='bid-button'
                                    onClick={()=> router.push("/bidding/?id="+application.id)}>

                                        Bid
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right half: Chatbot */}
            <div className='chatbot'>
                <h1>We're here to help you! Ask our chatbot Alexa anything you need!</h1>
                <Chatbot />
            </div>
        </div>
        </div>
    );
}

export default SmeListingPage;
