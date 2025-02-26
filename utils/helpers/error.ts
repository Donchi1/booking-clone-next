
export const createError = (status:number, message:string) => {
  const err = new Error() as Error & { status:number; message:string };
  err.status = status;
  err.message = message;
  return err;
};




