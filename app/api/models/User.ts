import mongoose from 'mongoose';

// Define an interface for the User document
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  img?: string;
  isAdmin?: boolean;
  favouriteHotels?: string[];
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
}

// Create the schema
const UserSchema = new mongoose.Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstname: { 
    type: String 
  },
  lastname: { 
    type: String 
  },
  img: { 
    type: String 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  favouriteHotels: { 
    type: [String] 
  },
  city: { 
    type: String 
  },
  country: { 
    type: String 
  },
  state: { 
    type: String 
  },
  phone: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Prevent model re-compilation
export const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', UserSchema);

export default User;