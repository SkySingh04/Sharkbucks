import { ethers } from "ethers";
import StartupFunding from "../build/contracts/StartupFunding.json";

// utils/contract.ts

export async function createStartup(goal: number) {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545"); // Adjust the provider URL as needed
    const signer = await provider.getSigner();
    console.log(process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS);
    const fundingAddress : any = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS; // Replace with your contract address
    const fundingAbi = StartupFunding.abi;

    const fundingContract = new ethers.Contract(fundingAddress, fundingAbi, signer);

    const tx = await fundingContract.createStartup(goal);
    await tx.wait();
    console.log("Startup created:", tx.hash);
}

export async function fundStartup(startupId: number, amount: number) {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545"); // Adjust the provider URL as needed
    const signer = await provider.getSigner();
    console.log(process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS);
    const fundingAddress : any = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS; // Replace with your contract address
    const fundingAbi = StartupFunding.abi;

    const fundingContract = new ethers.Contract(fundingAddress, fundingAbi, signer);

    const tx = await fundingContract.fundStartup(startupId, { value: ethers.parseEther(amount.toString()) });
    await tx.wait();
    console.log("Startup funded:", tx.hash);
}
