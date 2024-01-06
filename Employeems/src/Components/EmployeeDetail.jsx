import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState([]);
  const anavigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/detail/" + id)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          anavigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="frame">
      <h4 className="title">Employee Management System</h4>
      <div className="center">
        <div className="profile">
          <div className="image">
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <img
              className="image_prf"
              src={"http://localhost:3000/Images/" + employee.image}
            />
          </div>

          <div className="name">{employee.name}</div>
          <div className="job"> {employee.email}</div>
          <div className="job"> ${employee.salary}</div>

          <div className="actions">
            <button className="btn2">Edit</button>
            <button className="btn2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeDetail;
