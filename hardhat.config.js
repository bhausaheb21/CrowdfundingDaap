require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers"); // Add this line

require("dotenv").config({path :'./.env.local'})

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address); // Add .address to display addresses
  }
});

const privatekey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon :{
      url : process.env.NEXT_PUBLIC_RPC_URL,
      accounts : [privatekey] 
    }
  },
};
