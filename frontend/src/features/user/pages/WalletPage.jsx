import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, AlertCircle } from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { getWalletSummary, getWalletTransactions } from "../../../api/wallet";
import { formatCurrency, formatDate } from "../../../utils/helpers";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";

const WalletPage = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await getWalletSummary();
      setSummary(summaryRes.data.wallet);

      const txRes = await getWalletTransactions({ page: 1, limit: 10 });
      setTransactions(txRes.data.transactions);
      setHasMore(txRes.data.pagination.hasMore);
      setPage(2);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const txRes = await getWalletTransactions({ page, limit: 10 });
      setTransactions([...transactions, ...txRes.data.transactions]);
      setHasMore(txRes.data.pagination.hasMore);
      setPage(page + 1);
    } catch (error) {
      console.error("Failed to load more transactions", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <UserPageLayout title="Wallet" description="Manage your wallet balance and view history">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout title="Wallet" description="Manage your wallet balance and view history">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        
        {/* Summary Card */}
        <motion.div variants={fadeUp} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-blue-100 font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold">{formatCurrency(summary?.balance || 0)}</h2>
          </div>
          
          <div className="flex gap-6">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Refunded</p>
              <p className="text-xl font-semibold">{formatCurrency(summary?.totalRefunded || 0)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Transactions</p>
              <p className="text-xl font-semibold">{summary?.totalTransactions || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Transaction History</h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No transactions found.</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-full ${
                      tx.transactionType === 'Refund Credit' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tx.transactionType === 'Refund Credit' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{tx.transactionType}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(tx.createdAt)}</p>
                      
                      {tx.booking && (
                        <p className="text-xs text-slate-500 mt-1">
                          Booking ID: <span className="font-mono">{tx.booking.bookingId || tx.booking}</span>
                        </p>
                      )}
                      
                      {tx.refundReason && (
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                          <span className="font-semibold">Reason:</span> {tx.refundReason}
                        </div>
                      )}
                      {tx.adminComment && (
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-l-2 border-blue-500">
                          <span className="font-semibold">Admin Note:</span> {tx.adminComment}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-lg font-bold ${
                      tx.transactionType === 'Refund Credit' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.transactionType === 'Refund Credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      tx.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {hasMore && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </UserPageLayout>
  );
};

export default WalletPage;
