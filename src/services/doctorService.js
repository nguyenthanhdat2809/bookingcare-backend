import _ from "lodash";
import db from "../models/index";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

export const getTopDoctorHomeService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueVi", "valueEn"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueVi", "valueEn"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllDoctorsService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let checkRequireFields = (inputData) => {
  let arr = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];

  let isValid = true;
  let element = "";

  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }

  return {
    isValid: isValid,
    element: element,
  };
};

export const saveDetailInforDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkInput = checkRequireFields(data);

      if (checkInput.isValid === false) {
        resolve({
          errCode: -1,
          errMessage: `Missing parameter ${checkInput.element} !!!!!!`,
        });
      } else {
        // Upsert to markdown table
        if (data.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        } else if (data.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = data.contentHTML;
            doctorMarkdown.contentMarkdown = data.contentMarkdown;
            doctorMarkdown.description = data.description;

            await doctorMarkdown.save();
          }
        }

        // Upsert to doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: data.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          // update
          doctorInfor.doctorId = data.doctorId;
          doctorInfor.priceId = data.selectedPrice;
          doctorInfor.provinceId = data.selectedProvince;
          doctorInfor.paymentId = data.selectedPayment;

          doctorInfor.addressClinic = data.addressClinic;
          doctorInfor.nameClinic = data.nameClinic;
          doctorInfor.note = data.note;
          doctorInfor.specialtyId = data.specialtyId;
          //doctorInfor.clinicId = data.clinicId;

          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: data.doctorId,
            priceId: data.selectedPrice,
            provinceId: data.selectedProvince,
            paymentId: data.selectedPayment,
            addressClinic: data.addressClinic,
            nameClinic: data.nameClinic,
            note: data.note,
            specialtyId: data.specialtyId,
            //clinicId: data.clinicId
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor successfully completed !!!!!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getDetailDoctorService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!!!!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Specialty,
                  as: "specialtyData",
                  attributes: ["name"],
                },
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!!!!",
        });
        return;
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = parseInt(MAX_NUMBER_SCHEDULE);
            return item;
          });
        }

        // Find data array from db
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "doctorId", "maxNumber", "date"],
        });

        // Compare different arrays
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "Created schedule successfully ✔✔",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getScheduleDoctorByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((!doctorId, !date)) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!!!!",
        });
        return;
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: parseInt(doctorId),
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (!data) data = [];

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getExtraInforDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!!!!",
        });
        return;
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getProfileDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!!!!",
        });
        return;
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
