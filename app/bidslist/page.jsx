"use client"
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs , doc , getDoc} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

const MyComponent = () => {
    const [filteredBids, setFilteredBids] = useState([]);
    const [names, setNames] = useState({})
    const search = useSearchParams();
    const id = search.get("id")
    console.log(id);

    useEffect(() => {
        const fetchFilteredBids = async () => {
            try {
                // Define the query
                const q = query(collection(db, 'bids') , where('applicationId', '==', id));

                // Fetch the documents that match the query
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot)

                // Extract data from the query snapshot
                const filteredBidsData = [];
                querySnapshot.forEach(async (document) => {
                    // Assuming each documentument has a "data" method to extract data
                    console.log(document.data())
                    const bid = document.data()
                    filteredBidsData.push(document.data());
                    const usersRef = doc(db, 'users', bid.userId.toString());
                    const userSnap = await  getDoc(usersRef);
                    if (userSnap.exists()) {
                        console.log('User data:', userSnap.data());
                        names[bid.userId] = userSnap.data().displayName
                        console.log("names" , names)
                    }
                });
                // Update state with filtered bids
                setFilteredBids(filteredBidsData);
            } catch (error) {
                console.error('Error fetching filtered bids:', error);
            }
        };

        // Call the function to fetch filtered bids
        fetchFilteredBids()
    }, []); // Run this effect only once, on component mount
    // Render your component with filteredBids state
    return (
        <div className='h-screen'>
            <h2 className="text-xl font-bold mb-4 mt-32">Bids Received</h2>
            <div className=" grid grid-cols-3 gap-4">
                {filteredBids.map((bid) => (
                    <div key={bid.bidId} className="bg-gray-800 text-white rounded-md p-4">
                        {console.log(names)}
                        {console.log(bid.userId)}
                         <p>Name: {names[bid.userId]}</p> 
                         <p>Rate of Interest: {bid.interestRate}</p>
                         <p>Tenure: {bid.tenure}</p>
                         <button
                        onClick={() => handleAcceptBid(bid.bidId)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Finalize Bid
                    </button>
                    </div>
                    
                
                ))}
            </div>
        </div>
    );
};

export default MyComponent;
