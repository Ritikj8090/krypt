import { BrowserProvider } from "ethers/types/providers";

declare global {
  interface Window {
    ethereum: BrowserProvider;
  }
}