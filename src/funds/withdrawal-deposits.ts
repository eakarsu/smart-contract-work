
  
import { ethers } from "ethers";
import { VaultLib, ComptrollerLib}  from './../prep-abis'

/**
 * 
 * @param fundAddress Fund location address
 * @param provider  ethers'  jsonRPCProvider
 * @returns 
 */
export const getContracts = async (fundAddress:  string, provider:  any) => {
  const signer = await provider.getSigner();

  const VaultLibInterface = new ethers.utils.Interface(
    JSON.parse(JSON.stringify(VaultLib.abi))
  );
  const ComptrollerLibInterface = new ethers.utils.Interface(
    JSON.parse(JSON.stringify(ComptrollerLib.abi))
  );

  const vaultLibContract = new ethers.Contract(
    fundAddress,
    VaultLibInterface,
    signer
  );

  // Estimation
  const comptroller = await vaultLibContract.getAccessor();
  const comptrollerContract = new ethers.Contract(
    comptroller,
    ComptrollerLibInterface,
    signer
  );
  const denominationAsset = await comptrollerContract.getDenominationAsset();

  // Use VaultLib interface for shares functions
  const assetContract = new ethers.Contract(
    denominationAsset,
    VaultLibInterface,
    signer
  );

  return {
    assetContract,
    comptrollerContract,
    vaultLibContract,
  };
};



/**
 * Get the denomation asset allowance balance
 * @param fundAddress Fund location address 
 * @param investor Investor's adddess
 * @param provider ethers' jsonRPCProvider
 * @returns 
 */
export const getDenominationAllowance = async (
    fundAddress: string,
    investor: string,
    provider:  any
  ) => {
  
    const { assetContract, comptrollerContract } = await getContracts(
      fundAddress,
      provider
    );
  
    const allowance = await assetContract.allowance(
      investor,
      comptrollerContract.address
    );
  
    return allowance;
  };



  /**
   * 
   * @param fundAddress Fund location address
   * @param provider Ethers' JSONRpcProvider
   * @param amount  Amount to approve
   * @returns 
   */
  export const approveForInvestment = async (fundAddress: string, provider: any, amount: any) => {
    const { assetContract, comptrollerContract } = await getContracts(
      fundAddress,
      provider
    );
  
    const receipt = await assetContract.approve(
      comptrollerContract.address,
      amount
    );
    await receipt.wait();
  
    return;
  };
  

  /**
   * 
   * @param fundAddress Fund location address
   * @param investor Investor's address
   * @param provider Ethers' JSONRpcProvider
   * @param amount Amount to invest
   */
  export const investFundDenomination = async (
    fundAddress: string,
    investor:  string,
    provider:  any,
    amount: any
  ) => {
    const { comptrollerContract } = await getContracts(fundAddress, provider);
  
    const receipt = await comptrollerContract.buyShares(
      [investor],
      [amount],
      [1]
    );
  
    await receipt.wait();
  };
  

/**
 * Get the fund's denomination asset balance
 * @param fundAddress Fund location address
 * @param investor  Investor's address
 * @param provider  Ethers's jsonRpceProvider
 * @returns Balance of denomination asset
 */
export const getDenominationBalance = async (
    fundAddress: string,
    investor: string,
    provider: any
  ) => {  
    const { assetContract } = await getContracts(fundAddress, provider);
  
    const balance = await assetContract.balanceOf(investor);

    return balance;
  };


  /**
   * Use this function to redeem some or all your shares
   * @param fundAddress Fund location address
   * @param provider Provider to use. Ethers's jsonRpcProvider
   */
  export const redeemAllShares = async (fundAddress: string, provider: any) => {
    const { comptrollerContract } = await getContracts(fundAddress, provider);
  
    const receipt = await comptrollerContract.redeemShares();
    return await receipt.wait();
  };