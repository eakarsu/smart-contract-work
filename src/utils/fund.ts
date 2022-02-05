import { utils, BigNumber, BigNumberish, BytesLike } from "ethers";
import { AddressLike, resolveArguments } from "@enzymefinance/ethers";
import { Decimal } from "decimal.js";

export function sighash(fragment: utils.FunctionFragment) {
  return utils.hexDataSlice(utils.id(fragment.format()), 0, 4);
}

export const managementFeeDigits = 27;
export const managementFeeScale = BigNumber.from(10).pow(managementFeeDigits);
export const managementFeeScaleDecimal = new Decimal(
  managementFeeScale.toString()
);
export const secondsPerYear = 365 * 24 * 60 * 60;

Decimal.set({ precision: 2 * managementFeeDigits });

// ethers.utils.parseEther("0.1") // 10%

export function encodeArgs(types: any, args: any) {
  const params = types.map((type: any) => utils.ParamType.from(type));
  const resolved = resolveArguments(params, args); // byteLike value
  const hex = utils.defaultAbiCoder.encode(params, resolved);
  return utils.hexlify(utils.arrayify(hex));
}

export function encodeFunctionData(fragment: any, args: any) {
  const encodedArgs = encodeArgs(fragment.inputs, args);
  return utils.hexlify(utils.concat([sighash(fragment), encodedArgs]));
}

export function feeManagerConfigArgs({
  fees,
  settings,
}: {
  fees: AddressLike[];
  settings: BytesLike[];
}) {
  return encodeArgs(["address[]", "bytes[]"], [fees, settings]);
}

export function payoutSharesOutstandingForFeesArgs(fees: AddressLike[]) {
  return encodeArgs(["address[]"], [fees]);
}

// START OF MANANGEMENT FEES
export function managementFeeConfigArgs(scaledPerSecondRate: BigNumberish) {
  return encodeArgs(["uint256"], [scaledPerSecondRate]);
}

export function convertRateToScaledPerSecondRate(rate: BigNumberish) {
  const rateD = new Decimal(utils.formatEther(rate));
  const effectivRate = rateD.div(new Decimal(1).minus(rateD));

  const factor = new Decimal(1)
    .plus(effectivRate)
    .pow(1 / secondsPerYear)
    .toSignificantDigits(managementFeeDigits)
    .mul(managementFeeScaleDecimal);

  return BigNumber.from(factor.toFixed(0));
}
// END OF MANAGEMENT FEES

// PERFORMANCE FEES
export function performanceFeeConfigArgs(
  rate: BigNumberish,
  period: BigNumberish
) {
  return encodeArgs(["uint256", "uint256"], [rate, period]);
}

// END OF PERFORMANCE FEES

// ENTRANCE FEES
export function entranceRateFeeConfigArgs(rate: BigNumberish) {
  return encodeArgs(["uint256"], [rate]);
}

export function entranceRateFeeSharesDue({
  rate,
  sharesBought,
}: {
  rate: BigNumberish;
  sharesBought: BigNumberish;
}) {
  return BigNumber.from(sharesBought)
    .mul(rate)
    .div(utils.parseEther("1").add(rate));
}

// END OF ENTRACE FEES

// START OF MANANGEMENT FEES

export function rpow(x: BigNumberish, n: BigNumberish, b: BigNumberish) {
  const xD = new Decimal(BigNumber.from(x).toString());
  const bD = new Decimal(BigNumber.from(b).toString());
  const nD = new Decimal(BigNumber.from(n).toString());

  const xDPow = xD.div(bD).pow(nD);

  return BigNumber.from(xDPow.mul(bD).toFixed(0));
}

export function managementFeeSharesDue({
  scaledPerSecondRate,
  sharesSupply,
  secondsSinceLastSettled,
}: {
  scaledPerSecondRate: BigNumberish;
  sharesSupply: BigNumberish;
  secondsSinceLastSettled: BigNumberish;
}) {
  const timeFactor = rpow(
    scaledPerSecondRate,
    secondsSinceLastSettled,
    managementFeeScale
  );

  const sharesDue = BigNumber.from(sharesSupply)
    .mul(timeFactor.sub(managementFeeScale))
    .div(managementFeeScale);

  return sharesDue;
}

// END OF MANAGEMENT FEES

///

export function adapterBlacklistArgs(adapters: AddressLike[]) {
  return encodeArgs(["address[]"], [adapters]);
}

export function adapterWhitelistArgs(adapters: AddressLike[]) {
  return encodeArgs(["address[]"], [adapters]);
}

export function assetBlacklistArgs(assets: AddressLike[]) {
  return encodeArgs(["address[]"], [assets]);
}

export function assetWhitelistArgs(assets: AddressLike[]) {
  return encodeArgs(["address[]"], [assets]);
}

export function buySharesCallerWhitelistArgs({
  buySharesCallersToAdd = [],
  buySharesCallersToRemove = [],
}) {
  return encodeArgs(
    ["address[]", "address[]"],
    [buySharesCallersToAdd, buySharesCallersToRemove]
  );
}

export function buySharesPriceFeedToleranceArgs(tolerance: any) {
  return encodeArgs(["uint256"], [tolerance]);
}

export function guaranteedRedemptionArgs({
  startTimestamp,
  duration,
}: {
  startTimestamp: any;
  duration: any;
}) {
  return encodeArgs(["uint256", "uint256"], [startTimestamp, duration]);
}

export function investorWhitelistArgs({
  investorsToAdd = [],
  investorsToRemove = [],
}) {
  return encodeArgs(
    ["address[]", "address[]"],
    [investorsToAdd, investorsToRemove]
  );
}

export function maxConcentrationArgs(maxConcentration: BigNumberish) {
  return encodeArgs(["uint256"], [maxConcentration]);
}

export function minMaxInvestmentArgs({
  minInvestmentAmount,
  maxInvestmentAmount,
}: {
  minInvestmentAmount: BigNumberish;
  maxInvestmentAmount: BigNumberish;
}) {
  return encodeArgs(
    ["uint256", "uint256"],
    [minInvestmentAmount, maxInvestmentAmount]
  );
}

export function policyManagerConfigArgs({
  policies,
  settings,
}: {
  policies: AddressLike[];
  settings: BytesLike[];
}) {
  return encodeArgs(["address[]", "bytes[]"], [policies, settings]);
}

export function convertScaledPerSecondRateToRate(
  scaledPerSecondRate: BigNumberish
) {
  const scaledPerSecondRateD = new Decimal(scaledPerSecondRate.toString()).div(
    managementFeeScaleDecimal
  );
  const effectiveRate = scaledPerSecondRateD
    .pow(secondsPerYear)
    .minus(new Decimal(1));
  const rate = effectiveRate.div(new Decimal(1).plus(effectiveRate));

  return utils.parseEther(rate.toFixed(17, Decimal.ROUND_UP));
}

export const getMinMaxDepositPolicyArgs = (
  minDeposit: BigNumber,
  maxDeposit: BigNumber
) => {
  return encodeArgs(["uint256", "uint256"], [minDeposit, maxDeposit]);
};

export const getAddressArrayPolicyArgs = (ars: any) => {
  return encodeArgs(["address[]"], [ars]);
};

export const fullNumber = (x: any)  =>{
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}