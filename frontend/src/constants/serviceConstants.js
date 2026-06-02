export const SERVICE_CATEGORIES = [
  { value: "personal-care", label: "Personal Care" },
  { value: "medical-care", label: "Medical Care" },
  { value: "companionship", label: "Companionship" },
  { value: "household-help", label: "Household Help" },
  { value: "specialized-care", label: "Specialized Care" },
  { value: "emergency-care", label: "Emergency Care" },
];

export const SERVICE_MODES = [
  { value: "home-visit", label: "Home Visit" },
  { value: "online", label: "Online" },
  { value: "both", label: "Both" },
];

export const WEEK_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export const defaultAvailability = () =>
  WEEK_DAYS.reduce((acc, { key }) => ({ ...acc, [key]: true }), {});

export const emptyServiceForm = () => ({
  title: "",
  category: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  image: "",
  images: [],
  duration: 1,
  price: 0,
  serviceMode: "home-visit",
  features: [],
  benefits: [],
  caregivers: [],
  isFeatured: false,
  isActive: true,
  isDraft: false,
  isPopular: false,
  isRecommended: false,
});
