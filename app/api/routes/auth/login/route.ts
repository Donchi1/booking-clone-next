import { NextRequest, NextResponse } from 'next/server';
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {dbConnect} from "@/app/api/utils/dbConnect";

// Check if email is valid
const checkEmail = (username: string) => {
  return username.includes("@");
};

// Utility function to create error response
const createErrorResponse = (status: number, message: string) => {
  return NextResponse.json({ message }, { status });
};



export async function POST(req: NextRequest) {

  const error = await dbConnect();
  if (error) return NextResponse.json({ error: error.message || "Database connection error" }, { status: error.status || 500 });
 
  try {
    const { username, password, rememberMe } = await req.json();
    // Find user by email or username
    const user = checkEmail(username) 
      ? await User.findOne({ email: username }) 
      : await User.findOne({ username });

    if (!user) {
      return createErrorResponse(404, "User not found!");
    }

    // Password verification
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return createErrorResponse(400, "Wrong password or username!");
    }

    // JWT Token generation
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT!,
      { expiresIn: rememberMe ? "30d" : "7d" }
    );

    // Prepare response
    const { password: _, isAdmin, ...otherDetails } = user.toObject();

    const response = NextResponse.json({
      user: { ...otherDetails, isAdmin },
      message: "login success"
    }, { status: 200 });

    // Set cookie
    response.cookies.set('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return response;
  } catch (err: any) {
    return createErrorResponse(500, "Login failed");
  }
}