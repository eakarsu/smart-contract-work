# Enzyme And Aave Fork

## Table of Contents
- [Enzyme And Aave Fork](#enzyme-and-aave-fork)
  - [Table of Contents](#table-of-contents)
    - [Introduction](#introduction)
    - [Features](#features)
    - [Installation](#installation)
    - [Usage Example](#usage-example)
      - [Test Subgraph](#test-subgraph)
      - [CONSTANTS](#constants)
      - [Platform Assets](#platform-assets)
      - [All Assets](#all-assets)
      - [Create Fund/Vault](#create-fundvault)
        - [Fund Investments & Redeemption of Shares](#fund-investments--redeemption-of-shares)
      - [Aave Integrations](#aave-integrations)
        - [Deposit Collateral](#deposit-collateral)
        - [Borrow Assets](#borrow-assets)
      - [Funds](#funds)
      - [List Platform Funds](#list-platform-funds)
      - [User Vaults/Funds](#user-vaultsfunds)
      - [List User Investments](#list-user-investments)
      - [Fund Fees](#fund-fees)
    - [Contract Redeployment](#contract-redeployment)
      - [Reployment Process](#reployment-process)
    - [Contributing](#contributing)
    - [Acknowledgments](#acknowledgments)
    - [License](#license)


### Introduction

Enzyme fork-based library for integrating with your javascript runtime application, for instance Reactjs and your javascript/typescript app. The library suports type defination.

The library allows user to have fund features of enzyme finance within his Dapp. It only requires you to deploy a set of new enzyme.finance smart contracts.

It also allows users to deposit collateral to aave and borrow any asset using deposited collateral.

### Features
- Creation of a new vault/fund with Fees and Policy configurations
- Deposit Collateral to aave protocol.
- Borrow any asset from aave protocol using deposited asset.
- Invest to already created fund. (Optional using the borrowed asset)
- Withdrawal/Claim your assets from a fund/Vault.
- List user created funds 
- List each fund's investments and transactions
- List authorized user funds, investment, and transactions.


### Installation

Using npm
```bash
$ npm install @devngeni/protocol
```

using yarn 
```bash
$ yarn add @devngeni/protocol
```

### Usage Example
Here we will go through the above named feature, and see how it is implemented. We will define a number of constants to use within this example. 

> N.B: Please change(dynamically evalute) them.


#### Test Subgraph

Queries (HTTP):     https://api.thegraph.com/subgraphs/name/trust0212/radar-graph
Subscriptions (WS): wss://api.thegraph.com/subgraphs/name/trust0212/radar-graph.



#### CONSTANTS

```javascript
import { ethers } from "ethers";

// provider & Signer
const HTTP_URL = "<infura-http-url>"
const PRIVATE_KEY = "Your-private-ke"

const PROVIDER = new ethers.providers.JsonRpcProvider(HTTP_URL);

const SIGNER = new ethers.Wallet(configs.PRIVATE_KEY, PROVIDER);

// Subgraph
const SUB_GRAPH_ENDPOINT_LINK = " https://api.thegraph.com/subgraphs/name/trust0212/radar-graph"

// AAVE Usage
const LP_ADDRESS_PROVIDER_ADDRESS =""; // kovan lendingPoolProviderAddress
const BORROW_ASSET = ""; //kovan DAI address
const DEPOSIT_ASSET = ""; // kovan WETH address

```


#### Platform Assets

This will give a list all the assets found in the enzyme fork. This includes blocked and whitelisted assets. Further you can be able to filter from your user interface.

```typescript
const denominationAssets  =  await getDenominationAssets("SUB_GRAPH_ENDPOINT_LINK");
```

#### All Assets 

This list can help you handle different policies. Please you this list incase you want to blacklist or whitelist asset.

```typescript
const assets  = await getAllAssetsIntegrations("SUB_GRAPH_ENDPOINT_LINK");
```


#### Create Fund/Vault


To create you need to prepare a few fields, this can be picked from your front-end or nodejs application.

```javascript
import {createNewFund}  from "@devngeni/protocol"

 const DENOMINATION_ASSET = "0xd0a1e359811322d97991e03f863a0c30c2cf029c"; // Kovan Wrapped Ether(WETH)

 // params

// Fee Configurations
  let feeConfigs = {
    entranceFee: "2",
    managementFee: "1",
    performanceFee: "5",
  };

  // Policy Configurations

  let policyConfig = {
    deposit: {
      minimum: "0",
      maximum: "5",
    },
    asset: {
      whiteList: [],
      blackList: [],
    },
    adpater: {
      whiteList: [],
      blackList: [],
    },
  };
 // Creating the actual fund

 try {
    const fund = await createNewFund(
      SIGNER,
      "POLICY CONFIGURATION 27/01/2022",
      DENOMINATION_ASSET,
      10000,
      "10000000",
      PROVIDER,
      feeConfigs,
      policyConfig
    );

      console.log(fund);
  }catch(err) {
    console.log(err)
  }

```
##### Fund Investments & Redeemption of Shares
```typescript
/**
 * Fund Investments & Withdrawal
 */

/**
 * Allow users to withdrawal/redeem all shares
 * @param fundAddress Created Fund Address
 * @param provider  ethers.provider.JsonRpcProvider
 */
export const investingAndRedeemingOrWithdrawalOfShares = async (
  fundAddress: string
) => {
  // Approve before investing
  const approve = await approveBeforeInvesting(fundAddress, PROVIDER, 1000);
  console.log("Approving: ", approve);
  // Invest to a fund
  const investing = await invest(fundAddress, PROVIDER, SIGNER, 1000);
  console.log("Investing: ", investing);
  // Redeem shares
  const redeem = await redeemAllShares(fundAddress, PROVIDER);
  console.log("Redeeming: ", redeem);
};
```

#### Aave Integrations

This enables user to be able to deposit collateral asset, and borrow any asset using the collateral.

##### Deposit Collateral

To Deposit collateral assets we use the `deposit(lendingPoolAddressesProvider, provider, signer, amount, asset_to_borrow)` method of `aaveProvider` named import. 

- `lendingPoolAddressesProvider` - lendingPoolAddressesProvider address. Refer  to [lendingPoolAddressesProvider](https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts)
- `provider` - ethers library ```ethers.provider.JsonRpcProvider``` instance.
- `signer` - wallet signer for instance ```ethers.Wallet```
- `amount` - amount of collateral to deposit
- `asset_to_deposit`  - address of the asset to deposit.

```javascript
// Example
import {aaveProvider,borrow}  from "@devngeni/protocol"

export const aaveBorrowAsset = async () => {
  return await deposit(
    LP_ADDRESS_PROVIDER_ADDRESS,
    PROVIDER,
    SIGNER,
    1,
    BORROW_ASSET
  );
};
```


##### Borrow Assets

To borrow assets we use the `borrow(lendingPoolAddressesProvider, provider, signer, amount, asset_to_borrow)` method of `aaveProvider` named import. 

- `lendingPoolAddressesProvider` - lendingPoolAddressesProvider address. Refer  to [lendingPoolAddressesProvider](https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts)
- `provider` - ethers library ```ethers.provider.JsonRpcProvider``` instance.
- `signer` - wallet signer for instance ```ethers.Wallet```
- `amount` - amount of collateral to borrow
- `asset_to_borrow`  - address of the asset to borrow.


```javascript
// Example
import {aaveProvider,deposit}  from "@devngeni/protocol"


export const aaveBorrowAsset = async () => {
  return await deposit(
    LP_ADDRESS_PROVIDER_ADDRESS,
    PROVIDER,
    SIGNER,
    100, // amount of assets to borrow
    BORROW_ASSET
  );
};
```




#### Funds 

#### List Platform Funds

This will help you to get all funds within the system. You will have to do some pagination on the front-end

```typescript
import {listAllFunds} from "@devngeni/protocol"
const funds  =  await listAllFunds("SUB_GRAPH_ENDPOINT_LINK");
```

#### User Vaults/Funds

```typescript
import {
  walletAddressUserVaults} from "@devngeni/protocol"
const userFunds  = await walletAddressUserVaults("SUB_GRAPH_ENDPOINT_LINK");
```

#### List User Investments

```typescript
import {getUserAddressInvestments} from "@devngeni/protocol"

const investments  = await getUserAddressInvestments("SUB_GRAPH_ENDPOINT_LINK");
```


#### Fund Fees

Use this fees methods to give you the actual values to deplay to your users about each fees.

```typescript
import { performanceFee, managementFee, entranceDirectBurnFees}  from "@devngeni/protocol"
/**
 * Fund  management Fees provided during fund creation
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
export const fundManagementFee = async (comptrollerId: string) => {
  return await managementFee(configs.SUB_GRAPH_ENDPOINT, comptrollerId);
};


/**
 * Fund Performance Fees provided during creatiion
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
 export const fundPerformanceFee = async (comptrollerId: string) => {
  return await performanceFee(configs.SUB_GRAPH_ENDPOINT, comptrollerId);
};


/**
 * Fund Entrance Direct Fees  provided during the creation of the  fund
 * @param comptrollerId Fund ComptrollerId - address assigned to fund comptroller
 * @returns
 */
 export const fundEntranceDirectBurnFees = async (fundAddress: string) => {
  return await entranceDirectBurnFees(configs.SUB_GRAPH_ENDPOINT, fundAddress);
};

```



### Contract Redeployment

Given the Application Bytecode Interface (ABI)  provided in this library if for test deployed in [kovan testnest](https://kovan-testnet.github.io/website/). Your can be able to deploy a set of new contracts.

You can find here the repo to all of the smart contracts.

> NB: The developer will be required to have an understanding of [solidity](https://docs.soliditylang.org/en/v0.8.11/),  [hardhat](https://hardhat.org/),  hardhat deployment, and  debugging skills

#### Reployment Process

> Please follow documentation in the smart contract repo.


### Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/devNgeni/erol-enzyme-aave-fork-protocol/issues).


### Acknowledgments

-  [nGeni](https://ngeni.io)
-  Founder & CEO of nGeni (Jo3l)
-  Project Team
  
### License

> Permission is hereby granted, free of charge, to any person obtaining a copy of this `Enzyme And Aave Fork` and associated documentation files, to deal in the `Enzyme And Aave Fork` without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the `Enzyme And Aave Fork`, and to permit persons to whom the `Enzyme And Aave Fork` is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the `Enzyme And Aave Fork`.

> THE `Enzyme And Aave Fork` IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE `Enzyme And Aave Fork` OR THE USE OR OTHER DEALINGS IN THE `Enzyme And Aave Fork`.