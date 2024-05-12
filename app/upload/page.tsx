'use client'
import React, { useState } from 'react';
import { useEdgeStore } from "../lib/edgestore";
import { set, update } from 'firebase/database';
import { doc, getDocs, setDoc , collection, updateDoc } from 'firebase/firestore';
import {auth ,  db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams , useRouter } from 'next/navigation';
const UploadPage = () => {
  const search  = useSearchParams();
  const [adhaarFile, setAdhaarFile] = useState<File>();
  const [itrFile, setItrFile] = useState<File >();
  const [addressFile, setAddressFile] = useState<File >();
  const [bankFile, setBankFile] = useState<File >();
  const router = useRouter();
  const userId = search.get("userId");
  const applicationNumber = search.get("id");  
  const [downloadLinks, setDownloadLinks] = useState<any>([])
  const { edgestore } = useEdgeStore();
  const [files, setFiles] = useState({
    aadhaarCard: [],
    itr: [],
    address : [],
    bank : [],
    // Add more document types as needed
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: { target: { files: any; }; }, type: any) => {
    const selectedFiles = e.target.files;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: Array.from(selectedFiles),
    }));
  };

  const handleUpload = async () => {
    if (window.confirm("Are you sure you want to upload the files?")) {
      setIsUploading(true);
      try {
        if (userId) {
          const applicationRef = getDocs(collection(db, "applications"));
          (await applicationRef).forEach(async (doc) => {
            if (doc.data().userId === userId) {
              await updateDoc(doc.ref, {
                documents: downloadLinks,
              });
            }
          });
        }
        toast.success("Files uploaded successfully!");
        router.push("/pitch/?id=" + applicationNumber + "&userId=" + userId);
      } catch (e) {
        console.error(e);
        toast.error("Error uploading files!");
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-4 border rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
      <div className="mb-4">
        <label className="block mb-2">Identity Proof:</label>
        <input
          type="file"
          className="border rounded p-2 w-full"
          onChange={(e) => setAdhaarFile(e.target.files ? e.target.files[0] : undefined)}
        />
        <button
          onClick={async () => {
            if (adhaarFile && window.confirm("Are you sure you want to upload this file?")) {
              const res = await edgestore.publicFiles.upload({
                file: adhaarFile,
                onProgressChange: (progress) => {
                  console.log(progress);
                },
              });
              console.log(res);
              if (res.url) {
                setDownloadLinks((prevLinks: any) => [...prevLinks, res.url]);
              }
            }
          }}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Income Tax Returns:</label>
        <input
          type="file"
          className="border rounded p-2 w-full"
          onChange={(e) => setItrFile(e.target.files ? e.target.files[0] : undefined)}
        />
        <button
          onClick={async () => {
            if (itrFile && window.confirm("Are you sure you want to upload this file?")) {
              const res = await edgestore.publicFiles.upload({
                file: itrFile,
                onProgressChange: (progress) => {
                  console.log(progress);
                },
              });
              console.log(res);
              if (res.url) {
                setDownloadLinks((prevLinks: any) => [...prevLinks, res.url]);
              }
            }
          }}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Address Proof:</label>
        <input
          type="file"
          className="border rounded p-2 w-full"
          onChange={(e) => setAddressFile(e.target.files ? e.target.files[0] : undefined)}
        />
        <button
          onClick={async () => {
            if (addressFile && window.confirm("Are you sure you want to upload this file?")) {
              const res = await edgestore.publicFiles.upload({
                file: addressFile,
                onProgressChange: (progress) => {
                  console.log(progress);
                },
              });
              console.log(res);
              if (res.url) {
                setDownloadLinks((prevLinks: any) => [...prevLinks, res.url]);
              }
            }
          }}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Bank Statement:</label>
        <input
          type="file"
          className="border rounded p-2 w-full"
          onChange={(e) => setBankFile(e.target.files ? e.target.files[0] : undefined)}
        />
        <button
          onClick={async () => {
            if (bankFile && window.confirm("Are you sure you want to upload this file?")) {
              const res = await edgestore.publicFiles.upload({
                file: bankFile,
                onProgressChange: (progress) => {
                  console.log(progress);
                },
              });
              console.log(res);
              if (res.url) {
                setDownloadLinks((prevLinks: any) => [...prevLinks, res.url]);
              }
            }
          }}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      <div>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPage;