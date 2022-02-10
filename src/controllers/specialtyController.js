import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
  try {
    let response = await specialtyService.createSpecialtyService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let response = await specialtyService.getAllSpecialtyService();
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
}

let getDetailSpecialtyById = async (req, res) => {
  try {
    let response = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
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
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById
};
