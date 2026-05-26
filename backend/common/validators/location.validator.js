import { indianStates, stateCityMap, validatePincode } from "../data/locations.js";

export const validateLocation = (state, city, pincode) => {
    const errors = [];

    // Validate state
    if (!indianStates.includes(state)) {
        errors.push("Invalid state selected");
    }

    // Validate city for state
    const validCities = stateCityMap[state] || [];
    if (!validCities.includes(city)) {
        errors.push(`Invalid city for ${state}`);
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
        errors.push("Pincode must be 6 digits");
    }

    // Validate pincode range for state
    if (!validatePincode(pincode, state)) {
        errors.push(`Invalid pincode for ${state}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
