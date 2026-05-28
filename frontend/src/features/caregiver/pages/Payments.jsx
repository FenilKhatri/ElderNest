import React from "react";
import { CreditCard } from "lucide-react";

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Payments & Earnings</h2>
        <p className="text-slate-500 dark:text-slate-400">Track your earnings and payout history.</p>
      </div>

      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Coming Soon</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We are currently integrating a secure payment gateway. Soon you'll be able to track all your earnings and receive direct payouts to your bank account here.
        </p>
      </div>
    </div>
  );
};

export default Payments;