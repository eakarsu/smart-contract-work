import { ethers } from "ethers";
declare class AaveProvider {
    private _provider;
    private _lendingProviderAddress;
    private _signer;
    private _lpAddressProviderContract;
    /**
     * Get Authenticated JsonRpcProvider to use for
     * all other transactions
     */
    get provider(): ethers.providers.JsonRpcProvider;
    /**
     * Get the Lending Pool Address Provider contract
     * Instance.
     */
    get lendingPoolAddressProviderContract(): ethers.Contract;
    /**
     * Entry point to aave provider for depositing collateral and borrowing assets
     * @param lpAddressProviderAddress  LendingPoolAddressProviderAddress
     * @param provider Web3Provider instance
     * @returns
     */
    connect(lpAddressProviderAddress: string, provider: any, signer: ethers.Wallet): Promise<{
        done: boolean;
        message: string;
    }>;
    /**
     *
     * @returns String of LendingPoolAddress
     */
    getLendingPoolAddress(): Promise<string>;
    /**
     *
     * @returns String of lendingPool Core address
     */
    getLendingPoolCoreAddress(): Promise<string>;
    /**
     *
     * @returns Get Connected user address
     */
    userAddress(): Promise<string>;
    /**
     * Get connected Signer authenticated account
     */
    signer(): Promise<ethers.providers.JsonRpcSigner>;
    /**
     * Allow connect wallet to deposit colleteral to aave protocol
     * @param amount
     * @param assetAddress
     * @returns Deposit Tranasaction information
     */
    depositCollateral(amount: string, assetAddress: string, signer: ethers.Wallet): Promise<{
        message: string;
        error: string;
        deposit: any;
        tx?: undefined;
    } | {
        message: string;
        error: unknown;
        tx: string;
        deposit?: undefined;
    }>;
    /**
     *
     * @param amount Amount
     * @param assetAddress
     * @param interestRateMode
     * @param signer
     * @returns
     */
    borrowAsset(amount: string, assetAddress: string, interestRateMode: number, signer: ethers.Wallet): Promise<{
        message: string;
        error: null;
        borrow: any;
    } | {
        message: string;
        error: any;
        borrow?: undefined;
    }>;
}
export declare const aaveProvider: AaveProvider;
export {};
