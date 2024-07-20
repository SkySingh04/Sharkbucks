'use client'
import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
import { doc, setDoc  , getDoc , updateDoc, arrayUnion} from "firebase/firestore"; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  import { createStartup } from "../utils/contracts";

const LoanApplicationForm = () => {
  const [loggedInUser, setLoggedInUser] = useState("")
  const [goal, setGoal] = useState(0);
  
  const handleCreate = async () => {
      try {
          await createStartup(goal);
          toast.success("Startup created successfully on blockchain!");
      } catch (error) {
          console.error(error);
          toast.error("Failed to create startup on blockchain");
      }
  };

  const router = useRouter()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user.uid)
      } else {
        router.push("/login")
      }
    });
  }, [])

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    businessType: '',
    yearsInOperation: '',
    annualRevenue: '',
    loanAmount: '',
    loanPurpose: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const randomID = () => {
    return Math.floor(Math.random() * 1000000000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const applicationId = randomID()
    try {
      const applicationData = {
        userId: loggedInUser,
        applicationId: applicationId,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      businessType: formData.businessType,
      yearsInOperation: formData.yearsInOperation,
      annualRevenue: formData.annualRevenue,
      loanAmount: formData.loanAmount,
      loanPurpose: formData.loanPurpose,
      fundingReceived: 0,
      fundingStatus: "pending",
      };
      const applicationRef = doc(db, "applications", applicationId.toString());
      await setDoc(applicationRef, applicationData);
      await setDoc(applicationRef, {
        id : applicationId,
        userId : loggedInUser
    } , {merge : true})  
    setGoal(parseInt(formData.loanAmount));
    try{await handleCreate();}
    catch(e){
      console.error("Error creating startup: ", e);
      return; 
    }
    toast.success('Application submitted successfully');
      router.push("/upload?userId="+loggedInUser+"&id="+applicationId);
    } catch (e) {
      toast.error('Error submitting application');
      console.error("Error adding/updating document: ", e);
    }
   
  };

  return (
    <div className="max-w-md mx-auto mt-[6em]">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4 mt-12">Loan Application Form</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="companyName" className="block mb-1">
            Company Name
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="contactPerson" className="block mb-1">
            Owner Name
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1">
            Contact Number
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="businessType" className="block mb-1">
            Business Type
            <input
              type="text"
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="yearsInOperation" className="block mb-1">
            Years in Operation
            <input
              type="number"
              id="yearsInOperation"
              name="yearsInOperation"
              value={formData.yearsInOperation}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="annualRevenue" className="block mb-1">
            Annual Revenue
            <input
              type="number"
              id="annualRevenue"
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="loanAmount" className="block mb-1">
            Loan Amount Required
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
                placeholder="Goal (ETH)"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="loanPurpose" className="block mb-1">
            Purpose of Loan
            <input
              type="text"
              id="loanPurpose"
              name="loanPurpose"
              value={formData.lloanPurpose}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="agreeTerms" className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">
              I agree to the terms and conditions
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={!formData.agreeTerms} // Disable submit button if terms not agreed
        >
          Upload Documents
        </button>
      </form>
    </div>
  );
};

export default LoanApplicationForm;