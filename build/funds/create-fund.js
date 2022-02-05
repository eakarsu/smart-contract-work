"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetDecimals = exports.getFeesManagerConfigArgsData = exports.getPolicyArgsData = exports.getEntranceRateFeeConfigArgs = exports.getPerformanceFees = exports.getManagementFees = exports.createNewFund = exports.processPolicyConfigurationData = exports.AdapterWhitelist = exports.AdapterBlacklist = exports.AssetWhitelist = exports.AssetBlacklist = exports.MinMaxInvestment = exports.EntranceRateDirectFee = exports.ManagementFee = exports.PerformanceFee = void 0;
const ethers_1 = require("ethers");
const prep_abis_1 = require("./../prep-abis");
Object.defineProperty(exports, "PerformanceFee", { enumerable: true, get: function () { return prep_abis_1.PerformanceFee; } });
Object.defineProperty(exports, "MinMaxInvestment", { enumerable: true, get: function () { return prep_abis_1.MinMaxInvestment; } });
Object.defineProperty(exports, "ManagementFee", { enumerable: true, get: function () { return prep_abis_1.ManagementFee; } });
Object.defineProperty(exports, "EntranceRateDirectFee", { enumerable: true, get: function () { return prep_abis_1.EntranceRateDirectFee; } });
Object.defineProperty(exports, "AdapterBlacklist", { enumerable: true, get: function () { return prep_abis_1.AdapterBlacklist; } });
Object.defineProperty(exports, "AdapterWhitelist", { enumerable: true, get: function () { return prep_abis_1.AdapterWhitelist; } });
Object.defineProperty(exports, "AssetBlacklist", { enumerable: true, get: function () { return prep_abis_1.AssetBlacklist; } });
Object.defineProperty(exports, "AssetWhitelist", { enumerable: true, get: function () { return prep_abis_1.AssetWhitelist; } });
const fund_1 = require("./../utils/fund");
const processPolicyConfigurationData = async (options) => {
    let policyManagerSettingsData = [];
    let policies = [];
    // Min / Max Investment Policy
    if (options.deposit.minimum || options.deposit.maximum) {
        try {
            // Get values from frontend. Should be 0 if they are not enabled.
            var minDeposit = options.deposit.minimum
                ? options.deposit.minimum
                : 0;
            var maxDeposit = options.deposit.maximum
                ? options.deposit.maximum
                : 0;
            // Scale the minDeposit/maxDeposit values to the denomination asset's decimals
            var denominationAssetDecimals = await getAssetDecimals(options.denominationAsset, options.provider);
            minDeposit =
                minDeposit === 0
                    ? 0
                    : ethers_1.utils
                        .parseEther(minDeposit)
                        .div(10 ** (18 - denominationAssetDecimals));
            maxDeposit =
                maxDeposit === 0
                    ? 0
                    : ethers_1.utils
                        .parseEther(maxDeposit)
                        .div(10 ** (18 - denominationAssetDecimals));
            // Push settings and actual policy
            policies.push(prep_abis_1.MinMaxInvestment.address);
            policyManagerSettingsData.push((0, fund_1.getMinMaxDepositPolicyArgs)(minDeposit, maxDeposit));
        }
        catch (e) { }
    }
    if (options.asset.blackList.length != 0) {
        policies.push(prep_abis_1.AssetBlacklist.address);
        policyManagerSettingsData.push((0, fund_1.getAddressArrayPolicyArgs)(options.asset.blackList));
    }
    if (options.asset.whiteList.length != 0) {
        policies.push(prep_abis_1.AssetWhitelist.address);
        policyManagerSettingsData.push((0, fund_1.getAddressArrayPolicyArgs)(options.asset.whiteList));
    }
    if (options.adpater.blackList.length != 0) {
        policies.push(prep_abis_1.AdapterBlacklist.address);
        policyManagerSettingsData.push((0, fund_1.getAddressArrayPolicyArgs)(options.adpater.blackList));
    }
    if (options.adpater.whiteList.length != 0) {
        policies.push(prep_abis_1.AdapterWhitelist.address);
        policyManagerSettingsData.push((0, fund_1.getAddressArrayPolicyArgs)(options.adpater.whiteList));
    }
    let policyArgsData;
    if (policies.length === 0) {
        policyArgsData = ethers_1.utils.hexlify("0x");
    }
    else {
        policyArgsData = (0, exports.getPolicyArgsData)(policies, policyManagerSettingsData);
    }
    return policyArgsData;
};
exports.processPolicyConfigurationData = processPolicyConfigurationData;
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
const createNewFund = async (signer, fundName, denominationAsset, timeLockInSeconds, gaslimit, provider, feeConfig, policyConfig) => {
    const nonce = await provider.getTransactionCount(signer.address, "pending");
    /**
     * PREPARE CONFIGURATIONS
     */
    //1. FEE CONFIGURATIONS
    let feeArgsData = ethers_1.utils.hexlify("0x");
    let policyConfigData = ethers_1.utils.hexlify("0x");
    if (feeConfig) {
        let feeManagerSettingsData = [
            (0, exports.getManagementFees)(feeConfig.managementFee),
            getEntranceRateFeeConfigArgs(feeConfig.entranceFee),
            (0, exports.getPerformanceFees)(feeConfig.performanceFee, 12),
        ]; // value configurations
        let fees = [
            prep_abis_1.ManagementFee.address,
            prep_abis_1.EntranceRateDirectFee.address,
            prep_abis_1.PerformanceFee.address,
        ]; // list of address
        // FINAL PREP of FEES
        feeArgsData = await (0, exports.getFeesManagerConfigArgsData)(fees, feeManagerSettingsData, signer.address, true);
    }
    //2. POLICY CONFIG
    if (policyConfig) {
        const options = {
            provider,
            denominationAsset,
            deposit: policyConfig?.deposit,
            asset: policyConfig?.asset,
            adpater: policyConfig?.adpater,
        };
        policyConfigData = await (0, exports.processPolicyConfigurationData)(options);
    }
    // GET FundDeployer Interface Data
    const FundDeployerInterface = new ethers_1.ethers.utils.Interface(JSON.parse(JSON.stringify(prep_abis_1.FundDeployer.abi)));
    // FundDeployer Contract
    const fundDeployer = new ethers_1.ethers.Contract(prep_abis_1.FundDeployer.address, FundDeployerInterface, signer);
    //0xd0a1e359811322d97991e03f863a0c30c2cf029c
    const fund = await fundDeployer.createNewFund(signer.address, fundName, denominationAsset, timeLockInSeconds, feeArgsData, policyConfigData, { nonce: nonce, gasLimit: gaslimit });
    return fund;
};
exports.createNewFund = createNewFund;
/**
 * Rate is  number representing a 1%
 */
