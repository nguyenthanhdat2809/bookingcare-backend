import express from "express";
import {
  getHomepage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  editCRUD,
  deleteCRUD,
} from "../controllers/homeController";

import {
  getTopDoctorHome,
  getAllDoctors,
  postInforDoctor,
  getDetailDoctor,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById
} from "../controllers/doctorController";

import {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
} from "../controllers/UserController";

import patientController from "../controllers/PatientController";
import specialtyController from "../controllers/specialtyController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", getHomepage);
  router.get("/crud", getCRUD);
  router.post("/crud-post", postCRUD);
  router.get("/crud-get", displayGetCRUD);
  router.get("/crud-edit", getEditCRUD);
  router.post("/crud-put", editCRUD);
  router.get("/delete-edit", deleteCRUD);

  // -----------------------------------------------------------------------

  router.post("/api/login", handleLogin);
  router.get("/api/get-all-users", handleGetAllUser);
  router.post("/api/create-new-user", handleCreateNewUser);
  router.put("/api/edit-user", handleEditUser);
  router.delete("/api/delete-user", handleDeleteUser);

  // ---------------------------API DOCTOR------------------------

  router.get("/api/allcode", getAllCode);
  router.get("/api/top-doctor-home", getTopDoctorHome);
  router.get("/api/all-doctors", getAllDoctors);
  router.post("/api/save-info-doctors", postInforDoctor);
  router.get("/api/get-detail-doctor", getDetailDoctor);
  router.post("/api/bulk-create-schedule", bulkCreateSchedule);
  router.get("/api/get-schedule-doctor-by-date", getScheduleDoctorByDate);
  router.get("/api/get-extra-infor-doctor-by-id", getExtraInforDoctorById);
  router.get("/api/get-profile-doctor-by-id", getProfileDoctorById);

  // ---------------------API PATIENT------------------------
  router.post("/api/patient-book-appointment", patientController.postBookAppointment);
  router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment);

  // ----------------------------------------------------------------------------
  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);

  return app.use("/", router);
};

module.exports = initWebRoutes;
