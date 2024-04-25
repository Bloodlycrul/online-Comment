import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request, res: Response) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: username,
      isVeriied: true,
    });
    if (existingUserVerifiedByUsername) {
      return (
        Response.json({
          success: false,
          message: "Username is already taken.",
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email: email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerifed) {
        return (
          Response.json({
            success: false,
            message: "User already exists with this email",
          }),
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.passsword = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const userSaved = new UserModel({
        username,
        email,
        passsword: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerifed: false,
        isAcceptedMessage: true,
        message: [],
      });

      await userSaved.save();
    }

    // Send verification code through email notification

    const emailResponce = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    if (!emailResponce.success) {
      return (
        Response.json({
          success: false,
          message: emailResponce.message,
        }),
        { status: 500 }
      );
    }

    return (
      Response.json({
        success: true,
        message:
          "User registered successfully. Please verify your email address",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error regestring user", error);
    return (
      Response.json({
        success: false,
        message: "User are failed to register",
      }),
      {
        status: 500,
      }
    );
  }
}
