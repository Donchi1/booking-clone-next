import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({user: null, message: "logout success" }, { status: 200 });
  response.cookies.delete('access_token');
  return response;
}