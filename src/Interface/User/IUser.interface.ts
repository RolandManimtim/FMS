export interface IUser {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  hashPassword: string;
  profilePictureId: string;
}
