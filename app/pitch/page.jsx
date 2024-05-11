'use client'
import React, { useState } from 'react';
import './page.css';
import { doc, setDoc  , getDoc , updateDoc, arrayUnion} from "firebase/firestore";
import { db , auth} from '../firebase';
import { useEdgeStore } from "../lib/edgestore";
import { useSearchParams , useRouter } from 'next/navigation'

function App() {
  const [pitch, setPitch] = useState('');
  const { edgestore } = useEdgeStore();
  const search = useSearchParams();
  const applicationId = search.get('id')
  const [videoFile, setVideoFile] = useState();
  const [downloadLink, setDownloadLink] = useState('');
  const [customPreference, setCustomPreference] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [availablePreferences, setAvailablePreferences] = useState(['Technology', 'Manufacturing', 'Healthcare', 'Agribusiness', 'Renewable-Energy', 'Education', 'E-commerce', 'Infrastructure', 'Financial-Services', 'Consumer-Goods', 'Artisanal-and-Handicrafts', 'Sustainable-and-Social-Enterprises']);

  const handlePitchChange = (e) => {
    setPitch(e.target.value);
  };

  const handleCustomPreferenceChange = (e) => {
    setCustomPreference(e.target.value);
  };

  const addInvestmentPreference = (preference) => {
    setSelectedPreferences(prev => [...prev, preference]);
    setAvailablePreferences(prev => prev.filter(p => p !== preference));
  };

  const addCustomPreference = () => {
    if (customPreference.trim() !== '') {
      addInvestmentPreference(customPreference);
      setCustomPreference('');
    }
  };

  const removeInvestmentPreference = (preference) => {
    setAvailablePreferences(prev => [...prev, preference]);
    setSelectedPreferences(prev => prev.filter(p => p !== preference));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Pitch:', pitch);
    console.log('Selected Preferences:', selectedPreferences);
    console.log('Video Link:', downloadLink);
    try{
    const applicationRef = doc(db, "applications", applicationId.toString());
    await setDoc(applicationRef, {
      pitch: pitch,
      tags: selectedPreferences,
      videoLink: downloadLink,
    }, { merge: true }); 
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  };

  return (
    <div className="App h-[100%] mb-32">
      <form onSubmit={handleSubmit}>
        <div className="pitchArea">
          <h2 style={{ color: "white", fontWeight:"bold" }}>Submit your pitch, tell us what you need and why!</h2>
          <textarea
            value={pitch}
            onChange={handlePitchChange}
            placeholder="Enter your pitch"
          ></textarea>
        </div>
        <div className="preferences">
          <h2 style={{ color: "white", fontWeight:"bold" }}>Tags</h2>
          <p>Select tags that will allow us to identify you better:</p>
          {availablePreferences.map(preference => (
            <button key={preference} type="button" onClick={() => addInvestmentPreference(preference)}>
              {preference} +
            </button>
          ))}
          <div>
            <input
              type="text"
              value={customPreference}
              onChange={handleCustomPreferenceChange}
              placeholder="Enter custom tag"
            />
            <button type="button" onClick={addCustomPreference}>
              Add
            </button>
          </div>
        </div>
        <div className="selected-preferences">
          <p>Selected Tags:</p>
          {selectedPreferences.map((pref, index) => (
            <div key={index}>
              {pref}
              <button type="button" onClick={() => removeInvestmentPreference(pref)}>
                -
              </button>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-center'>
        <input
          type="file"
          className="border rounded p-2 w-full"
          onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : undefined)}
        />
        <button
        className='border rounded p-2 w-full'
        onClick={async () => {
          if (videoFile) {
            const res = await edgestore.publicFiles.upload({
              file: videoFile,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            console.log(res);
            if (res.url) {
              setDownloadLink(res.url);
            }
          }
        }}
      >
        Upload
      </button>
      </div>
        <span/>
        <div className="submitButton">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default App;
