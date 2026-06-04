import { WEEK_DAYS } from "../options/serviceOptions";

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

