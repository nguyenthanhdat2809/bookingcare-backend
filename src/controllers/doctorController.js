import {
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailInforDoctor,
  getDetailDoctorService,
  bulkCreateScheduleService,
  getScheduleDoctorByDateService,
  getExtraInforDoctorByIdService,
  getProfileDoctorByIdService
} from "../services/doctorService";

const getTopDoctorHome = async (req, res) => {
  let { limit } = req.query;
  if (!limit) limit = 10;
  try {
    let response = await getTopDoctorHomeService(+limit);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!!",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    let doctors = await getAllDoctorsService();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log("This Error:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

const postInforDoctor = async (req, res) => {
  try {
    let response = await saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

const getDetailDoctor = async (req, res) => {
  try {
    let infor = await getDetailDoctorService(req.query.id);
    return res.status(200).json(infor);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

const bulkCreateSchedule = async (req, res) => {
  try {
    let response = await bulkCreateScheduleService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

const getScheduleDoctorByDate = async (req, res) => {
  try {
    let response = await getScheduleDoctorByDateService(req.query.doctorId, req.query.date);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

const getExtraInforDoctorById = async (req, res) => {
  try {
    let response = await getExtraInforDoctorByIdService(req.query.doctorId);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
}

const getProfileDoctorById = async (req, res) => {
  try {
    let response = await getProfileDoctorByIdService(req.query.doctorId);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInforDoctor,
  getDetailDoctor,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById
};
