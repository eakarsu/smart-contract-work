import { utils, ethers, BigNumberish } from "ethers";
import { AddressLike } from "@enzymefinance/ethers";
import {
  PerformanceFee,
  MinMaxInvestment,
  FeeManager,
  ManagementFee,
  EntranceRateDirectFee,
  VaultLib,
  FundDeployer,
  AdapterBlacklist,
  AdapterWhitelist,
  AssetBlacklist,
  AssetWhitelist,
} from "./../prep-abis";

import {
  managementFeeConfigArgs,
  performanceFeeConfigArgs,
  feeManagerConfigArgs,
  convertRateToScaledPerSecondRate,
  encodeArgs,
  getMinMaxDepositPolicyArgs,
  getAddressArrayPolicyArgs,
} from "./../utils/fund";

export {
  PerformanceFee,
  ManagementFee,
  EntranceRateDirectFee,
  MinMaxInvestment,
  AssetBlacklist,
  AssetWhitelist,
  AdapterBlacklist,
  AdapterWhitelist,
};

export const processPolicyConfigurationData = async (options: {
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
}) => {
  let policyManagerSettingsData = [];
  let policies = [];
  // Min / Max Investment Policy
  if (options.deposit.minimum || options.deposit.maximum) {
    try {
      // Get values from frontend. Should be 0 if they are not enabled.
      var minDeposit: any = options.deposit.minimum
        ? options.deposit.minimum
        : 0;
      var maxDeposit: any = options.deposit.maximum
        ? options.deposit.maximum
        : 0;

      // Scale the minDeposit/maxDeposit values to the denomination asset's decimals
      var denominationAssetDecimals = await getAssetDecimals(
        options.denominationAsset,
        options.provider
      );
      minDeposit =
        minDeposit === 0
          ? 0
          : utils
              .parseEther(minDeposit)
              .div(10 ** (18 - denominationAssetDecimals));
      maxDeposit =
        maxDeposit === 0
          ? 0
          : utils
              .parseEther(maxDeposit)
              .div(10 ** (18 - denominationAssetDecimals));

      // Push settings and actual policy
      policies.push(MinMaxInvestment.address);
      policyManagerSettingsData.push(
        getMinMaxDepositPolicyArgs(minDeposit, maxDeposit)
      );
    } catch (e) {}
  }

  if (options.asset.blackList.length != 0) {
    policies.push(AssetBlacklist.address);
    policyManagerSettingsData.push(
      getAddressArrayPolicyArgs(options.asset.blackList)
    );
  }

  if (options.asset.whiteList.length != 0) {
    policies.push(AssetWhitelist.address);
    policyManagerSettingsData.push(
      getAddressArrayPolicyArgs(options.asset.whiteList)
    );
  }

  if (options.adpater.blackList.length != 0) {
    policies.push(AdapterBlacklist.address);
    policyManagerSettingsData.push(
      getAddressArrayPolicyArgs(options.adpater.blackList)
    );
  }

  if (options.adpater.whiteList.length != 0) {
    policies.push(AdapterWhitelist.address);
    policyManagerSettingsData.push(
      getAddressArrayPolicyArgs(options.adpater.whiteList)
    );
  }

  let policyArgsData;
  if (policies.length === 0) {
    policyArgsData = utils.hexlify("0x");
  } else {
    policyArgsData = getPolicyArgsData(policies, policyManagerSettingsData);
  }

  return policyArgsData;
};

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
export const createNewFund = async (
  signer: ethers.Wallet,
  fundName: string,
  denominationAsset: string,
  timeLockInSeconds: number,
  gaslimit: string,
  provider: any,
  feeConfig?: {
    managementFee: string;
    performanceFee: string;
    entranceFee: string;
  },
  policyConfig?: {
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
  }
) => {
  const nonce = await provider.getTransactionCount(signer.address, "pending");

  /**
   * PREPARE CONFIGURATIONS
   */
  //1. FEE CONFIGURATIONS

  let feeArgsData = utils.hexlify("0x");
  let policyConfigData  = utils.hexlify("0x");
  if (feeConfig) {
    let feeManagerSettingsData = [
      getManagementFees(feeConfig.managementFee),
      getEntranceRateFeeConfigArgs(feeConfig.entranceFee),
      getPerformanceFees(feeConfig.performanceFee, 12),
    ]; // value configurations
    let fees = [
      ManagementFee.address,
      EntranceRateDirectFee.address,
      PerformanceFee.address,
    ]; // list of address

    // FINAL PREP of FEES
    feeArgsData = await getFeesManagerConfigArgsData(
      fees,
      feeManagerSettingsData,
      signer.address,
      true
    );
  }

  
  //2. POLICY CONFIG

  if(policyConfig) {
    const options = {
      provider,
      denominationAsset,
      deposit: policyConfig?.deposit!,
      asset: policyConfig?.asset!,
      adpater: policyConfig?.adpater!,
    };
    policyConfigData = await processPolicyConfigurationData(options);
  
  }

  // GET FundDeployer Interface Data
  const FundDeployerInterface = new ethers.utils.Interface(
    JSON.parse(JSON.stringify(FundDeployer.abi))
  );
  // FundDeployer Contract
  const fundDeployer = new ethers.Contract(
    FundDeployer.address,
    FundDeployerInterface,
    signer
  );
  //0xd0a1e359811322d97991e03f863a0c30c2cf029c
  const fund = await fundDeployer.createNewFund(
    signer.address,
    fundName,
    denominationAsset,
    timeLockInSeconds,
    feeArgsData,
    policyConfigData,
    { nonce: nonce, gasLimit: gaslimit }
  );

  return fund;
};

