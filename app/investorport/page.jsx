'use client'
import React, { useState } from 'react';
import './page.css';

const InvestorDetailsForm = () => {
    const [investorInfo, setInvestorInfo] = useState({
        fullName: '',
        address: '',
        phoneNumber: '',
        email: '',
        dob: '',
        nationality: '',
        governmentId: '',
        bankAccountDetails: '',
        financialStatus: '',
        investmentHistory: '',
        tin: '',
        amountToInvest: '',
        investmentDuration: '',
        goals: '',
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Investor Information:', investorInfo);
    };

    return (
        <div className="form-container">
            <form className="investor-form" onSubmit={handleSubmit}>
                <h2 style={{ color: "white", fontWeight:"bold" }}>Investor Details Form</h2>
                <div className="form-section">
                <label>Full Name:</label>
                <input type="text" name="fullName" value={investorInfo.fullName} onChange={handleInputChange} />
                
                <label>Address:</label>
                <input type="text" name="address" value={investorInfo.address} onChange={handleInputChange} />
                
                <label>Phone Number:</label>
                <input type="tel" name="phoneNumber" value={investorInfo.phoneNumber} onChange={handleInputChange} />
                
                <label>Email Address:</label>
                <input type="email" name="email" value={investorInfo.email} onChange={handleInputChange} />

                <label>Date of Birth:</label>
                <input type="date" name="dob" value={investorInfo.dob} onChange={handleInputChange} />

                <label>Nationality:</label>
                <input type="text" name="nationality" value={investorInfo.nationality} onChange={handleInputChange} />

                <label>Government Issued ID:</label>
                <input type="text" name="governmentId" value={investorInfo.governmentId} onChange={handleInputChange} />
            </div>

            <div className="form-section">
                <label>Bank Account Details:</label>
                <input type="text" name="bankAccountDetails" value={investorInfo.bankAccountDetails} onChange={handleInputChange} />

                <label>Financial Status:</label>
                <input type="text" name="financialStatus" value={investorInfo.financialStatus} onChange={handleInputChange} />

                <label>Investment History and Experience:</label>
                <input type="text" name="investmentHistory" value={investorInfo.investmentHistory} onChange={handleInputChange} />

                <label>Tax Identification Number (TIN):</label>
                <input type="text" name="tin" value={investorInfo.tin} onChange={handleInputChange} />
            </div>

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

                <button type="submit">Submit</button>
            </form>
            
        
        </div>
    );
};

export default InvestorDetailsForm;
