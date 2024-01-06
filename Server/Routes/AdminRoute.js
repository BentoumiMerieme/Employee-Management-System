import express from "express";
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin where email = ? and password =?";
  pool.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      try {
        const token = jwt.sign(
          { role: "admin", email: email, id: result[0].id },
          "jwt_secret_key",
          {
            expiresIn: "1d",
          }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } catch (error) {
        console.error("JWT signing error:", error);
        return res
          .status(500)
          .json({ loginStatus: false, Error: "Internal server error" });
      }
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1001: Query Error get category",
      });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  pool.query(sql, [req.body.category], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1002: Query Error add category",
      });
    return res.json({ Status: true });
  });
});
//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
// end imag eupload
router.post("/add_employee", upload.single("image"), (req, res) => {
  const sql = `INSERT INTO employee (name, email, password, address, salary, image, category_id) VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.json({ Status: false, Error: "Hashing Error" });
    }
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];
    pool.query(sql, [values], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: false, Error: "err  add_employee" });
      }
      return res.json({ Status: true });
    });
  });
});
router.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employee";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1006: Query Error get employee",
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  pool.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1007: Query Error get employee edit",
      });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, category_id = ? WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
  ];
  pool.query(sql, [...values, id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1008: Query Error put employee_edit" + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id =?";
  pool.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1008: Query Error get employee delete",
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "Select count(id) as admin from admin";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1009: Query Error get count admin" + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee_count", (req, res) => {
  const sql = "Select count(id) as employee from employee";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1010: Query Error get count employee" + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", (req, res) => {
  const sql = "Select sum(salary) as salaryofEmp from employee";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1011: Query Error get count salary" + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", (req, res) => {
  const sql = "Select * from admin";
  pool.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "#1012: Query Error get records admin" + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});
export { router as adminRouter };
