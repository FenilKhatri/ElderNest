import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowNewRegistrations: {
      type: Boolean,
      default: true,
    },
    siteName: {
      type: String,
      default: "ElderNest",
    },
    platformFeePercentage: {
      type: Number,
      default: 10,
    },
    contactEmail: {
      type: String,
      default: "fenilkatri931@gmail.com",
    },
    contactPhone: {
      type: String,
      default: "+1-800-ELDER",
    }
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
