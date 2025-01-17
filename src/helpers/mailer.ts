import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }:any) => {
    try {
        // Create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
            });
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_USER_ID,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'samir@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `${emailType === "VERIFY" ? 
                `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken} ">here</a>  to 
            , or copy and paste the link below in your browser:<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>` 
              :
              `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken} ">here</a>  to 
            , or copy and paste the link below in your browser:<br>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>`
        }`

        };

        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;

    } catch (error:any) {
        console.error("Error sending email:", error.message);
        throw new Error(error.message);
    }
};
