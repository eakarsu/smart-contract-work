"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemAllShares = exports.getDenominationBalance = exports.investFundDenomination = exports.approveForInvestment = exports.getDenominationAllowance = exports.getContracts = void 0;
const ethers_1 = require("ethers");
const prep_abis_1 = require("./../prep-abis");
/**
 *
 * @param fundAddress Fund location address
 * @param provider  ethers'  jsonRPCProvider
 * @returns
 */
const getContracts = async (fundAddress, provider) => {
    const signer = await provider.getSigner();
    const VaultLibInterface = new ethers_1.ethers.utils.Interface(JSON.parse(JSON.stringify(prep_abis_1.VaultLib.abi)));
    const ComptrollerLibInterface = new ethers_1.ethers.utils.Interface(JSON.parse(JSON.stringify(prep_abis_1.ComptrollerLib.abi)));
    const vaultLibContract = new ethers_1.ethers.Contract(fundAddress, VaultLibInterface, signer);
    // Estimation
    const comptroller = await vaultLibContract.getAccessor();
    const comptrollerContract = new ethers_1.ethers.Contract(comptroller, ComptrollerLibInterface, signer);
    const denominationAsset = await comptrollerContract.getDenominationAsset();
    // Use VaultLib interface for shares functions
    const assetContract = new ethers_1.ethers.Contract(denominationAsset, VaultLibInterface, signer);
    return {
        assetContract,
        comptrollerContract,
        vaultLibContract,
    };
};
exports.getContracts = getContracts;
/**
 * Get the denomation asset allowance balance
 * @param fundAddress Fund location address
 * @param investor Investor's adddess
 * @param provider ethers' jsonRPCProvider
 * @returns
 */
const getDenominationAllowance = async (fundAddress, investor, provider) => {
    const { assetContract, comptrollerContract } = await (0, exports.getContracts)(fundAddress, provider);
    const allowance = await assetContract.allowance(investor, comptrollerContract.address);
    return allowance;
};
exports.getDenominationAllowance = getDenominationAllowance;
/**
 *
 * @param fundAddress Fund location address
 * @param provider Ethers' JSONRpcProvider
 * @param amount  Amount to approve
 * @returns
 */
const approveForInvestment = async (fundAddress, provider, amount) => {
    const { assetContract, comptrollerContract } = await (0, exports.getContracts)(fundAddress, provider);
    const receipt = await assetContract.approve(comptrollerContract.address, amount);
    await receipt.wait();
    return;
};
exports.approveForInvestment = approveForInvestment;
/**
 *
 * @param fundAddress Fund location address
 * @param investor Investor's address
 * @param provider Ethers' JSONRpcProvider
 * @param amount Amount to invest
 */
const investFundDenomination = async (fundAddress, investor, provider, amount) => {
    const { comptrollerContract } = await (0, exports.getContracts)(fundAddress, provider);
    const receipt = await comptrollerContract.buyShares([investor], [amount], [1]);
    await receipt.wait();
};
exports.investFundDenomination = investFundDenomination;
/**
 * Get the fund's denomination asset balance
 * @param fundAddress Fund location address
 * @param investor  Investor's address
 * @param provider  Ethers's jsonRpceProvider
 * @returns Balance of denomination asset
 */
const getDenominationBalance = async (fundAddress, investor, provider) => {
    const { assetContract } = await (0, exports.getContracts)(fundAddress, provider);
    const balance = await assetContract.balanceOf(investor);
    return balance;
};
exports.getDenominationBalance = getDenominationBalance;
/**
 * Use this function to redeem some or all your shares
 * @param fundAddress Fund location address
 * @param provider Provider to use. Ethers's jsonRpcProvider
 */
const redeemAllShares = async (fundAddress, provider) => {
    const { comptrollerContract } = await (0, exports.getContracts)(fundAddress, provider);
    const receipt = await comptrollerContract.redeemShares();
    return await receipt.wait();
};
exports.redeemAllShares = redeemAllShares;
