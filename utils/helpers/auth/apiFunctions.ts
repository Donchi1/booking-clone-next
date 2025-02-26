import { LoginCredentials, RegisterCredentials, User } from '@/utils/types/auth';
import axios from 'axios';
import { createError } from '../error';


// API Functions
export const fetchCurrentUser = async () => {
     try {
       const { data } = await axios.get<{ user: User }>(`/api/routes/users/single`);
       return data.user;
     } catch (error:any) {
       const errorMessage = error.response?.data?.message || 'Something went wrong';
       
       throw createError(error.status, errorMessage)
     }
  };
  
  export const loginUser = async (credentials: LoginCredentials) => {
    try {
      const { data } = await axios.post<{ user: User }>('/api/routes/auth/login', credentials);
      return data.user;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      throw createError(error.status, errorMessage)
    }
  
  };
  
  export const logoutUser = async () => {
   const {data} = await axios.delete('/api/routes/auth/logout');
    return data.user;
  };

  export const registerUser = async (credentials: RegisterCredentials) => {
    try {
      const { data } = await axios.post<{ message: string }>('/api/routes/auth/register', credentials);
      return data;
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      throw createError(error.status, errorMessage)
    }
  };