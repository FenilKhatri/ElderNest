import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as patientService from "./patient.service.js";

export const createPatient = asyncHandler(async (req, res) => {
    const patient = await patientService.createPatient(req.user.id, req.body);
    return successResponse(res, 201, "Patient profile created", { patient });
});

export const getMyPatients = asyncHandler(async (req, res) => {
    const patients = await patientService.getPatientsByUser(req.user.id);
    return successResponse(res, 200, "Patients fetched", { patients });
});

export const getPatient = asyncHandler(async (req, res) => {
    const patient = await patientService.getPatientById(req.params.id, req.user.id);
    return successResponse(res, 200, "Patient fetched", { patient });
});

export const updatePatient = asyncHandler(async (req, res) => {
    const patient = await patientService.updatePatient(req.params.id, req.user.id, req.body);
    return successResponse(res, 200, "Patient updated", { patient });
});

export const deletePatient = asyncHandler(async (req, res) => {
    await patientService.deletePatient(req.params.id, req.user.id);
    return successResponse(res, 200, "Patient removed");
});

export const getAllPatientsAdmin = asyncHandler(async (req, res) => {
    const patients = await patientService.getAllPatientsAdmin();
    return successResponse(res, 200, "Patients fetched", { patients });
});
