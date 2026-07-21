"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managementFee = exports.entranceDirectBurnFees = exports.performanceFee = exports.minMaxDepositAmounts = exports.getUserAddressInvestments = exports.walletAddressUserVaults = exports.listAllFunds = exports.listAllUserTransactions = exports.getCurrentUserFunds = exports.getAllAssetsIntegrations = exports.getDenominationAssets = void 0;
const axios_1 = __importDefault(require("axios"));
const fund_1 = require("../utils/fund");
/**
 * It gives a list of all denomination assets
 * @param SUB_GRAPH_ENDPOINT Endpoint to where the subgraph is deployed to.
 * @returns
 */
const getDenominationAssets = async (SUB_GRAPH_ENDPOINT) => {
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query: `
            {
              assets(orderBy: symbol, orderDirection: asc, where: {type_in: [ETH, USD]}) {
               decimals
               curvePoolAssetDetails {
                 pool
                 gauge
                 gaugeToken {
                   id
                   decimals
                   symbol
                 }
                 invariantProxyAsset {
                   decimals
                   id
                   symbol
                 }
                 lpToken {
                   decimals
                   id
                   symbol
                 }
                 numberOfTokens
                 pool
                
                 token1 {
                   decimals
                   id
                   symbol
                 }
                 token2 {
                   decimals
                   id
                   symbol
                 }
                 
               }
               decimals
               derivativeType
               id
               name
               price {
                 price
                 timestamp
               }
               symbol
               type
               underlyingAsset {
                 id
                 decimals
                 name
                 symbol
               }
               uniswapV2PoolAssetDetails {
                 id
               }
             }
             }
            `,
        });
        return data.data.assets;
    }
    catch (error) {
        return error;
    }
};
exports.getDenominationAssets = getDenominationAssets;
/**endpointendpoint
 * Get all assets integrations
 * @param SUB_GRAPH_ENDPOINT Subgraph endpoint
 * @returns
 */
const getAllAssetsIntegrations = async (SUB_GRAPH_ENDPOINT) => {
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query: `
        {
          assets (orderBy: symbol, orderDirection: asc){
            id
            name
            decimals
            symbol
            price{
              price
            }
          }
        }`,
        });
        return data.data.assets;
    }
    catch (error) {
        return error;
    }
};
exports.getAllAssetsIntegrations = getAllAssetsIntegrations;
/**
 * Lists of all user created funds, that is where user is the manager
 * @param SUB_GRAPH_ENDPOINT Subgraph endpoint
 * @param accessor_address  User Address,
 * @returns List of Funds
 */
const getCurrentUserFunds = async (SUB_GRAPH_ENDPOINT, accessor_address) => {
    try {
        const query = `{
        funds(first: 5, where: {manager: "${accessor_address}"}){
             id 
             name
             manager 
             shares {
              totalSupply
            }
             accessor{
               id
               denominationAsset{
                 symbol
                 name 
                 price{
                   price
                 }
               }
             }
             portfolio {
              holdings {
                amount
                asset {
                  symbol
                  price {
                    price
                  }
                }
              }
            }
            investmentCount
            lastKnowGavInEth
            trackedAssets {
              name
              symbol
            }
             state{
               shares{
                 totalSupply
               }
             }
           }
       }`;
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.funds;
    }
    catch (error) {
        return error;
    }
};
exports.getCurrentUserFunds = getCurrentUserFunds;
/**
 * List all user transactions
 * @param SUB_GRAPH_ENDPOINT
 * @param walletAddress
 * @returns
 */
