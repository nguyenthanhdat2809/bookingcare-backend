import {
  handleUserLogin,
  getAllUser,
  createNewUser,
  deleteUser,
  updateUser,
  getAllCodeService
} from "../services/userServices";

const handleLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  const userData = await handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    userData: userData.user ? userData.user : {},
  });
};

const handleGetAllUser = async (req, res) => {
  const id = req.query.id; // All hoặc id
  const users = await getAllUser(id);

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
      users: [],
    });
  }

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

const handleCreateNewUser = async (req, res) => {
  const message = await createNewUser(req.body);
  return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
  const data = req.body;
  const message = await updateUser(data);
  return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!!!!!!",
    });
  }
  const message = await deleteUser(req.body.id);
  return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
  try {
    let data = await getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
