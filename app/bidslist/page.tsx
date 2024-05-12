"use client"
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs , doc , getDoc, updateDoc} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const MyComponent = () => {
    const [filteredBids, setFilteredBids] = useState<any[]>([]);
    const [names, setNames] = useState<{ [key: string]: string }>({});
    const [finalizedBids, setFinalizedBids] = useState<string[]>([]);
    const search = useSearchParams();
    const router = useRouter();
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
                const filteredBidsData: any[] = [];
                querySnapshot.forEach(async (document) => {
                    // Assuming each document has a "data" method to extract data
                    console.log(document.data())
                    const bid = document.data()
                    filteredBidsData.push(document.data());
                    const usersRef = doc(db, 'users', bid.userId.toString());
                    const userSnap = await  getDoc(usersRef);
                    if (userSnap.exists()) {
                        console.log('User data:', userSnap.data());
                        setNames(prevNames => ({ ...prevNames, [bid.userId]: userSnap.data().displayName }));
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
    const handleFinalizeBid = async (bid: any) => {
        console.log(bid);
        const querySnapshot = getDocs(collection(db, 'bids'));
        (await querySnapshot).forEach(async (document) => {
            if (document.data().applicationId === bid.applicationId) {
                await updateDoc(doc(db, 'bids', document.id), {
                    status: 'finalized',
                });
            }
        }
        );
        console.log('Bid finalized:', bid);
        router.push("/")
    };

    return (
        <div className='h-screen'>
            <h2 className="text-xl font-bold mb-4 mt-32">Bids Received</h2>
            {filteredBids.length === 0 ? (
                <p className='text-center text-4xl'>No bids yet :/</p>
            ) : (
                <div className=" grid grid-cols-3 gap-4">
                    {filteredBids.map((bid: any) => (
                        <div key={bid.bidId} className="bg-gray-800 text-white rounded-md p-4">
<p>Name: {(bid.userId && typeof names[bid.userId] === 'object' && (names[bid.userId] as any)?.displayName) || "Unknown"} {console.log("names", names)} {console.log("bid", bid)}</p>
                            <p>Rate of Interest: {bid.interestRate}</p>
                            <p>Tenure: {bid.tenure}</p>
                            <button
                                onClick={() => handleFinalizeBid(bid)}
                                className={`mt-2 px-4 py-2 rounded-md bg-blue-500 text-white`}
                            >
                                Finalize Bid
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComponent;
