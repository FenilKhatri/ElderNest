import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, Edit } from "lucide-react";
import { getMyProfile } from "../api/caregiver.api";
import Button from "../../../components/ui/Button";

const Services = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      setCaregiver(res.data?.caregiver);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My Services</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage the services you offer to families.</p>
        </div>
        <Link to="/caregiver/complete-profile">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Services
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 text-blue-500 mr-2" />
          Active Services
        </h3>
        {caregiver?.servicesOffered && caregiver.servicesOffered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {caregiver.servicesOffered.map((service, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white">{service.title || service.name || service}</h4>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't selected any services yet.</p>
            <Link to="/caregiver/complete-profile">
              <Button>Select Services</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;