'use client'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDocs , getDoc  , collection} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


interface Loan {
    interest_rate: number;
    tenure: number;
    amount: number;
}

interface Weights {
    interest_rate: number;
    tenure: number;
    amount: number;
}

function normalize_interest_rate(interest_rate: number): number {
    // Normalize interest rate logic goes here
    return interest_rate; // For now, returning unchanged value
}

function normalize_tenure(tenure: number): number {
    // Normalize tenure logic goes here
    return tenure; // For now, returning unchanged value
}

function normalize_amount(amount: number): number {
    // Normalize amount logic goes here
    return amount; // For now, returning unchanged value
}

function calculate_score(interest_rate: number, tenure: number, amount: number, weights: Weights): number {
    const normalized_interest_rate = normalize_interest_rate(interest_rate);
    const normalized_tenure = normalize_tenure(tenure);
    const normalized_amount = normalize_amount(amount);

    const score = (weights.interest_rate * normalized_interest_rate) +
                  (weights.tenure * normalized_tenure) +
                  (weights.amount * normalized_amount);

    return score;
}

function rank_loans(loans_data: Loan[], weights: Weights): [Loan, number][] {
    const loan_scores: [Loan, number][] = [];
    for (const loan of loans_data) {
        const score = calculate_score(loan.interest_rate, loan.tenure, loan.amount, weights);
        loan_scores.push([loan, score]);
    }

    const ranked_loans = loan_scores.sort((a, b) => b[1] - a[1]);
    return ranked_loans;
}

// Example loan data
const loans_data: Loan[] = [
    { interest_rate: 5.5, tenure: 36, amount: 50000 },
    { interest_rate: 6.2, tenure: 48, amount: 75000 },
    { interest_rate: 4.8, tenure: 24, amount: 60000 }
    // Add more loan data as needed
];

// Weights for criteria (you can adjust these based on importance)
const weights: Weights = { interest_rate: 0.5, tenure: 0.3, amount: 0.2 };

// Rank loans
const ranked_loans = rank_loans(loans_data, weights);




const ViewApplicationPage = () => {
    const search = useSearchParams();
    const preferenceId = search.get('id');
    const router = useRouter();
    const [scores , setScores] = useState<any>([]);
    const [ids , setIds] = useState<any>([]);
    const [preference, setPreference] = useState(null);
    const [ranked_loans, setRankedLoans] = useState<any>([]);
    const [application , setApplication ] = useState<any>(null)
    const [allApplications , setAllApplications] = useState<any>(null)
    const fetchApplications = async () => {
        try {
            const applicationsRef = await getDocs(collection(db, "applications"));
            if (applicationsRef) {
                const applications: any[] = [];
                applicationsRef.forEach((doc) => {
                    applications.push(doc.data());
                });
                setAllApplications(applications);
                console.log("Applications found:", applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };
    const fetchPreference = async () => {
        if (preferenceId) {
            try {
                const prefRef = doc(db, 'preferences', preferenceId.toString());
                const prefSnap = await getDoc(prefRef);
                if (prefSnap.exists()) {
                    setApplication(prefSnap.data());
                    console.log("prefSnap.data()" , prefSnap.data())
                }
            } catch (error) {
                console.error('Error fetching application:', error);
            }
        }
    
};
useEffect(() => {
    const fetchData = async () => {
        // Fetch application details
        await fetchPreference();
        await fetchApplications();
    };

    fetchData();
}, [preferenceId]);

useEffect(() => {
    // Call getDataFromApplications only when both application and allApplications are set
    if (application && allApplications) {
        const ranked_loans = getDataFromApplications();
        setRankedLoans(ranked_loans);
    }
}, [application, allApplications]);


    
    const getDataFromApplications =() =>{
let scores=[];
let id=[];
for (let i=0;i<allApplications.length;i++){
    let score=0;
    if (Array.isArray(allApplications[i]['tags'])){
    for (let j=0;j<allApplications[i]['tags'].length;j++){
        for (let k=0;k<application['preferences'].length;k++){
        if (allApplications[i]['tags'][j].includes(application['preferences'][k])){
            score+=1;
            // id.push(allApplications[i]['id']);
        }}
        
    }
    scores.push(score);
    id.push(allApplications[i]['id']);
}}
console.log("scores" , scores);
console.log("id" , id);
// for (let i=0;i<scores.length;i++){
//     for (let j=i+1;j<scores.length;j++){
//         if (scores[i]<scores[j]){
//             let temp : any=scores[i];
//             scores[i]=scores[j];
//             scores[j]=temp;
//             temp=id[i];
//             id[i]=id[j];
//             id[j]=temp;
//         }
//     }
// }
//sort the id's based on the scores
for (let i=0;i<scores.length;i++){
    for (let j=i+1;j<scores.length;j++){
        if (scores[i]<scores[j]){
            let temp : any=scores[i];
            scores[i]=scores[j];
            scores[j]=temp;
            temp=id[i];
            id[i]=id[j];
            id[j]=temp;
        }
    }
}
console.log("scores" , scores);
console.log("id" , id);
setScores(scores);
setIds(id)
    }
    return (
        <div className='flex flex-col h-screen justify-center items-center gap-4 '>
            <h1 className='text-4xl'>Here are the best investments based on your preferences!</h1>
            <div className=' grid  grid-cols-2' >
                {allApplications?.filter((app:any) => ids.includes(app.id)).map((app:any, index:number) => (
                    <div key={app.id} className='bg-blue-800 p-4 m-2 rounded-md text-center'>
                        <h2 className='text-xl'>Rank: {index + 1}</h2>
                        <h2 className='text-xl'>Name : {app.companyName}</h2>
                        <h3 className='text-lg'>Amount : {app.loanAmount}</h3>
                        <button className='bg-blue-500 text-white p-2 rounded-md'
                            onClick={() => {router.push(`/viewapplication?id=${app.id}`)}
                            }
                        >View Application</button>
                        {/* <p>Score: {score}</p> */}
                    </div>
                ))}
            </div>
        </div>   
    );
}

export default ViewApplicationPage;
