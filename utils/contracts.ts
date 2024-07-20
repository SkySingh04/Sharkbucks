// utils/contract.ts
import { ethers } from "ethers";
import StartupFunding from "../build/contracts/StartupFunding.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545"); // Adjust the provider URL as needed
const signer = await provider.getSigner();
const fundingAddress = "<Deployed_Contract_Address>"; // Replace with your contract address
const fundingAbi = StartupFunding.abi;

const fundingContract = new ethers.Contract(fundingAddress, fundingAbi, signer);

export async function createStartup(goal: number) {
    const tx = await fundingContract.createStartup(goal);
    await tx.wait();
    console.log("Startup created:", tx.hash);
}

export async function fundStartup(startupId: number, amount: number) {
    const tx = await fundingContract.fundStartup(startupId, { value: ethers.parseEther(amount.toString()) });
    await tx.wait();
    console.log("Startup funded:", tx.hash);
}
