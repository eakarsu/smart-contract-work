"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrow = void 0;
const ethers_1 = require("ethers");
const AaveProvider_1 = require("./AaveProvider");
const borrow = async (lendingPoolAddressproviderAddress, provider, signer, amount, asset) => {
    const aaveProviderWrapper = await AaveProvider_1.aaveProvider.connect(lendingPoolAddressproviderAddress, provider, signer);
    if (aaveProviderWrapper.done) {
        try {
            const borrow = await AaveProvider_1.aaveProvider.borrowAsset(parseInt(ethers_1.ethers.utils.parseEther(amount.toString()).toString()).toString(), asset, 1, signer);
            console.log(borrow);
            return borrow;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
};
exports.borrow = borrow;
