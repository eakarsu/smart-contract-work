import { ethers } from "ethers";
/**
 * Approve Amount for investment
 * @param fundAddress  Fund location address
 * @param provider  ethers's jsonrpcProvider
 * @param amount Amount to approve
 * @returns
 */
export declare const approveBeforeInvesting: (fundAddress: string, provider: any, amount: number) => Promise<any>;
export declare const invest: (fundAddress: string, provider: any, signer: ethers.Wallet, amountToInvest: number) => Promise<any>;
