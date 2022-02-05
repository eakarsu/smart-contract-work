// ******************************** TEST ON KOVAN/LOCAL NETWORK ******************************
import { ethers } from "ethers";
import Web3 from "web3";
import { aaveProvider } from "./../aave/index";
import {configs}  from  './../config'

const web3 = new Web3("http://127.0.0.1:8545");

const provider = new ethers.providers.JsonRpcProvider(
 configs.HTTP_URL
);

const signer = new ethers.Wallet(configs.PRIVATE_KEY, provider);


const LP_ADDRESS_PROVIDER_ADDRESS = "0x88757f2f99175387aB4C6a4b3067c77A695b0349"
const BORROW_ASSET = "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd" // DAIs
const DEPOSIT_ASSET = "0xd0A1E359811322d97991E03f863a0C30C2cF029C" // WETH

const deposit = async () => {
  const aaveProviderWrapper = await aaveProvider.connect(
    LP_ADDRESS_PROVIDER_ADDRESS,
    provider,
    signer
  );

  if (aaveProviderWrapper.done) {
    try {
      const deposit = await aaveProvider.depositCollateral(
        parseInt(ethers.utils.parseEther("2").toString()).toString(),
        DEPOSIT_ASSET,
        signer
      );

      console.log(deposit);

    
    } catch (error) {
        console.log(error);
    }
  }
};




const borrow  = async () => {
  const aaveProviderWrapper = await aaveProvider.connect(LP_ADDRESS_PROVIDER_ADDRESS,
    provider,
    signer
  );

  if (aaveProviderWrapper.done) {
    try {
      const borrow = await aaveProvider.borrowAsset(
        parseInt(ethers.utils.parseEther("150").toString()).toString(),
        BORROW_ASSET,
        1,
        signer
      );

      console.log(borrow);

      console.log(borrow);
    } catch (error) {
        console.log(error);
    }
  }
};


// deposit collateral 
// deposit()
// borrow asset
borrow()