"use client";

import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

interface formDataProps {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
}
export interface TransactionContextType {
  formData: formDataProps;
  currentAccount: string;
  isLoading: boolean;
  transactionCount: number;
  transactions: transactionsProps[] | undefined;
  sendTransaction: () => void;
  connectWallet: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

interface transactionsProps {
  addressTo: string;
  addressFrom: string;
  timestamp: Date;
  message: string;
  keyword: string;
  amount: number;
}

export const TransactionContext = createContext<TransactionContextType>(
  {} as TransactionContextType
);

const { ethereum } = window;

const createEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setformData] = useState<formDataProps>({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount") == null ? 0 : parseInt(localStorage.getItem("transactionCount")!));
  const [transactions, setTransactions] = useState<transactionsProps[] | undefined>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction: {
            receiver: string;
            sender: string;
            message: string;
            keyword: string;
            timestamp: bigint;
            amount: bigint;
          }) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              parseInt(transaction.timestamp.toString()) * 1000
            ),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount.toString()) / 10 ** 18,
          })
        );
        console.log(structuredTransactions)
        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
      console.log(transactionCount)
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x76c0", // 30400
              value: `0x${parsedAmount.toString(16)}`, // Convert bigint to hexadecimal
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount:bigint =
          await transactionsContract.getTransactionCount();



        setTransactionCount(parseInt(transactionsCount.toString()));
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        isLoading,
        transactions,
        transactionCount
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
