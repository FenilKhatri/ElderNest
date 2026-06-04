import Patient from "./patient.model.js";
import { validateLocation } from "../../common/validators/location.validator.js";

export const createPatient = async (userId, data) => {
    if (data.status === "published" && data.address) {
        const { state, city, pincode } = data.address;
        const locationValidation = validateLocation(state, city, pincode);
        if (!locationValidation.isValid) {
            throw new Error(locationValidation.errors.join(", "));
        }
    }
    return Patient.create({ ...data, userId });
};

export const getPatientsByUser = async (userId) => {
    return Patient.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

export const getPatientById = async (patientId, userId) => {
    const patient = await Patient.findOne({ _id: patientId, userId });
    if (!patient) {
        throw new Error("Patient not found");
    }
    return patient;
};

export const updatePatient = async (patientId, userId, data) => {
    if (data.status === "published" && data.address) {
        const { state, city, pincode } = data.address;
        const locationValidation = validateLocation(state, city, pincode);
        if (!locationValidation.isValid) {
            throw new Error(locationValidation.errors.join(", "));
        }
    }
    
    const filter = { _id: patientId };
    if (userId) filter.userId = userId;
    
    const patient = await Patient.findOneAndUpdate(
        filter,
        data,
        { returnDocument: 'after', runValidators: true }
    );
    if (!patient) {
        throw new Error("Patient not found");
    }
    return patient;
};

export const deletePatient = async (patientId, userId) => {
    const filter = { _id: patientId };
    if (userId) filter.userId = userId;

    const patient = await Patient.findOneAndUpdate(
        filter,
        { isActive: false },
        { returnDocument: 'after' }
    );
    if (!patient) {
        throw new Error("Patient not found");
    }
    return patient;
};

export const getAllPatientsAdmin = async (filters = {}) => {
    const { page = 1, limit = 50 } = filters;
    const query = { isActive: true };

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [patients, total] = await Promise.all([
        Patient.find(query)
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit),
        Patient.countDocuments(query)
    ]);

    const hasMore = total > skip + patients.length;
    return { patients, pagination: { total, page: parsedPage, limit: parsedLimit, hasMore } };
};
