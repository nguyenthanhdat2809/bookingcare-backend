import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExist = await checkUserEmail(email);
      if (isExist) {
        // compare the password
        const user = await db.User.findOne({
          where: { email: email },
        });

        if (user) {
          const check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "SUCCESS!!";
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is'n exist!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage =
          "You'r email isn'n exist in you'r system, Plz try other email!";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { email: email },
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "All") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      }

      if (userId && userId !== "All") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          message: "Missing parameter!!!!!!",
        });
        return;
      }
      // check email tồn tại
      const check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          message: "Your Email is already, plz!!!!!",
        });
        return;
      }

      const hash = await hashPW(data.password);
      await db.User.create({
        email: data.email,
        firstName: data.firstName,
        password: hash,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
        positionId: data.positionId,
        image: data.avatar,
      });
      resolve({
        errCode: 0,
        Message: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const hashPW = async (pw) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await bcrypt.hashSync(pw, salt);
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: id },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "The user does not exist!!!!!!!!!",
        });
      }

      await db.User.destroy({
        where: { id: id },
      });
      resolve({
        errCode: 0,
        message: "The user has been deleted!!!!!!!!!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      const user = await db.User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          roleId: data.roleId,
          positionId: data.positionId,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          image: data.avatar,
        },
        {
          where: { id: data.id },
        }
      );
      if (user) {
        resolve({
          errCode: 0,
          message: "Update successful!!!!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllCodeService = async (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!!!!!!'
        })
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: type },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUser,
  createNewUser,
  deleteUser,
  updateUser,
  getAllCodeService,
};
