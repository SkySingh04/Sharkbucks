'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import{ doc, setDoc, getDoc , updateDoc, arrayUnion} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import {auth, db} from '../firebase'

import './page.css';


const InvestorDetailsForm = () => {
    const [investorInfo, setInvestorInfo] = useState({
        amountToInvest: '',
        investmentDuration: '',
        goals: '',
    });
    const [userId, setUserId] = useState(null)
    const router = useRouter()
    
    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        router.push("/login")
      }
    });
  }, []);

    const [availablePreferences, setAvailablePreferences] = useState(['Technology', 'Manufacturing', 'Healthcare', 'Agribusiness', 'Renewable-Energy', 'Education', 'E-commerce', 'Infrastructure', 'Financial-Services', 'Consumer-Goods', 'Artisanal-and-Handicrafts', 'Sustainable-and-Social-Enterprises']);
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvestorInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addInvestmentPreference = (preference) => {
        setSelectedPreferences(prev => [...prev, preference]);
        setAvailablePreferences(prev => prev.filter(p => p !== preference));
    };

    const removeInvestmentPreference = (preference) => {
        setAvailablePreferences(prev => [...prev, preference]);
        setSelectedPreferences(prev => prev.filter(p => p !== preference));
    };
    const randomID = () => {
        return Math.floor(Math.random() * 1000000000)
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Handle submit was called")
        const preferencesId = randomID();
        try{
            const preferenceData={
                preferencesId: preferencesId,
                amountToInvest: investorInfo.amountToInvest,
                investmentDuration: investorInfo.investmentDuration,
                goals: investorInfo.goals,
                preferences: selectedPreferences

            };
            const preferenceRef = doc(db, "preferences", preferencesId.toString());
            await setDoc(preferenceRef, preferenceData);
            console.log("sdfghjk");

            router.push("/investorpreference/?id=" + preferencesId);
        }
            catch (e) {
                console.error("Error adding/updating document: ", e);
              }

        }

    return (
        <div className='h-screen w-full mb-[300px] flex flex-col items-center justify-center '>
        <div className="form-container  ">
            
            <form className="investor-form" onSubmit={handleSubmit}>
                <h2 style={{ color: "white", fontWeight:"bold"}}>Investor Details Form</h2>
                
               

            <div className="form-section">
                <label>Amount to Invest:</label>
                <input type="number" name="amountToInvest" value={investorInfo.amountToInvest} onChange={handleInputChange} />

                <label>Expected Duration of Investment:</label>
                <input type="text" name="investmentDuration" value={investorInfo.investmentDuration} onChange={handleInputChange} />

                <label>Goals and Objectives:</label>
                <input type="text" name="goals" value={investorInfo.goals} onChange={handleInputChange}/>
            </div>
                
                <div className="preferences">
                    <p style={{ color: "white" }}>Selected Investment Preferences:</p>
                    {availablePreferences.map(preference => (
                        <button key={preference} type="button" onClick={() => addInvestmentPreference(preference)}>
                            {preference} +
                        </button>
                    ))}
                </div>
                
                <div className="selected-preferences">
                    <p>Selected Preferences:</p>
                    {selectedPreferences.map((pref, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            {pref}
                            <button type="button" onClick={() => removeInvestmentPreference(pref)} style={{ marginLeft: '10px' }}>
                                -
                            </button>
                        </div>
                    ))}
                </div>

                <button type="submit"> Submit </button>
            </form>
            
           
        </div>
        </div>
    );
};

export default InvestorDetailsForm;
