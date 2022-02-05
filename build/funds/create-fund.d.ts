import { ethers, BigNumberish } from "ethers";
import { AddressLike } from "@enzymefinance/ethers";
import { PerformanceFee, MinMaxInvestment, ManagementFee, EntranceRateDirectFee, AdapterBlacklist, AdapterWhitelist, AssetBlacklist, AssetWhitelist } from "./../prep-abis";
export { PerformanceFee, ManagementFee, EntranceRateDirectFee, MinMaxInvestment, AssetBlacklist, AssetWhitelist, AdapterBlacklist, AdapterWhitelist, };
export declare const processPolicyConfigurationData: (options: {
    provider: any;
    denominationAsset: string;
    deposit: {
        minimum: string;
        maximum: string;
    };
    asset: {
        whiteList: Array<string>;
        blackList: Array<string>;
    };
    adpater: {
        whiteList: Array<string>;
        blackList: Array<string>;
    };
}) => Promise<string>;
/**
 *
 * @param signer Authenticated Ethers wallet
 * @param fundName  The name you are willing to assign to your fund
 * @param denominationAsset  The base Denomination asset  for your fund
 * @param timeLockInSeconds Time duration you are willing to lock your funds
 * @param policyManagerConfigData
 * @param gaslimit Limit of gas you are willing to spend
 * @param provider  Ethers provider http provider authenticated
 * @param feeConfig This gives the fees information all the object items must be as a percentage
 * @returns
 */
export declare const createNewFund: (signer: ethers.Wallet, fundName: string, denominationAsset: string, timeLockInSeconds: number, gaslimit: string, provider: any, feeConfig?: {
    managementFee: string;
    performanceFee: string;
    entranceFee: string;
} | undefined, policyConfig?: {
    deposit: {
        minimum: string;
        maximum: string;
    };
    asset: {
        whiteList: Array<string>;
        blackList: Array<string>;
    };
    adpater: {
        whiteList: Array<string>;
        blackList: Array<string>;
    };
} | undefined) => Promise<any>;
/**
 * Rate is  number representing a 1%
 */
export declare const getManagementFees: (rate: any) => string;
/**
 *
 * @param {*} rate Rate in percentage
 * @param {*} period Period at which it will be applied
 */
export declare const getPerformanceFees: (rate: any, period: any) => string;
/**
 * Rate is  number representing a 1%
 */
export declare function getEntranceRateFeeConfigArgs(rate: BigNumberish): string;
export declare const getPolicyArgsData: (policies: AddressLike[], policySettings: AddressLike[]) => string;
/**
 *
 * @param {*} fees
 * @param {*} feeManagerSettingsData
 * @param {*} _signer
 * @param {*} allow
 * @returns
 */
export declare const getFeesManagerConfigArgsData: (fees: any, feeManagerSettingsData: any, _signer: any, allow: any) => Promise<string>;
/**
 *
 * @param assetAddress Asset address
 * @param signer
 * @returns
 */
export declare function getAssetDecimals(assetAddress: string, signer: any): Promise<any>;
