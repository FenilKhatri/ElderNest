import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Star, MessageSquare } from "lucide-react";
import http from "../../../lib/axios";
import { getMyProfile } from "../api/caregiver.api";
import { formatDate } from "../../../utils/helpers";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const caregiverId = profileRes?.data?.caregiver?._id;
      
      if (caregiverId) {
        // Assume API is /reviews/caregiver/:id
        const res = await http.get(`/reviews/caregiver/${caregiverId}`);
        setReviews(res.data?.reviews || []);
      }
    } catch (error) {
      // If API fails or doesn't exist yet, we just show empty
      console.log("Reviews API not ready or failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My Reviews</h2>
        <p className="text-slate-500 dark:text-slate-400">See what families are saying about your care.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-32" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No reviews yet</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Once you complete bookings, families will be able to leave reviews for you here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                    {review.userId?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{review.userId?.name || "User"}</h4>
                    <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-400">{review.rating}</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;