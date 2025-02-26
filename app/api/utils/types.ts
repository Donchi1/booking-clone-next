import { NextRequest } from "next/server";
import { DeleteApiResponse, UploadApiErrorResponse, UploadApiResponse } from "cloudinary/types";

export interface AuthenticatedUser {
    id: string;
    isAdmin: boolean;
    email?: string;
  }
  
  export interface TokenVerificationResult {
    user: AuthenticatedUser | null;
    error?: {
      type: 'expired' | 'invalid' | 'other';
      message: string;
    };
  }
  
  export interface PopulatedReq extends NextRequest {
    user: AuthenticatedUser | null;
    files?:  Blob[]  ;
    file?: Blob ;
  }

  export interface CloudImageInfo {
    error: UploadApiErrorResponse | null;
    data: UploadApiResponse | UploadApiResponse[] | null;
  }

  export interface CloudImageDeleteResult {
    success: boolean;
    error: UploadApiErrorResponse | null;
    data: {result: string} | {result: string}[] | null;
  }