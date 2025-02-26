
export interface User {
    _id: string;
    email: string;
    username: string;
    img?: string;
    password: string;
    firstname: string;
    lastname: string;
    country: string;
    city: string;
    isAdmin: boolean;
    phone: string;
    state: string;
    favouriteHotels?: string[];
    // Add other user properties as needed
  }
  
  export interface LoginCredentials {
    email?: string;
    password: string;
    username: string;
  }

  export interface RegisterCredentials {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
  }
  