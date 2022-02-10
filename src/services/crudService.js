import bcrypt from "bcryptjs";
import db from "../models/index";

const createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await hashPW(data.password);
      await db.User.create({
        email: data.email,
        firstName: data.firstName,
        password: hash,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender === "1" ? true : false,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      });
      resolve({
        status: "success",
        message: "Created!!!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const hashPW = async (pw) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(pw, salt);
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findAll({ raw: true });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserData = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findOne({
        where: {
          id: id,
        },
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
        },
        {
          where: { id: data.id },
        }
      );
      if (user) {
        resolve({
          status: "success",
          message: "Update successful",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const destroyUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ms = await db.User.destroy({
        where: { id: id },
      });
      if (ms) {
        resolve({
          status: "success",
          message: "Delete successful!!",
        })
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserData,
  updateUser,
  destroyUser
};
