import Patient from "./patient.model.js";

export const createPatient = async (userId, data) => {
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
    const filter = { _id: patientId };
    if (userId) filter.userId = userId;
    
    const patient = await Patient.findOneAndUpdate(
        filter,
        data,
        { new: true, runValidators: true }
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
        { new: true }
    );
    if (!patient) {
        throw new Error("Patient not found");
    }
    return patient;
};

export const getAllPatientsAdmin = async () => {
    return Patient.find({ isActive: true })
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 });
};
