"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ResetPassPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  

  // Extract token from the URL using URLSearchParams
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setMessage("Invalid or missing token.");
    }
  }, []);

  // Submit handler for form submission
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log('token is', token);
    console.log('password is', newPassword);
    

    if (!token || !newPassword) {
      setMessage("Both token and new password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post("/api/users/resetpassword", {
        token,
        newPassword,
      });

      setMessage(res.data.message || "Password reset successful!");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setMessage(
        error.response?.data?.error || "An error occurred while resetting the password."
      );
    } finally {
      setIsSubmitting(false);
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 p-8 border rounded">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {message && <p className="text-center text-gray-700">{message}</p>}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <label htmlFor="newpassword" className="font-semibold">
            New Password
          </label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 outline-none rounded text-black border"
            type="password"
            id="newpassword"
            placeholder="Enter new password"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newPassword}
            className={`rounded bg-emerald-400 p-2 text-black hover:bg-emerald-500 ${
              isSubmitting || !newPassword ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <Link href="/login" className="text-emerald-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
