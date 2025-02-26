import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from './dbConnect';
import { AuthenticatedUser, PopulatedReq, TokenVerificationResult } from './types';



export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value || null;
}

export function verifyToken(token: string): TokenVerificationResult {
  try {
    if (!process.env.JWT) {
      throw new Error('JWT secret is not defined');
    }
    const user = jwt.verify(token, process.env.JWT) as AuthenticatedUser;
    return { user };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { 
        user: null, 
        error: { 
          type: 'expired', 
          message: 'Token has expired' 
        } 
      };
    }
    
    return { 
      user: null, 
      error: { 
        type: error.name === 'JsonWebTokenError' ? 'invalid' : 'other', 
        message: error.message || 'Token verification failed' 
      } 
    };
  }
}

export async function getCurrentUser(): Promise<TokenVerificationResult> {
  const token = await getToken();
  return token ? verifyToken(token) : { user: null };
}

export function requireAuth(handler: (req: PopulatedReq) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    await dbConnect()
    const { user, error } = await getCurrentUser();
    
    if (error) {
      if (error.type === 'expired') {
        // Redirect to login for expired tokens
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      // For other token errors, return an error response
      return NextResponse.json(
        { error: error.message }, 
        { status: error.type === 'invalid' ? 401 : 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );

    }

    (request as any).user = user;

    return handler(request as PopulatedReq);
  };
}

export function requireAdmin(handler: (req: PopulatedReq) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    await dbConnect()
    const { user, error } = await getCurrentUser();
    
    if (error) {
      if (error.type === 'expired') {
        // Redirect to login for expired tokens
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      // For other token errors, return an error response
      return NextResponse.json(
        { error: error.message }, 
        { status: error.type === 'invalid' ? 401 : 500 }
      );
    }

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' }, 
        { status: 403 }
      );
    }
    (request as any).user = user;

    return handler(request as PopulatedReq);
  };
}
