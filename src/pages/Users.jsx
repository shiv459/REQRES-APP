import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({ first_name: "", last_name: "", email: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || (tokenExpiry && new Date().getTime() > Number(tokenExpiry))) {
      handleLogout();
    } else {
      fetchUsers();
    }
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch users!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setFilteredUsers(filteredUsers.filter(user => user.id !== id));
      setMessage({ type: "success", text: "User deleted successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete user!" });
    }
  };

  const handleEdit = (id, first_name, last_name, email) => {
    setEditUserId(id);
    setEditUser({ first_name, last_name, email });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedUser = {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
      };

      await axios.put(`https://reqres.in/api/users/${editUserId}`, updatedUser);

      const updatedUsers = users.map((user) =>
        user.id === editUserId ? { ...user, ...updatedUser } : user
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditUserId(null);
      setEditUser({ first_name: "", last_name: "", email: "" });
      setMessage({ type: "success", text: "User updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Error updating user!" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users List</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-3 text-white rounded ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? <p className="text-center">Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 shadow-lg rounded-lg">
              <img src={user.avatar} alt={user.first_name} className="w-24 h-24 rounded-full mx-auto" />
              <h3 className="text-center font-semibold mt-2">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-center text-gray-500">{user.email}</p>
              <div className="flex justify-center mt-2">
                <button onClick={() => handleEdit(user.id, user.first_name, user.last_name, user.email)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mx-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded mx-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