const listAllUserTransactions = async (SUB_GRAPH_ENDPOINT, walletAddress) => {
    //0xaed39f9013fe44deb694203d9d12ea4029edac49
    const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
        query: `{
      investments(where: {investor: "${walletAddress}"}){
      fund{
       id 
       name
        sharesChanges(orderBy: timestamp, orderDirection: desc) {
          shares
          timestamp
          investmentState{
            shares
          }
          fundState{
            id 
            portfolio{
              id
              holdings{
                id
                asset{
                  id
                  symbol
                  name
                }
                amount
                price{
                  price
                }
              }
            }  
          }
          ... on SharesBoughtEvent{
            id 
            investmentAmount
            asset{
              id
              name
              symbol
              price{
                price
              }
            }
            investor{
              id 
            }
            transaction{
              id
              from
              to 
            }
          }
          
          ...on SharesRedeemedEvent{
            id 
            investor{
              id
            }
            fund {
              id
              name
              accessor{
                id
                denominationAsset{
                  id 
                  name
                  symbol
                }
              }
            }
            
            payoutAssetAmounts{
              asset{
                id
                name
                symbol
                price{
                  price
                }
              }
              amount
              price{
                price
              }
            }
            transaction{
              id 
              from 
              to
            }
          }
        }
      } 
    }
    }`,
    });
    try {
        let investments = [];
        let transactions = [];
        const funds = data.data.investments.map((fItem) => fItem.fund);
        funds.forEach((fund) => {
            fund.sharesChanges
                .map((item) => {
                if (item.fund) {
                    // withdraw
                    const withdraw = {
                        shares: item.shares,
                        timestamp: parseInt(item.timestamp),
                        transaction_id: item.transaction.id,
                        to: item.transaction.to,
                        type: "WITHDRAW",
                        from: item.transaction.from,
                        amount: item.payoutAssetAmounts
                            ? item.payoutAssetAmounts[0].amount
                            : 0,
                        symbol: item.payoutAssetAmounts
                            ? item.payoutAssetAmounts[0].asset.symbol
                            : "",
                        price: item.payoutAssetAmounts
                            ? item.payoutAssetAmounts[0].asset.price.price
                            : "",
                        investor: item.investor.id,
                        fundName: item.fund.name,
                        fundId: item.fund.id,
                    };
                    transactions.push(withdraw);
                    return withdraw;
                }
                else if (item.asset && item.transaction) {
                    const invest = {
                        shares: item.shares,
                        timestamp: parseInt(item.timestamp),
                        transaction_id: item.transaction.id,
                        to: item.transaction.to,
                        type: "INVEST",
                        investmentShares: item.investmentState.shares,
                        from: item.transaction.from,
                        amount: item.investmentAmount,
                        symbol: item.asset.symbol,
                        price: item.asset.price.price,
                        investor: item.investor.id,
                        fundName: fund.name,
                        fundId: fund.id,
                    };
                    investments.push(invest);
                    transactions.push(invest);
                }
                return;
            })
                .filter((item) => item);
        });
        return { transactions, investments };
    }
    catch (error) {
        return error;
    }
};
exports.listAllUserTransactions = listAllUserTransactions;
/**
 * List all funds within the application
 * @param SUB_GRAPH_ENDPOINT
 * @returns
 */
const listAllFunds = async (SUB_GRAPH_ENDPOINT) => {
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query: `
              {
                  funds(orderBy: lastKnowGavInEth, orderDirection: desc) {
                    id
                    name
                    inception
                    shares {
                      totalSupply
                    }
                    accessor {
                      denominationAsset {
                        symbol
                      }
                    }
                    portfolio {
                      holdings {
                        amount
                        asset {
                          symbol
                          price {
                            price
                          }
                        }
                      }
                    }
                    investmentCount
                    lastKnowGavInEth
                    trackedAssets {
                      name
                      symbol
                    }
                  }
                }
          `,
        });
        return data.data.funds;
    }
    catch (error) {
        return error;
    }
};
exports.listAllFunds = listAllFunds;
/**
 *  Get a list all user vaults.
 * @param SUB_GRAPH_ENDPOINT  Subgraph link endpoint
 * @param user_address User address
 * @returns List of funds
 */