const getManagementFees = (rate) => {
    // Must convert from rate to scaledPerSecondRate
    var scaledPerSecondRate = (0, fund_1.convertRateToScaledPerSecondRate)(rate);
    return (0, fund_1.managementFeeConfigArgs)(scaledPerSecondRate);
};
exports.getManagementFees = getManagementFees;
/**
 *
 * @param {*} rate Rate in percentage
 * @param {*} period Period at which it will be applied
 */
const getPerformanceFees = (rate, period) => {
    // The period will default to 30 days
    const defaultPeriod = 2592000;
    // remove code
    // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
    rate = ethers_1.utils.parseEther((rate / 100).toString());
    return (0, fund_1.performanceFeeConfigArgs)(rate, defaultPeriod);
};
exports.getPerformanceFees = getPerformanceFees;
/**
 * Rate is  number representing a 1%
 */
function getEntranceRateFeeConfigArgs(rate) {
    // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
    rate = ethers_1.utils.parseEther(rate.toString());
    return (0, fund_1.encodeArgs)(["uint256"], [rate]);
}
exports.getEntranceRateFeeConfigArgs = getEntranceRateFeeConfigArgs;
const getPolicyArgsData = (policies, policySettings) => {
    return (0, fund_1.encodeArgs)(["address[]", "bytes[]"], [policies, policySettings]);
};
exports.getPolicyArgsData = getPolicyArgsData;
/**
 *
 * @param {*} fees
 * @param {*} feeManagerSettingsData
 * @param {*} _signer
 * @param {*} allow
 * @returns
 */
const getFeesManagerConfigArgsData = async (fees, feeManagerSettingsData, _signer, allow) => {
    // remove code
    // console.log(fees, feeManagerSettingsData, _signer, allow);
    const FeeManagerInterface = new ethers_1.ethers.utils.Interface(JSON.parse(JSON.stringify(prep_abis_1.FeeManager.abi)));
    // remove in mainnet
    const feeManager = new ethers_1.ethers.Contract(prep_abis_1.FeeManager.address, FeeManagerInterface);
    let fees_unregister = [];
    // end
    try {
        if (allow) {
            const registeredFees = await feeManager.getRegisteredFees();
            if (registeredFees.length === 0) {
                fees_unregister = [prep_abis_1.ManagementFee.address, prep_abis_1.PerformanceFee.address];
                await feeManager.registerFees(fees_unregister, { gasLimit: 300000 });
            }
            else {
                if (!registeredFees.includes(prep_abis_1.ManagementFee.address)) {
                    fees_unregister.push(prep_abis_1.ManagementFee.address);
                }
                if (!registeredFees.includes(prep_abis_1.PerformanceFee.address)) {
                    fees_unregister.push(prep_abis_1.PerformanceFee.address);
                }
                if (!registeredFees.includes(prep_abis_1.EntranceRateDirectFee.address)) {
                    fees_unregister.push(prep_abis_1.EntranceRateDirectFee.address);
                }
            }
            // Register this fees for app use
            if (fees_unregister.length > 0) {
                await feeManager.registerFees(fees_unregister, { gasLimit: 300000 });
            }
        }
        // Convert Fees
    }
    catch (error) { }
    return (0, fund_1.feeManagerConfigArgs)({
        fees: fees,
        settings: feeManagerSettingsData,
    });
};
exports.getFeesManagerConfigArgsData = getFeesManagerConfigArgsData;
/**
 *
 * @param assetAddress Asset address
 * @param signer
 * @returns
 */
async function getAssetDecimals(assetAddress, signer) {
    try {
        // we use VaultLib as an interface because it has the `decimals()` getter
        const assetInterface = new ethers_1.ethers.utils.Interface(JSON.parse(JSON.stringify(prep_abis_1.VaultLib.abi)));
        const asset = new ethers_1.ethers.Contract(assetAddress, assetInterface, signer);
        const decimals = await asset.decimals();
        return decimals;
    }
    catch (error) {
        return { error: false };
    }
}
exports.getAssetDecimals = getAssetDecimals;
