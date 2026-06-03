import { indianStates, stateCityMap, validatePincode } from "../data/locations.js";

export const validateLocation = (state, city, pincode) => {
    const errors = [];

    if (!indianStates.includes(state)) {
        errors.push("Invalid state selected");
    }

    const validCities = stateCityMap[state] || [];
    if (!validCities.includes(city)) {
        errors.push(`Invalid city for ${state}`);
    }

    if (!/^\d{6}$/.test(pincode)) {
        errors.push("Pincode must be 6 digits");
    }

    if (!validatePincode(pincode, state)) {
        errors.push(`Invalid pincode for ${state}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
