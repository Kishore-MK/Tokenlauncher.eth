import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  solidity: "0.8.27",
  networks:{
    sepolia:{
      chainId: 11155111,
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
