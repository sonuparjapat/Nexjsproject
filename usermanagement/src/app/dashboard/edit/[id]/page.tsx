"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();

  // ✅ Hydration error fix
  if (typeof window === "undefined") return null;

  const [formData, setFormData] = useState({
    name: "",
    country_id: "",
    profession_id: "",
  });

  const [countries, setCountries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8000";

  useEffect(() => {
    fetchData();
    fetchCountries();
    fetchProfessions();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/user/allusers`, {
        withCredentials: true,
      });
      const user = res.data.data.find((u: any) => String(u.id) === String(id));
      if (!user) return setError("User not found.");
      setFormData({
        name: user.name,
        country_id: user.country_id,
        profession_id: user.profession_id,
      });
    } catch (err) {
      setError("Failed to fetch user.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API}/universal/countries`);
      setCountries(res.data?.msg);
    } catch {
      console.error("Error loading countries.");
    }
  };

  const fetchProfessions = async () => {
    try {
      const res = await axios.get(`${API}/universal/professions`);
      setProfessions(res.data.msg);
    } catch {
      console.error("Error loading professions.");
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API}/user/update/${id}`, formData, {
        withCredentials: true,
      });
      setMsg(res.data.msg || "Updated!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {msg && <p className="text-green-600 mb-4 text-center">{msg}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        <Field
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Select
          label="Country"
          name="country_id"
          options={countries}
          value={formData.country_id}
          onChange={handleChange}
        />

        <Select
          label="Profession"
          name="profession_id"
          options={professions}
          value={formData.profession_id}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

// 👇 Input Component
function Field({ label, name, value, onChange }: any) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
    </div>
  );
}

// 👇 Dropdown Component
function Select({ label, name, value, options, onChange }: any) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
