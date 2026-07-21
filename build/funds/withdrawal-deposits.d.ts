import { ethers } from "ethers";
/**
 *
 * @param fundAddress Fund location address
 * @param provider  ethers'  jsonRPCProvider
 * @returns
 */
export declare const getContracts: (fundAddress: string, provider: any) => Promise<{
    assetContract: ethers.Contract;
    comptrollerContract: ethers.Contract;
    vaultLibContract: ethers.Contract;
}>;
/**
 * Get the denomation asset allowance balance
 * @param fundAddress Fund location address
 * @param investor Investor's adddess
 * @param provider ethers' jsonRPCProvider
 * @returns
 */
export declare const getDenominationAllowance: (fundAddress: string, investor: string, provider: any) => Promise<any>;
/**
 *
 * @param fundAddress Fund location address
 * @param provider Ethers' JSONRpcProvider
 * @param amount  Amount to approve
 * @returns
 */
export declare const approveForInvestment: (fundAddress: string, provider: any, amount: any) => Promise<void>;
/**
 *
 * @param fundAddress Fund location address
 * @param investor Investor's address
 * @param provider Ethers' JSONRpcProvider
 * @param amount Amount to invest
 */
export declare const investFundDenomination: (fundAddress: string, investor: string, provider: any, amount: any) => Promise<void>;
/**
 * Get the fund's denomination asset balance
 * @param fundAddress Fund location address
 * @param investor  Investor's address
 * @param provider  Ethers's jsonRpceProvider
 * @returns Balance of denomination asset
 */
export declare const getDenominationBalance: (fundAddress: string, investor: string, provider: any) => Promise<any>;
/**
 * Use this function to redeem some or all your shares
 * @param fundAddress Fund location address
 * @param provider Provider to use. Ethers's jsonRpcProvider
 */
export declare const redeemAllShares: (fundAddress: string, provider: any) => Promise<any>;
