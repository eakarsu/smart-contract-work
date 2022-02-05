import { ethers } from "ethers";
import {
  createNewFund,
  borrow,
  deposit,
  getAllAssetsIntegrations,
  getCurrentUserFunds,
  getDenominationAssets,
  performanceFee,
  managementFee,
  entranceDirectBurnFees,
  approveBeforeInvesting,
  invest,
  redeemAllShares,
} from "../index";
import { configs } from "../config";

//CONSTANTS

const PROVIDER = new ethers.providers.JsonRpcProvider(configs.HTTP_URL);
const SIGNER = new ethers.Wallet(configs.PRIVATE_KEY, PROVIDER);

// aave

const LP_ADDRESS_PROVIDER_ADDRESS =
  "0x88757f2f99175387aB4C6a4b3067c77A695b0349";
const BORROW_ASSET = "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"; // DAIs
const DEPOSIT_ASSET = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"; // WETH

/**
 * CREATION OF A FUND
 */
export const createFundTest = async () => {
  /**
   * PROCESS FLOW OF THE APP
   */

  //1.CREATION OF A FUND
  const DENOMINATION_ASSET = "0xd0a1e359811322d97991e03f863a0c30c2cf029c"; // Wrapped Ether(WETH)

  try {
    /**
     * PARAMETERS BE PASSED BY USERs
     */
    // Fee Configurations
    let feeConfigs = {
      entranceFee: "2",
      managementFee: "1",
      performanceFee: "5",
    };

    // Policy Configurations

    let policyConfig = {
      deposit: {
        minimum: "0",
        maximum: "5",
      },
      asset: {
        whiteList: [],
        blackList: [],
      },
      adpater: {
        whiteList: [],
        blackList: [],
      },
    };

    // Creating the actual fund
    const fund = await createNewFund(
      SIGNER,
      "2022 EROL FUND",
      DENOMINATION_ASSET,
      10000,
      "10000000",
      PROVIDER,
      feeConfigs,
      policyConfig
    );

    console.log(fund);
    return fund;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fund Investments & Withdrawal
 */

/**
 * Allow users to withdrawal/redeem all shares
 * @param fundAddress Created Fund Address
 * @param provider  ethers.provider.JsonRpcProvider
 */
export const investingAndRedeemingOrWithdrawalOfShares = async (
  fundAddress: string
) => {
  // Approve before investing
  const approve = await approveBeforeInvesting(fundAddress, PROVIDER, 1000);
  console.log("Approving: ", approve);
  // Invest to a fund
  const investing = await invest(fundAddress, PROVIDER, SIGNER, 1000);
  console.log("Investing: ", investing);
  // Redeem shares
  const redeem = await redeemAllShares(fundAddress, PROVIDER);
  console.log("Redeeming: ", redeem);
};

// 2. OPTION STEP
// Interact with aave
/**
 *  Deposit collateral
 * @returns Transactions receipt.
 */
export const aaveDepositCollateral = async () => {
  return await borrow(
    LP_ADDRESS_PROVIDER_ADDRESS,
    PROVIDER,
    SIGNER,
    1,
    DEPOSIT_ASSET
  );
};

/**
 *  Borrow An Asset
 * @returns Transactions receipt.
 */
export const aaveBorrowAsset = async () => {
  return await deposit(
    LP_ADDRESS_PROVIDER_ADDRESS,
    PROVIDER,
    SIGNER,
    100,
    BORROW_ASSET
  );
};

// 3. DEPOSIT ASSET(options. If you borrowed)

// 4. REDEEM FROM A FUND

// SUB GRAPHS
/**
 *  Get a list of all asset integrations
 * @returns  List of integrated assets and Adapters
 */
export const assetIntegrations = async () => {
  return await getAllAssetsIntegrations(configs.SUB_GRAPH_ENDPOINT);
};

/**
 * Connected User funds
 * @param user_address Accessor wallet address
 * @returns
 */
export const currentUserFunds = async (user_address: string) => {
  return await getCurrentUserFunds(configs.SUB_GRAPH_ENDPOINT, user_address);
};

/**
 *  List all denomation assets within the platform
 * @returns A list of denomation assets
 */
export const denominationAssets = async () => {
  return await getDenominationAssets(configs.SUB_GRAPH_ENDPOINT);
};

/**
 * Fund  management Fees provided during fund creation
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
export const fundManagementFee = async (comptrollerId: string) => {
  return await managementFee(configs.SUB_GRAPH_ENDPOINT, comptrollerId);
};

/**
 * Fund Performance Fees provided during creatiion
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
export const fundPerformanceFee = async (comptrollerId: string) => {
  return await performanceFee(configs.SUB_GRAPH_ENDPOINT, comptrollerId);
};

/**
 * Fund Entrance Direct Fees  provided during the creation of the  fund
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
export const fundEntranceDirectBurnFees = async (fundAddress: string) => {
  return await entranceDirectBurnFees(configs.SUB_GRAPH_ENDPOINT, fundAddress);
};
