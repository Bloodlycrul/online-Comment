import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQureySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // Validate with Zod

    const result = UsernameQureySchema.safeParse(queryParams);
    //todo :   Delete in the production environment
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const findUsernameExist = await UserModel.findOne({
      username: username,
      isVerifed: true,
    });

    if (findUsernameExist) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "This username is ready to be used",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking in username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking in username",
      },
      { status: 500 }
    );
  }
}
