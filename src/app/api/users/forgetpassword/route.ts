import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { email } = reqBody;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist." },
        { status: 404 }
      );
    }

    // Create reset token data
    const resetTokenData = {
      id: user._id.toString(), // Include the user's ID
    };

    // Sign the JWT token
    const resetToken = jwt.sign(resetTokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the reset token in the cookies
    const response = NextResponse.json({
      message: "Reset Link sent successfully",
      success: true,
    });

    response.cookies.set("resetToken", resetToken, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60, // 1 day
      sameSite: "strict", // Prevent CSRF attacks
    });

    // Send reset email
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    console.log("Email sent successfully.");

    return response;
  } catch (error: any) {
    console.error("Error in POST /forgetpassword:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
