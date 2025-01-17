"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
	const router = useRouter();
    const [data, setData] = useState("nothing");
    const [username, setUsername] = useState("");

	async function logout() {
		try {
			await axios.get("/api/users/logout");
            console.log("logout success")
			toast.success("logout successful");
			router.push("/login");
		} catch (error: any) {
			console.log(error.message);
		}
	}
	
	useEffect( () => {
		async function getUsername (){
			const res = await axios.get('/api/users/me')
		setUsername(res.data.data.username)
		}

		getUsername()
	}, [])
	
	

    async function getUserDetails(){
        const res = await axios.get('/api/users/me')
        console.log(res.data);
        setData(res.data.data._id)
		setUsername(res.data.data.username)
    }


	return (
		<div className="min-h-screen ">
			<button
				onClick={logout}
				className="mt-4 bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-bold absolute right-2 top-0"
			>
				Logout
			</button>

			<div className="min-h-screen flex flex-col justify-center items-center">

			<h1>Profile</h1>
			<h2>Hello , {username}</h2>
			<p>profile pge</p>

            <h2
            className="p-3 rounded bg-green-500 inline-block"
            >{data ==='nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}

            </h2>

			

			
			

				<button
            onClick={getUserDetails}
            className="bg-purple-700 hover:bg-purple-800 rounded px-4 py-2 mt-4 font-bold text-white "
            >getUserDetails</button>
           
           </div>
		
		</div>
	);
}
