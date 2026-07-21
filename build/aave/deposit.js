"use strict";
// (i). Deposit collateral
Object.defineProperty(exports, "__esModule", { value: true });
exports.deposit = void 0;
const ethers_1 = require("ethers");
const AaveProvider_1 = require("./AaveProvider");
const deposit = async (lendingPoolAddressproviderAddress, provider, signer, amount, asset) => {
    const aaveProviderWrapper = await AaveProvider_1.aaveProvider.connect(lendingPoolAddressproviderAddress, provider, signer);
    if (aaveProviderWrapper.done) {
        try {
            const deposit = await AaveProvider_1.aaveProvider.depositCollateral(parseInt(ethers_1.ethers.utils.parseEther(amount.toString()).toString()).toString(), asset, signer);
            console.log(deposit);
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.deposit = deposit;
