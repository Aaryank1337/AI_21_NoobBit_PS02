import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios.js"; // Import axios instance

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(isLogin ? "Logging in with" : "Signing up with", data);
    const endpoint = isLogin ? "/api/user/login" : "/api/user/signup";

    try {
      const res = await api.post(endpoint, data);
      localStorage.setItem("token", res.data.token);
      console.log("Authentication successful, token stored!");
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed:", error.response?.data?.error || error.message);
    }
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="role" className="block font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                {...register("role", { required: !isLogin })}
                className="border rounded w-full p-2 mt-1"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="border rounded w-full p-2 mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              className="border rounded w-full p-2 mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline ml-1"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
