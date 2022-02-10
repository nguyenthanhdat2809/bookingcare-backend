import db from "../models/index";
import {
  createNewUser,
  getAllUser,
  getUserData,
  updateUser,
  destroyUser
} from "../services/crudService";

const getHomepage = async (req, res, next) => {
  const data = await db.User.findAll({ raw: true });
  console.log(data);
  return res.render("homepage", { data: JSON.stringify(data) });
};

const getCRUD = async (req, res, next) => {
  return res.render("crud");
};

const postCRUD = async (req, res, next) => {
  const createStatus = await createNewUser(req.body);
  console.log(createStatus);
  return res.redirect("/crud-get");
};

const displayGetCRUD = async (req, res, next) => {
  const data = await getAllUser();
  return res.render("displayCRUD", { data });
};

const getEditCRUD = async (req, res, next) => {
  let id = req.query.id;
  if (id) {
    let userData = await getUserData(id);
    res.render("editCRUD", { userData });
  } else {
    return;
  }
};

const editCRUD = async (req, res) => {
  const data = req.body;
  const dataUpdate = await updateUser(data);
  console.log(dataUpdate);
  return res.redirect("/crud-get");
};

const deleteCRUD = async (req, res) => {
  const id =  req.query.id;
  const message = await destroyUser(id);
  if (message) {
    console.log(message);
    return res.redirect("/crud-get");
  } else {
    return res.send(404);
  }
}

module.exports = {
  getHomepage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  editCRUD,
  deleteCRUD,
};
