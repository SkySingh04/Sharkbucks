'use client'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const ViewApplicationPage = () => {
    const search = useSearchParams();
    const applicationId = search.get('id');
    const [application, setApplication] = useState<any>(null);

    useEffect(() => {
        // Fetch application details
        const fetchApplication = async () => {
            if (applicationId) {
                try {
                    const appRef = doc(db, 'applications', applicationId);
                    const appSnap = await getDoc(appRef);
                    if (appSnap.exists()) {
                        setApplication(appSnap.data());
                        toast.success('Application found!');
                    } else {
                        toast.error('Application not found!');
                    }
                } catch (error) {
                    console.error('Error fetching application:', error);
                    toast.error('Error fetching application!');
                }
            }
        };
        fetchApplication();
    }, [applicationId]);

    return (
        <div className="mx-auto mt-24  ">
            {application && (
                <div className="shadow-md grid grid-cols-2 bg-gray-600 rounded-lg gap-4">
                    <h1 className="text-2xl font-bold mb-4">{application.companyName}</h1>
                    <p><strong>Business Type:</strong> {application.businessType}</p>
                    <p><strong>Tags:</strong> {application.tags.join(', ')}</p>
                    <p><strong>Loan Purpose:</strong> {application.loanPurpose}</p>
                    <p><strong>Years in Operation:</strong> {application.yearsInOperation}</p>
                    <p><strong>Annual Revenue:</strong> {application.annualRevenue}</p>
                    <p><strong>Pitch:</strong> {application.pitch}</p>
                    <p><strong>Contact Person:</strong> {application.contactPerson}</p>
                    <p><strong>Phone:</strong> {application.phone}</p>
                    <p><strong>Funding Status:</strong> {application.fundingStatus}</p>
                    <p><strong>Funding Received:</strong> {application.fundingReceived}</p>
                    <p><strong>Loan Amount:</strong> {application.loanAmount}</p>
                    <p><strong>Pitch Video Link:</strong> <a href={application.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">Watch Video</a></p>
                </div>
            )}
        </div>
    );
};

export default ViewApplicationPage;
