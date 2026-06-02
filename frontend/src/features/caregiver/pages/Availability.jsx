import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Plus, Trash2, Clock, Check } from "lucide-react";
import { getMyProfile, updateAvailability } from "../api/caregiver.api";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { DAYS_OF_WEEK } from "../../../constants/caregiverConstants";
import { CARE_TYPES } from "../../../constants/bookingConstants";

const defaultSchedule = () =>
  DAYS_OF_WEEK.map((day) => ({
    day,
    enabled: false,
    careTypes: [],
    slots: [{ startTime: "09:00", endTime: "17:00" }],
  }));

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState(defaultSchedule());

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const av = res?.data?.caregiver?.availability || [];
        if (av.length) {
          setSchedule(
            DAYS_OF_WEEK.map((day) => {
              const found = av.find((a) => a.day === day);
              return found
                ? { day, enabled: true, careTypes: found.careTypes || [], slots: found.slots?.length ? found.slots : [{ startTime: "09:00", endTime: "17:00" }] }
                : { day, enabled: false, careTypes: [], slots: [{ startTime: "09:00", endTime: "17:00" }] };
            })
          );
        }
      })
      .catch(() => toast.error("Failed to load availability"))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (index) => {
    setSchedule((s) =>
      s.map((row, i) => (i === index ? { ...row, enabled: !row.enabled } : row))
    );
  };

  const toggleCareType = (dayIndex, value) => {
    setSchedule((s) =>
      s.map((row, i) => {
        if (i !== dayIndex) return row;
        const hasType = row.careTypes.includes(value);
        return {
          ...row,
          careTypes: hasType
            ? row.careTypes.filter((c) => c !== value)
            : [...row.careTypes, value],
        };
      })
    );
  };

  const updateSlot = (dayIndex, slotIndex, field, value) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? {
              ...row,
              slots: row.slots.map((slot, si) =>
                si === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : row
      )
    );
  };

  const addSlot = (dayIndex) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? { ...row, slots: [...row.slots, { startTime: "09:00", endTime: "12:00" }] }
          : row
      )
    );
  };

  const removeSlot = (dayIndex, slotIndex) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? { ...row, slots: row.slots.filter((_, si) => si !== slotIndex) }
          : row
      )
    );
  };

  const handleSave = async () => {
    const activeDays = schedule.filter((d) => d.enabled);
    const missingCareTypes = activeDays.some((d) => d.careTypes.length === 0);
    if (missingCareTypes) {
      toast.error("Please select at least one care type for each enabled day.");
      return;
    }

    const availability = activeDays.map(({ day, careTypes, slots }) => ({
      day,
      careTypes,
      slots: slots.map(({ startTime, endTime }) => ({ startTime, endTime })),
    }));

    try {
      setSaving(true);
      await updateAvailability(availability);
      toast.success("Availability saved successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-8"></div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4"></div>)}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header section matching mockup */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
          <span>Home</span>
          <span className="text-slate-300">/</span>
          <span>Schedule</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 dark:text-blue-400">Availability Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Availability Management</h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Manage your working hours and availability. Set your weekly schedule to receive booking requests during these times.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm min-w-[120px]"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Schedule Settings</h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Select days and set active working hours.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {schedule.map((row, dayIndex) => (
              <div
                key={row.day}
                className={`rounded-xl border transition-colors duration-200 ${
                  row.enabled 
                    ? "border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10" 
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827]"
                }`}
              >
                {/* Day Header */}
                <div 
                  className={`flex items-center justify-between p-4 ${row.enabled ? 'border-b border-blue-100 dark:border-blue-900/30' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <Switch checked={row.enabled} onChange={() => toggleDay(dayIndex)} />
                    <span className={`font-semibold ${row.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {row.day}
                    </span>
                  </div>
                  {row.enabled && (
                    <span className="text-[11px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md">
                      Active
                    </span>
                  )}
                </div>

                {/* Day Settings (Expanded) */}
                {row.enabled && (
                  <div className="p-5 space-y-6">
                    
                    {/* Care Types Selection */}
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3">Supported Care Types *</p>
                      <div className="flex flex-wrap gap-2">
                        {CARE_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => toggleCareType(dayIndex, type.value)}
                            className={`px-4 py-2 text-[13px] font-medium rounded-lg border transition-all duration-200 ${
                              row.careTypes.includes(type.value)
                                ? "bg-blue-100/50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3">Time Slots *</p>
                      <div className="space-y-3">
                        {row.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                                className="pl-3 pr-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[14px] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                              />
                            </div>
                            <span className="text-slate-400 text-sm">to</span>
                            <div className="relative">
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                                className="pl-3 pr-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[14px] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                              />
                            </div>
                            {row.slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(dayIndex, slotIndex)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSlot(dayIndex)}
                          className="mt-2 text-[13px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline"
                        >
                          <Plus className="w-4 h-4" /> Add time slot
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
    </motion.div>
  );
};

export default Availability;
