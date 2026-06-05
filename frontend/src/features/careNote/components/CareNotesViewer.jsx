import React, { useState, useEffect } from "react";
import { FileText, Calendar, Activity, Pill, Stethoscope, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import { getBookingCareNotes } from "../api/careNote.api";
import { formatDateTime, getApiErrorMessage } from "../../../utils/helpers";
import EmptyState from "../../../components/ui/EmptyState";

const CareNotesViewer = ({ bookingId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        const res = await getBookingCareNotes(bookingId);
        // Sort descending so newest is first
        const fetchedNotes = (res?.data?.careNotes || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotes(fetchedNotes);
        
        // Expand the most recent note by default if exists
        if (fetchedNotes.length > 0) {
          setExpanded({ [fetchedNotes[0]._id]: true });
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [bookingId]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return null; // Don't show anything if no care notes exist yet
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" /> Care Notes & Updates
      </h2>
      
      <div className="space-y-4">
        {notes.map((note) => {
          const isExpanded = !!expanded[note._id];
          return (
            <div 
              key={note._id} 
              className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50 shadow-sm' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80'}`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(note._id)}
              >
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{note.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDateTime(note.createdAt)}
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-4 text-slate-700 dark:text-slate-300">
                    {note.content}
                  </div>
                  
                  {(note.vitals || note.medications || note.followUp) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {note.vitals && (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 mb-1 uppercase tracking-wider">
                            <Activity className="w-3.5 h-3.5" /> Vitals
                          </span>
                          <p className="text-sm text-slate-800 dark:text-slate-200">{note.vitals}</p>
                        </div>
                      )}
                      
                      {note.medications && (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-1 uppercase tracking-wider">
                            <Pill className="w-3.5 h-3.5" /> Medications
                          </span>
                          <p className="text-sm text-slate-800 dark:text-slate-200">{note.medications}</p>
                        </div>
                      )}
                      
                      {note.followUp && (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 md:col-span-2">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 mb-1 uppercase tracking-wider">
                            <Stethoscope className="w-3.5 h-3.5" /> Follow Up
                          </span>
                          <p className="text-sm text-slate-800 dark:text-slate-200">{note.followUp}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareNotesViewer;
