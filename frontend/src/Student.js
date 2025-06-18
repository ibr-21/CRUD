import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function normalizeKeys(obj) {
  // to avoid case-sensitive keys
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
  );
}

function Student() {
  const [student, setStudent] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) =>{
        const normalized = res.data.map((item) => normalizeKeys(item));
        setStudent(normalized)
      })
      .catch((err) => console.log(err));
  }, []);

  const handelDel = async (id) => {
    try {
      await axios.delete("http://localhost:8081/student/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center ">
      <div className="w-75 bg-white rounded p-3">
        <Link to="/create" className="btn btn-success">
          Add+
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Name </th>
              <th>Email </th>
              <th>Action </th>
            </tr>
          </thead>
          <tbody>
            {student.map((data, i) => (
              <tr key={i}>
                <td>{data.name || "N/A"}</td>
                <td>{data.email || "N/A"}</td>
                <td>
                  <Link to={`/update/${data._id}`} className="btn btn-primary">
                    Update
                  </Link>
                  <button
                    className="btn btn-danger ms-3"
                    onClick={(e) => handelDel(data._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Student;
