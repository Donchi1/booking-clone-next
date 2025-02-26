import { NextRequest, NextResponse } from 'next/server';
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Utility function to create error response
const createErrorResponse = (status: number, message: string) => {
  return NextResponse.json({ error: message }, { status });
};

export async function POST(req: NextRequest) {
  const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT);

  try {
    const { tokenId } = await req.json();
    const resToken = await client.verifyIdToken({
      idToken: tokenId, 
      audience: process.env.GOOGLE_AUTH_CLIENT
    });

    const cred = resToken.getPayload();
    if (!cred || !cred.email_verified) {
      return createErrorResponse(403, "Google login failed. Please try another email address.");
    }

    // Extract user details
    const { 
      email, 
      name, 
      given_name, 
      family_name, 
      picture 
    } = cred;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      const newPassword = process.env.GOOGLE_AUTH_CLIENT + name! || " ";
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      user = new User({
        username: given_name,
        email,
        password: hashedPassword,
        firstname: family_name,
        lastname: given_name,
        city: "New York",
        country: "USA",
        img: picture,
        phone: "+1234567867"
      });

      await user.save();
    }

    // Generate token and response
    const access_token = jwt.sign({ id: user._id }, process.env.JWT!);
    const { password, isAdmin, ...otherDetails } = user.toObject();

    const response = NextResponse.json({
      data: { ...otherDetails, isAdmin },
      message: "login success"
    }, { status: 200 });

    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return response;
  } catch (error) {
    console.error(error);
    return createErrorResponse(500, "Google login failed");
  }
}