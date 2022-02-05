"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullNumber = exports.getAddressArrayPolicyArgs = exports.getMinMaxDepositPolicyArgs = exports.convertScaledPerSecondRateToRate = exports.policyManagerConfigArgs = exports.minMaxInvestmentArgs = exports.maxConcentrationArgs = exports.investorWhitelistArgs = exports.guaranteedRedemptionArgs = exports.buySharesPriceFeedToleranceArgs = exports.buySharesCallerWhitelistArgs = exports.assetWhitelistArgs = exports.assetBlacklistArgs = exports.adapterWhitelistArgs = exports.adapterBlacklistArgs = exports.managementFeeSharesDue = exports.rpow = exports.entranceRateFeeSharesDue = exports.entranceRateFeeConfigArgs = exports.performanceFeeConfigArgs = exports.convertRateToScaledPerSecondRate = exports.managementFeeConfigArgs = exports.payoutSharesOutstandingForFeesArgs = exports.feeManagerConfigArgs = exports.encodeFunctionData = exports.encodeArgs = exports.secondsPerYear = exports.managementFeeScaleDecimal = exports.managementFeeScale = exports.managementFeeDigits = exports.sighash = void 0;
const ethers_1 = require("ethers");
const ethers_2 = require("@enzymefinance/ethers");
const decimal_js_1 = require("decimal.js");
function sighash(fragment) {
    return ethers_1.utils.hexDataSlice(ethers_1.utils.id(fragment.format()), 0, 4);
}
exports.sighash = sighash;
exports.managementFeeDigits = 27;
exports.managementFeeScale = ethers_1.BigNumber.from(10).pow(exports.managementFeeDigits);
exports.managementFeeScaleDecimal = new decimal_js_1.Decimal(exports.managementFeeScale.toString());
exports.secondsPerYear = 365 * 24 * 60 * 60;
decimal_js_1.Decimal.set({ precision: 2 * exports.managementFeeDigits });
// ethers.utils.parseEther("0.1") // 10%
function encodeArgs(types, args) {
    const params = types.map((type) => ethers_1.utils.ParamType.from(type));
    const resolved = (0, ethers_2.resolveArguments)(params, args); // byteLike value
    const hex = ethers_1.utils.defaultAbiCoder.encode(params, resolved);
    return ethers_1.utils.hexlify(ethers_1.utils.arrayify(hex));
}
exports.encodeArgs = encodeArgs;
function encodeFunctionData(fragment, args) {
    const encodedArgs = encodeArgs(fragment.inputs, args);
    return ethers_1.utils.hexlify(ethers_1.utils.concat([sighash(fragment), encodedArgs]));
}
exports.encodeFunctionData = encodeFunctionData;
function feeManagerConfigArgs({ fees, settings, }) {
    return encodeArgs(["address[]", "bytes[]"], [fees, settings]);
}
exports.feeManagerConfigArgs = feeManagerConfigArgs;
function payoutSharesOutstandingForFeesArgs(fees) {
    return encodeArgs(["address[]"], [fees]);
}
exports.payoutSharesOutstandingForFeesArgs = payoutSharesOutstandingForFeesArgs;
// START OF MANANGEMENT FEES
function managementFeeConfigArgs(scaledPerSecondRate) {
    return encodeArgs(["uint256"], [scaledPerSecondRate]);
}
exports.managementFeeConfigArgs = managementFeeConfigArgs;
function convertRateToScaledPerSecondRate(rate) {
    const rateD = new decimal_js_1.Decimal(ethers_1.utils.formatEther(rate));
    const effectivRate = rateD.div(new decimal_js_1.Decimal(1).minus(rateD));
    const factor = new decimal_js_1.Decimal(1)
        .plus(effectivRate)
        .pow(1 / exports.secondsPerYear)
        .toSignificantDigits(exports.managementFeeDigits)
        .mul(exports.managementFeeScaleDecimal);
    return ethers_1.BigNumber.from(factor.toFixed(0));
}
exports.convertRateToScaledPerSecondRate = convertRateToScaledPerSecondRate;
// END OF MANAGEMENT FEES
// PERFORMANCE FEES
function performanceFeeConfigArgs(rate, period) {
    return encodeArgs(["uint256", "uint256"], [rate, period]);
}
exports.performanceFeeConfigArgs = performanceFeeConfigArgs;
// END OF PERFORMANCE FEES
// ENTRANCE FEES
function entranceRateFeeConfigArgs(rate) {
    return encodeArgs(["uint256"], [rate]);
}
exports.entranceRateFeeConfigArgs = entranceRateFeeConfigArgs;
function entranceRateFeeSharesDue({ rate, sharesBought, }) {
    return ethers_1.BigNumber.from(sharesBought)
        .mul(rate)
        .div(ethers_1.utils.parseEther("1").add(rate));
}
exports.entranceRateFeeSharesDue = entranceRateFeeSharesDue;
// END OF ENTRACE FEES
// START OF MANANGEMENT FEES
function rpow(x, n, b) {
    const xD = new decimal_js_1.Decimal(ethers_1.BigNumber.from(x).toString());
    const bD = new decimal_js_1.Decimal(ethers_1.BigNumber.from(b).toString());
    const nD = new decimal_js_1.Decimal(ethers_1.BigNumber.from(n).toString());
    const xDPow = xD.div(bD).pow(nD);
    return ethers_1.BigNumber.from(xDPow.mul(bD).toFixed(0));
}
exports.rpow = rpow;
function managementFeeSharesDue({ scaledPerSecondRate, sharesSupply, secondsSinceLastSettled, }) {
    const timeFactor = rpow(scaledPerSecondRate, secondsSinceLastSettled, exports.managementFeeScale);
    const sharesDue = ethers_1.BigNumber.from(sharesSupply)
        .mul(timeFactor.sub(exports.managementFeeScale))
        .div(exports.managementFeeScale);
    return sharesDue;
}
exports.managementFeeSharesDue = managementFeeSharesDue;
// END OF MANAGEMENT FEES
///
function adapterBlacklistArgs(adapters) {
    return encodeArgs(["address[]"], [adapters]);
}
exports.adapterBlacklistArgs = adapterBlacklistArgs;
function adapterWhitelistArgs(adapters) {
    return encodeArgs(["address[]"], [adapters]);
}
exports.adapterWhitelistArgs = adapterWhitelistArgs;
function assetBlacklistArgs(assets) {
    return encodeArgs(["address[]"], [assets]);
}
exports.assetBlacklistArgs = assetBlacklistArgs;
function assetWhitelistArgs(assets) {
    return encodeArgs(["address[]"], [assets]);
}
exports.assetWhitelistArgs = assetWhitelistArgs;
function buySharesCallerWhitelistArgs({ buySharesCallersToAdd = [], buySharesCallersToRemove = [], }) {
    return encodeArgs(["address[]", "address[]"], [buySharesCallersToAdd, buySharesCallersToRemove]);
}
exports.buySharesCallerWhitelistArgs = buySharesCallerWhitelistArgs;
function buySharesPriceFeedToleranceArgs(tolerance) {
    return encodeArgs(["uint256"], [tolerance]);
}
exports.buySharesPriceFeedToleranceArgs = buySharesPriceFeedToleranceArgs;
function guaranteedRedemptionArgs({ startTimestamp, duration, }) {
    return encodeArgs(["uint256", "uint256"], [startTimestamp, duration]);
}
exports.guaranteedRedemptionArgs = guaranteedRedemptionArgs;
function investorWhitelistArgs({ investorsToAdd = [], investorsToRemove = [], }) {
    return encodeArgs(["address[]", "address[]"], [investorsToAdd, investorsToRemove]);
}
exports.investorWhitelistArgs = investorWhitelistArgs;
function maxConcentrationArgs(maxConcentration) {
    return encodeArgs(["uint256"], [maxConcentration]);
}
exports.maxConcentrationArgs = maxConcentrationArgs;
function minMaxInvestmentArgs({ minInvestmentAmount, maxInvestmentAmount, }) {
    return encodeArgs(["uint256", "uint256"], [minInvestmentAmount, maxInvestmentAmount]);
}
exports.minMaxInvestmentArgs = minMaxInvestmentArgs;
function policyManagerConfigArgs({ policies, settings, }) {
    return encodeArgs(["address[]", "bytes[]"], [policies, settings]);
}
exports.policyManagerConfigArgs = policyManagerConfigArgs;
function convertScaledPerSecondRateToRate(scaledPerSecondRate) {
    const scaledPerSecondRateD = new decimal_js_1.Decimal(scaledPerSecondRate.toString()).div(exports.managementFeeScaleDecimal);
    const effectiveRate = scaledPerSecondRateD
        .pow(exports.secondsPerYear)
        .minus(new decimal_js_1.Decimal(1));
    const rate = effectiveRate.div(new decimal_js_1.Decimal(1).plus(effectiveRate));
    return ethers_1.utils.parseEther(rate.toFixed(17, decimal_js_1.Decimal.ROUND_UP));
}
exports.convertScaledPerSecondRateToRate = convertScaledPerSecondRateToRate;
const getMinMaxDepositPolicyArgs = (minDeposit, maxDeposit) => {
    return encodeArgs(["uint256", "uint256"], [minDeposit, maxDeposit]);
};
exports.getMinMaxDepositPolicyArgs = getMinMaxDepositPolicyArgs;
const getAddressArrayPolicyArgs = (ars) => {
    return encodeArgs(["address[]"], [ars]);
};
exports.getAddressArrayPolicyArgs = getAddressArrayPolicyArgs;
const fullNumber = (x) => {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split("e-")[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = "0." + new Array(e).join("0") + x.toString().substring(2);
        }
    }
    else {
        var e = parseInt(x.toString().split("+")[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += new Array(e + 1).join("0");
        }
    }
    return x;
};
exports.fullNumber = fullNumber;
