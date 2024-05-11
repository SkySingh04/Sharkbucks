'use client'
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css'; 
import Chatbot from '../components/Chatbot';
import { BsAlignCenter } from 'react-icons/bs';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in with UID:', user.uid);
                setLoggedInUser(user.uid);
            } else {
                router.push(`/`);
            }
        })
    }, []);

    const handleViewApp = ({ applicationId }: any) => {
        // Push to view application page with the application id as a query parameter
        router.push(`/viewapplication?id=${applicationId}`);
    }

    const [loanApplications, setLoanApplications] = useState<any>([]);
    const [loggedInUser, setLoggedInUser] = useState<any>('');

    // Fetch existing loan applications
    useEffect(() => {
        fetchLoanApplications();
    }, [loggedInUser]);

    const fetchLoanApplications = async () => {
        try {
            console.log('Fetching loan applications for user:', loggedInUser);
            const docRef = getDocs(collection(db, "applications"));
            if (docRef) {
                const applications: ((prevState: never[]) => never[]) | unknown[] = [];
                (await docRef).forEach((doc) => {
                    console.log(doc.data().userId);
                    if (doc.data().userId === loggedInUser) {
                        applications.push(doc.data());
                    }
                });
                console.log("Applications found for user:", loggedInUser, applications);
                toast.success("Applications found!");
                setLoanApplications(applications);
            }
            // setLoanApplications(docSnap.data());
            else {
                console.log("No applications found for user:", loggedInUser);
                toast.warn("No applications found!");
                setLoanApplications([]);
            }

        } catch (error) {
            toast.error("Error fetching loan applications!");
            console.error('Error fetching loan applications:', error);
        }
    };

    const createNewApplication = async () => {
        router.push('/newapplication');
    };

    return (
         <div className='mt-[6rem] h-screen flex flex-col space-y-10 items-center'>
            <ToastContainer />
            <div className='mt-32'>
            <h1 className="section-title">SME Dashboard</h1>
               
            <button className="create-application-button flex justify-end mx-auto " onClick={createNewApplication}>Create New Application</button>

      
        </div>
        <div className='dashboard-container'>
            
            <div className='left-side'>
                
                <h2 className="section-subtitle">Existing Loan Applications</h2>
                <ul className="applications-list">
                    {loanApplications.length === 0? (
                        <li className="no-applications">No Loan Applications Found</li>
                    ) : (
                        loanApplications.map((application: any) => (
                            <div key={application.id} className='application-card'>
                                <h3 className='company-name'>{application.companyName}</h3>
                                <p className='loan-details'>Amount: {application.loanAmount}</p>
                                <p className='loan-details'>Status: {application.fundingStatus}</p>
                                <p className='loan-details'>Funding Received: {application.fundingReceived}</p>
                                <button className='view-button' onClick={() => { handleViewApp({ applicationId: application.id }) }}>
                                    View Application
                                </button>
                            </div>
                        ))
                    )}
                </ul>
                
            </div>
            <div className='right-side'>
                <h1>We're here to help you! Ask our chatbot Alexa anything you need!</h1>
                <Chatbot />
            </div>
            <div className='right-side'>
            </div>
        </div>
        </div>
    );
};

export default DashboardPage;

