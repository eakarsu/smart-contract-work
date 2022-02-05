import { BigNumber, ethers, utils } from "ethers";
import { fullNumber } from "../utils/fund";
import {
  approveForInvestment,
  investFundDenomination,
} from "./../funds/withdrawal-deposits";


/**
 * Approve Amount for investment
 * @param fundAddress  Fund location address
 * @param provider  ethers's jsonrpcProvider
 * @param amount Amount to approve
 * @returns 
 */
export const approveBeforeInvesting = async (
  fundAddress: string,
  provider: any,
  amount: number
) => {
  try {
    amount = fullNumber(utils.hexlify(amount.toString()));

    if (amount == 0) return;

    return await approveForInvestment(fundAddress, provider, amount);
  } catch (e: any) {return e}
};

export const invest = async (
  fundAddress: string,
  provider: any,
  signer: ethers.Wallet,
  amountToInvest: number
) => {
  try {
      if (amount == 0) return;
    var amount = fullNumber(utils.hexlify(amountToInvest.toString()));

    return await investFundDenomination(fundAddress, signer.address, provider, amount);
  } catch (e: any) {
      return e;
  }
};


