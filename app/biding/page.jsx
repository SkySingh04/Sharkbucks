"use client"
import React, { useState } from 'react';

const LoanForm = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form submission, e.g., send data to backend
        console.log({
            loanAmount,
            interestRate,
            tenure,
            additionalDetails
        });
        // Reset form fields
        setLoanAmount('');
        setInterestRate('');
        setTenure('');
        setAdditionalDetails('');
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-gray-900 text-white p-6 rounded-md shadow-md h-screen ">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 ">Loan Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">Loan Amount</label>
                    <input
                        type="number"
                        id="loanAmount"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                        placeholder="Enter loan amount"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                    <input
                        type="number"
                        id="interestRate"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                        placeholder="Enter interest rate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tenure" className="block text-sm font-medium text-gray-700">Tenure (in months)</label>
                    <input
                        type="number"
                        id="tenure"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                        placeholder="Enter tenure"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">Additional Details</label>
                    <textarea
                        id="additionalDetails"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                        placeholder="Provide additional details"
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoanForm;