const walletAddressUserVaults = async (SUB_GRAPH_ENDPOINT, user_address) => {
    const query = `
    {
      funds(where: {manager: "${user_address}"}){
           id 
           name
           manager 
           shares {
            totalSupply
          }
           accessor{
             id
             denominationAsset{
               symbol
               name 
               price{
                 price
               }
             }
           }
           portfolio {
            holdings {
              amount
              asset {
                symbol
                price {
                  price
                }
              }
            }
          }
          investmentCount
          lastKnowGavInEth
          trackedAssets {
            name
            symbol
          }
           state{
             shares{
               totalSupply
             }
           }
         }
     }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.funds;
    }
    catch (error) {
        return error;
    }
};
exports.walletAddressUserVaults = walletAddressUserVaults;
/**
 * Get of all user investments on all funds, This one give a list of funds with their investments
 * @param SUB_GRAPH_ENDPOINT Subgraph link
 * @param address User address
 * @returns
 */
const getUserAddressInvestments = async (SUB_GRAPH_ENDPOINT, address) => {
    const query = `
    {
      accounts(where: {id: "${address}"}) {
       id
       investments {
         id
         fund {
           id
           shares {
             totalSupply
           }
           name
           portfolio {
             holdings {
               amount
               asset {
                 symbol
                 price {
                   price
                 }
               }
             }
           }
         }
         shares
       }
     }
     }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.accounts.length > 0
            ? data.data.accounts[0].investments
            : [];
    }
    catch (error) {
        return error;
    }
};
exports.getUserAddressInvestments = getUserAddressInvestments;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param fundId  Created fund address
 * @returns Minimum and maximum investment amount
 */
const minMaxDepositAmounts = async (SUB_GRAPH_ENDPOINT, fundId) => {
    const query = `{
      minMaxInvestmentFundSettingsSetEvents(first:1, where:{fund: "${fundId}"}) {
        id
        fund{
          id
          accessor{
            denominationAsset{
              id
              symbol
              name
            }
          }
        }
        minInvestmentAmount
        maxInvestmentAmount
      }
    }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        console.log(data.data);
        return data.data.minMaxInvestmentFundSettingsSetEvents.length
            ? data.data.minMaxInvestmentFundSettingsSetEvents[0]
            : { maxInvestmentAmount: "0.00", minInvestmentAmount: "0.00" };
    }
    catch (error) {
        return { maxInvestmentAmount: "0.00", minInvestmentAmount: "0.00" };
    }
};
exports.minMaxDepositAmounts = minMaxDepositAmounts;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param comptrollerId  Fund comptroller address
 * @returns Performance Fee
 */
const performanceFee = async (SUB_GRAPH_ENDPOINT, comptrollerId) => {
    const query = `
    {
      performanceFeeSettings(where:{comptroller: "${comptrollerId}"}){
       rate
       period
       comptroller{
         id
         fund{
           id
         }
       }
     }
     }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.performanceFeeSettings.length > 0
            ? {
                rate: data.data.performanceFeeSettings[0].rate,
                period: data.data.performanceFeeSettings[0].period,
            }
            : { rate: "0.00", period: "0.00" };
    }
    catch (error) {
        return { rate: "0.00", period: "0.00" };
    }
};
exports.performanceFee = performanceFee;
/**
 *
 * @param SUB_GRAPH_ENDPOINT Deployed subgraph http url
 * @param fundId Created fund address
 * @returns {rate: entrance rate}
 */
const entranceDirectBurnFees = async (SUB_GRAPH_ENDPOINT, fundId) => {
    const query = `
    {
      entranceRateBurnFeeSettledEvents(where:{fund: "${fundId}"}){
        fund{
          id 
        }
        sharesQuantity
      }
    }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.entranceRateBurnFeeSettledEvents.length > 0
            ? { rate: data.data.entranceRateBurnFeeSettledEvents[0].sharesQuantity }
            : { rate: "0.00" };
    }
    catch (error) {
        return { rate: "0.00" };
    }
};
exports.entranceDirectBurnFees = entranceDirectBurnFees;
/**
 * Fund management fee set during creation.
 * @param SUB_GRAPH_ENDPOINT  Deployed subgraph http url
 * @param comptrollerId  Comptroller Address (id)
 */
const managementFee = async (SUB_GRAPH_ENDPOINT, comptrollerId) => {
    const query = `
    {
      managementFeeSettings(where:{comptroller: "${comptrollerId}"}){
        id
        comptroller{
          id
        }    
        scaledPerSecondRate
      }
    }`;
    try {
        const { data } = await axios_1.default.post(SUB_GRAPH_ENDPOINT, {
            query,
        });
        return data.data.managementFeeSettings.length > 0
            ? {
                scaledPerSecondRate: (0, fund_1.convertScaledPerSecondRateToRate)(data.data.managementFeeSettings[0].scaledPerSecondRate),
            }
            : { scaledPerSecondRate: "0.00" };
    }
    catch (error) {
        return { scaledPerSecondRate: "0.00" };
    }
};
exports.managementFee = managementFee;
