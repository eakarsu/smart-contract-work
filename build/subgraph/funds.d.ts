/**
 * It gives a list of all denomination assets
 * @param SUB_GRAPH_ENDPOINT Endpoint to where the subgraph is deployed to.
 * @returns
 */
export declare const getDenominationAssets: (SUB_GRAPH_ENDPOINT: string) => Promise<any>;
/**endpointendpoint
 * Get all assets integrations
 * @param SUB_GRAPH_ENDPOINT Subgraph endpoint
 * @returns
 */
export declare const getAllAssetsIntegrations: (SUB_GRAPH_ENDPOINT: string) => Promise<any>;
/**
 * Lists of all user created funds, that is where user is the manager
 * @param SUB_GRAPH_ENDPOINT Subgraph endpoint
 * @param accessor_address  User Address,
 * @returns List of Funds
 */
export declare const getCurrentUserFunds: (SUB_GRAPH_ENDPOINT: string, accessor_address: string) => Promise<any>;
/**
 * List all user transactions
 * @param SUB_GRAPH_ENDPOINT
 * @param walletAddress
 * @returns
 */
export declare const listAllUserTransactions: (SUB_GRAPH_ENDPOINT: string, walletAddress: string) => Promise<unknown>;
/**
 * List all funds within the application
 * @param SUB_GRAPH_ENDPOINT
 * @returns
 */
export declare const listAllFunds: (SUB_GRAPH_ENDPOINT: string) => Promise<any>;
/**
 *  Get a list all user vaults.
 * @param SUB_GRAPH_ENDPOINT  Subgraph link endpoint
 * @param user_address User address
 * @returns List of funds
 */
export declare const walletAddressUserVaults: (SUB_GRAPH_ENDPOINT: string, user_address: string) => Promise<any>;
/**
 * Get of all user investments on all funds, This one give a list of funds with their investments
 * @param SUB_GRAPH_ENDPOINT Subgraph link
 * @param address User address
 * @returns
 */
export declare const getUserAddressInvestments: (SUB_GRAPH_ENDPOINT: string, address: string) => Promise<any>;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param fundId  Created fund address
 * @returns Minimum and maximum investment amount
 */
export declare const minMaxDepositAmounts: (SUB_GRAPH_ENDPOINT: string, fundId: string) => Promise<any>;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param comptrollerId  Fund comptroller address
 * @returns Performance Fee
 */
export declare const performanceFee: (SUB_GRAPH_ENDPOINT: string, comptrollerId: string) => Promise<{
    rate: any;
    period: any;
}>;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param fundId Created fund address
 * @returns {rate: entrance rate}
 */
export declare const entranceDirectBurnFees: (SUB_GRAPH_ENDPOINT: string, fundId: string) => Promise<{
    rate: any;
}>;
/**
 * Fund management fee set during creation.
 * @param SUB_GRAPH_ENDPOINT  Deployed subgraph http url
 * @param comptrollerId  Comptroller Address (id)
 */
export declare const managementFee: (SUB_GRAPH_ENDPOINT: string, comptrollerId: string) => Promise<{
    scaledPerSecondRate: import("ethers").BigNumber;
} | {
    scaledPerSecondRate: string;
}>;
