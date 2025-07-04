import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { NextRequest,NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json()
        //Check from username or email
       // const {email, password} = reqBody;
       const {email, password} = reqBody;
        console.log(reqBody);

        //check if user exists 
      //  const user = await User.findOne({email})
         // check if user exists by either email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
        
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);
        
        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        return response;

     } 
     //catch (error: any) {
    //     return NextResponse.json({error: error.message}, {status: 500})
    // }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}