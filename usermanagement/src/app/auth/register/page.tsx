"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Types
interface Country {
  id: number;
  name: string;
}
interface Profession {
  id: number;
  name: string;
}
interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  country_id: string;
  profession_id: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    country_id: "",
    profession_id: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  const API = "http://localhost:8000";

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const countryRes = await axios.get(`${API}/universal/countries`);
        const professionRes = await axios.get(`${API}/universal/professions`);
        console.log(countryRes,"res")
        setCountries(countryRes.data?.msg);
        setProfessions(professionRes.data.msg);
      } catch (err) {
        console.error("Dropdown Load Error:", err);
      }
    };
    loadDropdowns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    // setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/register`, formData, {
        withCredentials: true,
      });
      setSuccessMsg(res.data.msg || "Registered successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        country_id: "",
        profession_id: "",
      });
         router.push("/auth/login");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.error || err.response?.data?.msg) {
        setErrors({ general: err.response.data.error || err.response.data.msg });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!countries.length || !professions.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-md mx-auto mt-2 p-6 border rounded-lg shadow-md bg-white">
        
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      {errors.general && <p className="text-red-600 mb-4 text-center">{errors.general}</p>}
      {successMsg && <p className="text-green-600 mb-4 text-center">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2"> 
        <Field
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />
        <Field
          label="Phone"
          name="phone"
          type="text"
          value={formData.phone}
          error={errors.phone}
          onChange={handleChange}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />

        <Dropdown
          label="Country"
          name="country_id"
          value={formData.country_id}
          options={countries}
          error={errors.country_id}
          onChange={handleChange}
        />

        <Dropdown
          label="Profession"
          name="profession_id"
          value={formData.profession_id}
          options={professions}
          error={errors.profession_id}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 col-span-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div></>
  );
}

// 🔹 Reusable Field Component
function Field({
  label,
  type,
  name,
  value,
  error,
  onChange,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// 🔹 Reusable Dropdown Component
function Dropdown({
  label,
  name,
  value,
  error,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  options: { id: number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
