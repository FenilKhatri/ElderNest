import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";

const Documents = () => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage your verification documents and certifications.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Identity Verification</h3>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Government issued ID card or Passport
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Certifications</h3>
                <span className="flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  Action Needed
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Upload your nursing or caregiving certifications
              </p>
              <Button className="mt-3">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Documents;
