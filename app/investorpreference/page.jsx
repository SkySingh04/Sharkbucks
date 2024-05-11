'use client'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDocs , getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';


const ViewApplicationPage = () => {
    const search = useSearchParams();
    const preferenceId = search.get('id');
    const [preference, setPreference] = useState(null);
    const [application , setApplication ] = useState(null)

    useEffect(() => {
        // Fetch application details
        const fetchPreference = async () => {
        
                try {
                    const prefRef = doc(db, 'preferences',preferenceId.toString());
                    const prefSnap = await getDoc(prefRef);
                    console.log(prefSnap)
                    if (prefSnap.exists()) {
                        setApplication(prefSnap.data());
                        console.log(prefSnap.data())
                    }
                } catch (error) {
                    console.error('Error fetching application:', error);
                    
                }
            
        };
        fetchPreference();
    }, [preferenceId]);

    return(
         <></>
    )
}

export default ViewApplicationPage
    