/**
 * Rate is  number representing a 1%
 */
export const getManagementFees = (rate: any) => {
  // Must convert from rate to scaledPerSecondRate
  var scaledPerSecondRate = convertRateToScaledPerSecondRate(rate);
  return managementFeeConfigArgs(scaledPerSecondRate);
};

/**
 *
 * @param {*} rate Rate in percentage
 * @param {*} period Period at which it will be applied
 */
export const getPerformanceFees = (rate: any, period: any) => {
  // The period will default to 30 days
  const defaultPeriod = 2592000;
  // remove code

  // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
  rate = utils.parseEther((rate / 100).toString());
  return performanceFeeConfigArgs(rate, defaultPeriod);
};

/**
 * Rate is  number representing a 1%
 */
export function getEntranceRateFeeConfigArgs(rate: BigNumberish) {
  // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
  rate = utils.parseEther(rate.toString());
  return encodeArgs(["uint256"], [rate]);
}

export const getPolicyArgsData = (
  policies: AddressLike[],
  policySettings: AddressLike[]
) => {
  return encodeArgs(["address[]", "bytes[]"], [policies, policySettings]);
};

/**
 *
 * @param {*} fees
 * @param {*} feeManagerSettingsData
 * @param {*} _signer
 * @param {*} allow
 * @returns
 */

export const getFeesManagerConfigArgsData = async (
  fees: any,
  feeManagerSettingsData: any,
  _signer: any,
  allow: any
) => {
  // remove code
  // console.log(fees, feeManagerSettingsData, _signer, allow);
  const FeeManagerInterface = new ethers.utils.Interface(
    JSON.parse(JSON.stringify(FeeManager.abi))
  );

  // remove in mainnet
  const feeManager = new ethers.Contract(
    FeeManager.address,
    FeeManagerInterface
  );
  let fees_unregister = [];
  // end

  try {
    if (allow) {
      const registeredFees = await feeManager.getRegisteredFees();

      if (registeredFees.length === 0) {
        fees_unregister = [ManagementFee.address, PerformanceFee.address];
        await feeManager.registerFees(fees_unregister, { gasLimit: 300000 });
      } else {
        if (!registeredFees.includes(ManagementFee.address)) {
          fees_unregister.push(ManagementFee.address);
        }

        if (!registeredFees.includes(PerformanceFee.address)) {
          fees_unregister.push(PerformanceFee.address);
        }

        if (!registeredFees.includes(EntranceRateDirectFee.address)) {
          fees_unregister.push(EntranceRateDirectFee.address);
        }
      }
      // Register this fees for app use
      if (fees_unregister.length > 0) {
        await feeManager.registerFees(fees_unregister, { gasLimit: 300000 });
      }
    }

    // Convert Fees
  } catch (error) {}

  return feeManagerConfigArgs({
    fees: fees,
    settings: feeManagerSettingsData,
  });
};

/**
 *
 * @param assetAddress Asset address
 * @param signer
 * @returns
 */

export async function getAssetDecimals(assetAddress: string, signer: any) {
  try {
    // we use VaultLib as an interface because it has the `decimals()` getter
    const assetInterface = new ethers.utils.Interface(
      JSON.parse(JSON.stringify(VaultLib.abi))
    );
    const asset = new ethers.Contract(assetAddress, assetInterface, signer);
    const decimals = await asset.decimals();
    return decimals;
  } catch (error) {
    return { error: false };
  }
}
