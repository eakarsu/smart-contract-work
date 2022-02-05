import { utils, BigNumber, BigNumberish, BytesLike } from "ethers";
import { AddressLike } from "@enzymefinance/ethers";
import { Decimal } from "decimal.js";
export declare function sighash(fragment: utils.FunctionFragment): string;
export declare const managementFeeDigits = 27;
export declare const managementFeeScale: BigNumber;
export declare const managementFeeScaleDecimal: Decimal;
export declare const secondsPerYear: number;
export declare function encodeArgs(types: any, args: any): string;
export declare function encodeFunctionData(fragment: any, args: any): string;
export declare function feeManagerConfigArgs({ fees, settings, }: {
    fees: AddressLike[];
    settings: BytesLike[];
}): string;
export declare function payoutSharesOutstandingForFeesArgs(fees: AddressLike[]): string;
export declare function managementFeeConfigArgs(scaledPerSecondRate: BigNumberish): string;
export declare function convertRateToScaledPerSecondRate(rate: BigNumberish): BigNumber;
export declare function performanceFeeConfigArgs(rate: BigNumberish, period: BigNumberish): string;
export declare function entranceRateFeeConfigArgs(rate: BigNumberish): string;
export declare function entranceRateFeeSharesDue({ rate, sharesBought, }: {
    rate: BigNumberish;
    sharesBought: BigNumberish;
}): BigNumber;
export declare function rpow(x: BigNumberish, n: BigNumberish, b: BigNumberish): BigNumber;
export declare function managementFeeSharesDue({ scaledPerSecondRate, sharesSupply, secondsSinceLastSettled, }: {
    scaledPerSecondRate: BigNumberish;
    sharesSupply: BigNumberish;
    secondsSinceLastSettled: BigNumberish;
}): BigNumber;
export declare function adapterBlacklistArgs(adapters: AddressLike[]): string;
export declare function adapterWhitelistArgs(adapters: AddressLike[]): string;
export declare function assetBlacklistArgs(assets: AddressLike[]): string;
export declare function assetWhitelistArgs(assets: AddressLike[]): string;
export declare function buySharesCallerWhitelistArgs({ buySharesCallersToAdd, buySharesCallersToRemove, }: {
    buySharesCallersToAdd?: never[] | undefined;
    buySharesCallersToRemove?: never[] | undefined;
}): string;
export declare function buySharesPriceFeedToleranceArgs(tolerance: any): string;
export declare function guaranteedRedemptionArgs({ startTimestamp, duration, }: {
    startTimestamp: any;
    duration: any;
}): string;
export declare function investorWhitelistArgs({ investorsToAdd, investorsToRemove, }: {
    investorsToAdd?: never[] | undefined;
    investorsToRemove?: never[] | undefined;
}): string;
export declare function maxConcentrationArgs(maxConcentration: BigNumberish): string;
export declare function minMaxInvestmentArgs({ minInvestmentAmount, maxInvestmentAmount, }: {
    minInvestmentAmount: BigNumberish;
    maxInvestmentAmount: BigNumberish;
}): string;
export declare function policyManagerConfigArgs({ policies, settings, }: {
    policies: AddressLike[];
    settings: BytesLike[];
}): string;
export declare function convertScaledPerSecondRateToRate(scaledPerSecondRate: BigNumberish): BigNumber;
export declare const getMinMaxDepositPolicyArgs: (minDeposit: BigNumber, maxDeposit: BigNumber) => string;
export declare const getAddressArrayPolicyArgs: (ars: any) => string;
export declare const fullNumber: (x: any) => any;
