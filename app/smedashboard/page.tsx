'use client'
import React, { useState, useEffect } from 'react';
import {auth , db} from '../firebase';
import { doc, getDoc,getDocs , collection} from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
const DashboardPage: React.FC = () => {
    const router = useRouter();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                console.log('User is signed in with UID:', user.uid);
                setLoggedInUser(user.uid);

            }
            else{
                router.push(`/`);
            }
    })
 }, []);

 const handleViewApp = ({applicationId} :  any) => {
    //push to view application page with the application id as a query parameter
    router.push(`/viewapplication?applicationId=${applicationId}`);
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
            if(docRef){
                const applications: ((prevState: never[]) => never[]) | unknown[] = [];
                (await docRef).forEach((doc) => {
                    console.log(doc.data().userId);
                    if(doc.data().userId === loggedInUser ){
                        applications.push(doc.data());
                    }
                });
                console.log("Applications found for user:", loggedInUser, applications);
                setLoanApplications(applications);
            }
            // setLoanApplications(docSnap.data());
            else {
                console.log("No applications found for user:", loggedInUser);   
                setLoanApplications([]);
            }
            
        } catch (error) {
            console.error('Error fetching loan applications:', error);
        }
    };

    const createNewApplication = async () => {
        router.push('/newapplication');
    };

    return (
        <div className='mt-[6rem] h-screen flex flex-col space-y-10 items-center'>
            <h1 className="text-4xl font-bold">SME Dashboard</h1>
            <h2 className="text-2xl font-semibold">Existing Loan Applications</h2>
            <ul className="mt-4">
                {loanApplications.length === 0 ? (
                    <li className="text-gray-500">No Loan Applications Found</li>
                ) : (
                    loanApplications.map((application: any) => (
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
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={createNewApplication}>Create New Application</button>
        </div>
    );
};

export default DashboardPage;