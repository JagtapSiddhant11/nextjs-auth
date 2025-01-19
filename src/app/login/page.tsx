"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
	const router = useRouter();
	const [user, setUser] = React.useState({
		email: "",
		password: "",
	});
	const [buttonDisabled, setButtonDisabled] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const onLogin = async () => {
		try {
			setLoading(true);
			const response = await axios.post("/api/users/login", user);
			console.log("Login success", response.data);
			toast.success("Login success");
			router.push("/profile");
		} catch (error: any) {
			console.log("Login failed", error.message);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user.email.length > 0 && user.password.length > 0) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	return (
		<div className="flex  items-center justify-center min-h-screen  ">
			<div className="flex flex-col p-10 border " >

			<h1 className="text-3xl mb-2 text-center">{loading ? "Processing" : "Login"}</h1>
			{/* <hr /> */}

			<label 
			className="mb-2"
			htmlFor="email">Email</label>
			<input
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
				id="email"
				type="text"
				value={user.email}
				onChange={(e) => setUser({ ...user, email: e.target.value })}
				placeholder="email"
			/>
			<label 
			className="mb-2"
			htmlFor="password">Password</label>
			<input
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
				id="password"
				type="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="password"
			/>
			<button
				onClick={onLogin}
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
			>
				Login here
			</button>
			<div className="flex flex-col text-center gap-2">
			<Link href="/signup" className="">Visit Signup Page</Link>
			<Link href="/forgetpassword">Forget Password?</Link>
			</div>
			
			</div>

		</div>
	);
}
