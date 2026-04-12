export interface IUserDetails {
id?: number;
userName: string;
email: string;
hashPassword?: string ;
confirmPassword?: string  ;
[key: string]: any;
}