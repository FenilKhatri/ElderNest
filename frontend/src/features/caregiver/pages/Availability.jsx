import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { getMyProfile, updateAvailability } from "../api/caregiver.api";
import Button from "../../../components/ui/Button";
import GlobalLoader from "../../../components/ui/GlobalLoader";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultSchedule = () =>
  DAYS.map((day) => ({
    day,
    enabled: false,
    slots: [{ startTime: "09:00", endTime: "17:00" }],
  }));

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
            DAYS.map((day) => {
              const found = av.find((a) => a.day === day);
              return found
                ? { day, enabled: true, slots: found.slots?.length ? found.slots : [{ startTime: "09:00", endTime: "17:00" }] }
                : { day, enabled: false, slots: [{ startTime: "09:00", endTime: "17:00" }] };
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
    const availability = schedule
      .filter((d) => d.enabled)
      .map(({ day, slots }) => ({
        day,
        slots: slots.map(({ startTime, endTime }) => ({ startTime, endTime })),
      }));

    try {
      setSaving(true);
      await updateAvailability(availability);
      toast.success("Availability saved");
    } catch (err) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <GlobalLoader />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Weekly availability</h1>
          <p className="text-slate-600 dark:text-slate-400">Enable days and set time slots.</p>
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((row, dayIndex) => (
          <div
            key={row.day}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={() => toggleDay(dayIndex)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="font-semibold text-slate-900 dark:text-white">{row.day}</span>
            </label>

            {row.enabled && (
              <div className="space-y-3 pl-7">
                {row.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    {row.slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(dayIndex, slotIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSlot(dayIndex)}
                  className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add slot
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSave} loading={saving} className="mt-6">
        Save availability
      </Button>
    </div>
  );
};

export default Availability;
