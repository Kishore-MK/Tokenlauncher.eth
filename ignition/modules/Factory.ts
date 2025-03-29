// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const FEE = ethers.parseUnits("5",18)

const FactoryModule = buildModule("FactoryModule", (m) => {

  const fee = m.getParameter("fee",FEE);
  const factory = m.contract("Factory",[fee]);

  return {factory};
});

export default FactoryModule;
