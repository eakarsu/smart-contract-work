"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invest = exports.approveBeforeInvesting = void 0;
const ethers_1 = require("ethers");
const fund_1 = require("../utils/fund");
const withdrawal_deposits_1 = require("./../funds/withdrawal-deposits");
/**
 * Approve Amount for investment
 * @param fundAddress  Fund location address
 * @param provider  ethers's jsonrpcProvider
 * @param amount Amount to approve
 * @returns
 */
const approveBeforeInvesting = async (fundAddress, provider, amount) => {
    try {
        amount = (0, fund_1.fullNumber)(ethers_1.utils.hexlify(amount.toString()));
        if (amount == 0)
            return;
        return await (0, withdrawal_deposits_1.approveForInvestment)(fundAddress, provider, amount);
    }
    catch (e) {
        return e;
    }
};
exports.approveBeforeInvesting = approveBeforeInvesting;
const invest = async (fundAddress, provider, signer, amountToInvest) => {
    try {
        if (amount == 0)
            return;
        var amount = (0, fund_1.fullNumber)(ethers_1.utils.hexlify(amountToInvest.toString()));
        return await (0, withdrawal_deposits_1.investFundDenomination)(fundAddress, signer.address, provider, amount);
    }
    catch (e) {
        return e;
    }
};
exports.invest = invest;
