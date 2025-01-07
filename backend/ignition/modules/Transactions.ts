// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const TransactionsModule = buildModule("TransactionsModule", (m) => {

  const transactions = m.contract("Transactions");

  return { transactions };
});

export default TransactionsModule;
