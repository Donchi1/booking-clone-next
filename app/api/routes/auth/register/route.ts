import { NextRequest, NextResponse } from 'next/server';
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";
//import { imageUploader } from "@/app/api/utils/cloudImage";


// Utility function to create error response
const createErrorResponse = (status: number, message: string) => {
  return NextResponse.json({ message }, { status });
};


export async function POST(req: NextRequest) {
  try {
    const { email, password,...rest } = await req.json();

    //const file = formData.get('file') as File;

    // Check existing user by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return createErrorResponse(401, "User already exists with this email");
    }

    // Check existing user by username
    const existingUsername = await User.findOne({ username: rest.username });
    
    if (existingUsername) {
      return createErrorResponse(401, "User already exists with this username");
    }

    // Password hashing
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Image upload
    // const imageInfo = await imageUploader(file);
    // if (imageInfo.error) {
    //   return createErrorResponse(500, imageInfo.data);
    // }

    // Create new user
    const newUser = new User({
      ...rest,
      email,
      password: hash,
      // img: imageInfo.data.secure_url,
      // imgId: imageInfo.data.public_id
    });

    await newUser.save();
    return NextResponse.json({ message: "You are successfully registered" }, { status: 201 });
  } catch (err) {
    return createErrorResponse(500, "Registration failed");
  }
}