import { DeleteApiResponse, UploadApiResponse, v2 } from "cloudinary";
import { CloudImageInfo, CloudImageDeleteResult } from "./types";

// Configure Cloudinary
const cloudinary = v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "donny12",
  api_key: process.env.API_KEY || "356334839991679",
  api_secret: process.env.API_SECRET || "gDkF1r2xFX9ZmUfm8-R-dOtaUXU",
});

// Utility function to convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Upload multiple images
export const imageUploaderMultiple = async (clientFiles: File[]): Promise<CloudImageInfo> => {
  try {
    // Upload images to Cloudinary
    const data: UploadApiResponse[] = await Promise.all(
      clientFiles.map(async (file) => {
        const buffer = await fileToBuffer(file);
        return new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              public_id: file.name.split(".")[0],
              folder: "booking-clone" // Optional: organize uploads in a folder
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Upload failed"));
            }
          );
          uploadStream.end(buffer);
        });
      })
    );
    
    return { error: null, data };
  } catch (err:any) {
    return { error: err, data: null };
  }
};

// Upload single image
export const imageUploader = async (file: File): Promise<CloudImageInfo> => {
  try {
    const buffer = await fileToBuffer(file);
    const data = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          public_id: file.name.split(".")[0],
          folder: "booking-clone" // Optional: organize uploads in a folder
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed"));
        }
      ).end(buffer);
    });
    
    return { error: null, data };
  } catch (err:any) {
    return { error: err, data: null};
  }
};

// Delete multiple images
export const imageDeleteMultiple = async (
  filesForDelete: UploadApiResponse[]
): Promise<CloudImageDeleteResult> => {
  try {
    const deleteResults:{result: string}[] = await Promise.all(
      filesForDelete.map(async (each) => {
        return cloudinary.uploader.destroy(each.public_id);
      })
    );
    
    return { 
      success: deleteResults.every(result => result.result === 'ok'), 
      error: null, 
      data: deleteResults as any 
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err , 
      data: null
    };
  }
};

// Delete single image
export const imageDelete = async (fileId: string): Promise<CloudImageDeleteResult> => {
  const publicId = getPublicId(fileId);
  try {
    const result:{result: string} = await cloudinary.uploader.destroy(publicId!);
    return { 
      success: result.result === 'ok', 
      error: null, 
      data: result
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err, 
      data: null
    };
  }
};

export const getPublicId = (url: string ) => {
    if (!url) return null;
    const result = url.split("/").pop()?.split(".")[0] || null;
    return result
};
