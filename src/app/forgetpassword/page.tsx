"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";




export default function ForgetPassword(){

    const router = useRouter()


    const [email, setEmail] = useState("appa@gmail.com")


    const submitHandler = async() =>{
        try {
            const response = await axios.post('/api/users/forgetpassword', {email});
            console.log("respones is ",response.data)

            router.push("/resetpassword");
            return response;
            
        } catch (error:any) {
            console.log("error in forget password");
            
        }
        finally{
            setEmail("");
        }

    }


    return(
        <div className="min-h-screen flex justify-center items-center ">
            <div 
            className=" flex flex-col justify-center border p-10 gap-3 ">
                <label htmlFor="email" className="text-center">Send an Email</label>
                <input 
                value={email}
                onChange={e => setEmail(e.target.value)}
                id="email" type="text" className="p-2 rounded mb-2 outline-none text-black"/>
                <button 
                onClick={submitHandler}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 rounded ">
                submit
                </button>
            </div>
        </div>
    )

}