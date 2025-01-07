import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: 'sepolia',
  networks:{
    sepolia:{
      url: "https://eth-sepolia.g.alchemy.com/v2/SwT6ndMmsPMDZLi_2BvPcCf8iimWyKlt",
      accounts: ['224725802d65246f8a9e35437ef3c948706ad8adf9d6d07a88ed69acedc6c4a1']
    }
  }
};

export default config;