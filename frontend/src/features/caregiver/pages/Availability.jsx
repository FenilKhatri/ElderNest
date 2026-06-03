import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Clock, Plus, Trash2, Check, Info } from "lucide-react";
import Select from "../../../components/ui/Select";
import { getMyAvailability, updateAvailability } from "../api/caregiver.api";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { DEFAULT_SLOT_DURATION } from "@/constants";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const Switch = ({ checked, onChange }) => (
  <Button
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
  </Button>
);

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State: schedule[dayIndex] = { dayOfWeek, enabled, blocks: [...] }
  const [schedule, setSchedule] = useState(() => 
    DAYS_OF_WEEK.map((_, i) => ({
      dayOfWeek: i,
      enabled: false,
      blocks: [{ startTime: "09:00", endTime: "17:00", slotDuration: DEFAULT_SLOT_DURATION }],
    }))
  );

  useEffect(() => {
    getMyAvailability()
      .then((res) => {
        const blocks = res?.data?.blocks || [];
        if (blocks.length > 0) {
          setSchedule((prev) => 
            prev.map((dayState, dayIndex) => {
              const dayBlocks = blocks.filter(b => b.dayOfWeek === dayIndex);
              if (dayBlocks.length > 0) {
                return {
                  ...dayState,
                  enabled: true,
                  blocks: dayBlocks.map(b => ({
                    startTime: b.startTime,
                    endTime: b.endTime,
                    slotDuration: b.slotDuration,
                  }))
                };
              }
              return dayState;
            })
          );
        }
      })
      .catch(() => toast.error("Failed to load availability"))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (dayIndex) => {
    setSchedule((s) =>
      s.map((row, i) => (i === dayIndex ? { ...row, enabled: !row.enabled } : row))
    );
  };

  const updateBlock = (dayIndex, blockIndex, field, value) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? {
              ...row,
              blocks: row.blocks.map((block, bi) =>
                bi === blockIndex ? { ...block, [field]: value } : block
              ),
            }
          : row
      )
    );
  };

  const addBlock = (dayIndex) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? { ...row, blocks: [...row.blocks, { startTime: "09:00", endTime: "17:00", slotDuration: DEFAULT_SLOT_DURATION }] }
          : row
      )
    );
  };

  const removeBlock = (dayIndex, blockIndex) => {
    setSchedule((s) =>
      s.map((row, i) =>
        i === dayIndex
          ? { ...row, blocks: row.blocks.filter((_, bi) => bi !== blockIndex) }
          : row
      )
    );
  };

  const handleSave = async () => {
    const flatBlocks = [];
    for (const day of schedule) {
      if (day.enabled) {
        for (const b of day.blocks) {
          flatBlocks.push({
            dayOfWeek: day.dayOfWeek,
            startTime: b.startTime,
            endTime: b.endTime,
            slotDuration: Number(b.slotDuration)
          });
        }
      }
    }

    try {
      setSaving(true);
      await updateAvailability(flatBlocks);
      toast.success("Availability schedule saved successfully.");
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
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
              Set your weekly schedule and slot durations. Patients will book you based on these slots.
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start sm:items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mt-1 sm:mt-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Schedule Settings</h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Configure your active working days and time blocks.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {schedule.map((row, dayIndex) => (
              <div
                key={row.dayOfWeek}
                className={`rounded-xl border transition-colors duration-200 ${
                  row.enabled 
                    ? "border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10" 
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827]"
                }`}
              >
                {/* Day Header */}
                <div className={`flex items-center justify-between p-4 ${row.enabled ? 'border-b border-blue-100 dark:border-blue-900/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <Switch checked={row.enabled} onChange={() => toggleDay(dayIndex)} />
                    <span className={`font-semibold ${row.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {DAYS_OF_WEEK[row.dayOfWeek]}
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
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3">Time Blocks & Slot Duration</p>
                      
                      <div className="space-y-4">
                        {row.blocks.map((block, blockIndex) => (
                          <div key={blockIndex} className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex-1 min-w-[140px]">
                              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">Start Time</label>
                              <Input
                                type="time"
                                value={block.startTime}
                                onChange={(e) => updateBlock(dayIndex, blockIndex, "startTime", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[14px] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">End Time</label>
                              <Input
                                type="time"
                                value={block.endTime}
                                onChange={(e) => updateBlock(dayIndex, blockIndex, "endTime", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[14px] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">Slot Duration (Mins)</label>
                              <Select
                                value={block.slotDuration}
                                onChange={(e) => updateBlock(dayIndex, blockIndex, "slotDuration", Number(e.target.value))}
                                options={[
                                  { value: 30, label: "30 mins" },
                                  { value: 60, label: "60 mins (1 hr)" },
                                  { value: 120, label: "120 mins (2 hrs)" },
                                  { value: 240, label: "240 mins (4 hrs)" },
                                  { value: 480, label: "480 mins (8 hrs)" },
                                ]}
                              />
                            </div>

                            {row.blocks.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeBlock(dayIndex, blockIndex)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                aria-label="Remove block"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        onClick={() => addBlock(dayIndex)}
                        className="mt-4 text-[13px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Add another block
                      </Button>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[13px] text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">How slot generation works:</strong>
              Your selected "Time Block" is automatically divided into bookable slots based on the "Slot Duration". 
              For example, a block from 09:00 to 13:00 with a 60-minute duration will generate 4 distinct bookable slots for patients.
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default Availability;
