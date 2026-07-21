"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aaveProvider = void 0;
const ethers_1 = require("ethers");
const prep_abis_1 = require("./../prep-abis");
class AaveProvider {
    _provider;
    _lendingProviderAddress;
    _signer;
    _lpAddressProviderContract;
    /**
     * Get Authenticated JsonRpcProvider to use for
     * all other transactions
     */
    get provider() {
        if (!this._provider) {
            throw new Error("Please provider your JsonRpcProvider to continue");
        }
        return this._provider;
    }
    /**
     * Get the Lending Pool Address Provider contract
     * Instance.
     */
    get lendingPoolAddressProviderContract() {
        if (!this._lpAddressProviderContract) {
            throw new Error("Please pvovide the lending pool address");
        }
        return this._lpAddressProviderContract;
    }
    /**
     * Entry point to aave provider for depositing collateral and borrowing assets
     * @param lpAddressProviderAddress  LendingPoolAddressProviderAddress
     * @param provider Web3Provider instance
     * @returns
     */
    async connect(lpAddressProviderAddress, provider, signer) {
        return new Promise((resolve, reject) => {
            try {
                this._lendingProviderAddress = lpAddressProviderAddress;
                this._lpAddressProviderContract = new ethers_1.ethers.Contract(lpAddressProviderAddress, prep_abis_1.AaveAddressProviderABI, signer);
                this._signer = signer;
                // connect the provider
                this._provider = provider;
                resolve({ done: true, message: "successfully connected" });
            }
            catch (error) {
                console.log("Error", error);
                reject(error);
            }
        });
    }
    /**
     *
     * @returns String of LendingPoolAddress
     */
    async getLendingPoolAddress() {
        try {
            return await this._lpAddressProviderContract.getLendingPool();
        }
        catch (error) {
            throw Error(`Error getting lendingPool address: ${error.message}`);
        }
    }
    /**
     *
     * @returns String of lendingPool Core address
     */
    async getLendingPoolCoreAddress() {
        console.log("Core Address", await this._lpAddressProviderContract.getLendingPoolCore());
        try {
            return await this._lpAddressProviderContract.getLendingPoolCore();
        }
        catch (error) {
            throw Error(`Error getting lendingPool Core address: ${error.message}`);
        }
    }
    /**
     *
     * @returns Get Connected user address
     */
    async userAddress() {
        return await this.provider.getSigner().getAddress();
    }
    /**
     * Get connected Signer authenticated account
     */
    async signer() {
        return this.provider.getSigner();
    }
    /**
     * Allow connect wallet to deposit colleteral to aave protocol
     * @param amount
     * @param assetAddress
     * @returns Deposit Tranasaction information
     */
    async depositCollateral(amount, assetAddress, signer) {
        try {
            const referralCode = 0;
            let nonce = await this.provider.getTransactionCount(await signer.getAddress(), "pending");
            const lendingPoolAddress = await this.getLendingPoolAddress();
            const assetContact = new ethers_1.ethers.Contract(assetAddress, prep_abis_1.ERC20ABI, signer);
            // approve asset
            const txApprove = await assetContact.approve(lendingPoolAddress, amount, {
                gasLimit: "600000",
                nonce,
            });
            console.log(`APPROVE: ${txApprove?.hash}`);
            // Get lending Pool Contract instance
            const lendingPoolContract = new ethers_1.ethers.Contract(lendingPoolAddress, prep_abis_1.AaveLendingPoolABI, signer);
            // deposit amount
            const tx = await lendingPoolContract.deposit(assetAddress, amount, signer.address, referralCode, {
                gasLimit: "600000",
                nonce: nonce + 1,
                from: await signer.getAddress(),
            });
            console.log(`DEPOSIT: ${tx?.hash}`);
            return {
                message: "Successfully deposited amount for collateral",
                error: "",
                deposit: tx,
            };
        }
        catch (error) {
            return { message: "Error occurred", error, tx: "" };
        }
    }
    /**
     *
     * @param amount Amount
     * @param assetAddress
     * @param interestRateMode
     * @param signer
     * @returns
     */
    async borrowAsset(amount, assetAddress, interestRateMode, signer) {
        try {
            const referralCode = "0";
            const assetContact = new ethers_1.ethers.Contract(assetAddress, prep_abis_1.ERC20ABI, signer);
            console.log(`Initial Balance: ${await assetContact.balanceOf(signer.address)}`);
            const lendingPoolAddress = await this.getLendingPoolAddress();
            let nonce = await this.provider.getTransactionCount(await signer.getAddress(), "pending");
            // approve asset
            // const txApprove = await assetContact.approve(lendingPoolAddress, amount, {
            //   gasLimit: "600000",
            //   nonce,
            // });
            // console.log(`BORROWS APPROVE: ${txApprove?.hash}`);
            // Get lending Pool Contract instance
            const lendingPoolContract = new ethers_1.ethers.Contract(lendingPoolAddress, prep_abis_1.AaveLendingPoolABI, signer);
            const borrow = await lendingPoolContract.borrow(assetAddress, amount, interestRateMode, referralCode, signer.address, {
                gasLimit: "600000",
                nonce: nonce,
            });
            console.log(borrow);
            console.log(`After Balance: ${await assetContact.balanceOf(signer.address)}`);
            return { message: "Successfully borrowed asset", error: null, borrow };
        }
        catch (error) {
            return { message: "Error occurred", error };
        }
    }
}
exports.aaveProvider = new AaveProvider();
