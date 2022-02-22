import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    let response = await clinicService.createClinicService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("This Error:", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};

module.exports = {
  createClinic
}