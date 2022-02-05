import Web3 from "web3";

const web3 = new Web3("http://127.0.0.1:8545");

const myAccount = "0xf83F4c3A25b8FEE1722d76e5F72AaFcA00845011";
const ethBorrowAccount = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

const start = async () => {
  web3.eth.sendTransaction(
    {
      from: ethBorrowAccount,
      to: myAccount,
      value: web3.utils.toWei("100", "ether"),
    },
    (err, hash) => {
      console.log(hash);
    }
  );
};

start()
  .then(() => {
    console.log("Successfully Got some 100 ETH");
  })
  .catch((err) => {
    console.log(err);
  });
