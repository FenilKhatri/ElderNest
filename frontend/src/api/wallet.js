import http from "../lib/axios";

export const getWalletSummary = async () => {
  return await http.get("/wallet");
};

export const getWalletTransactions = async (params) => {
  return await http.get("/wallet/transactions", { params });
};

export const payWithWallet = async (bookingData) => {
  return await http.post("/wallet/pay", bookingData);
};
