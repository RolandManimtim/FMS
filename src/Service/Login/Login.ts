import axios from "axios";
import type { ILogin } from "../../Interface/Login/ILogin.interface";
import { Client } from "../AxosService";
import type { userService } from "../User/User";

export interface IUserPayload {
  token: string;
  userName: string;
  // add other fields if your API returns more
}
export interface ILoginResponse {
  data: IUserPayload;
  // add other fields if your API returns more
}

// export const login = async (data: ILogin) => {
// const api = import.meta.env.VITE_API_ENDPOINT;
// try{
//  const response = await axios.post<ILoginResponse>(
//     `${api}/User/Login`,
//     data
//   );
//   return response.data;
// }
//  catch(error){
//     console.log(error, "error");
//  }

  
// };

const login = async (data: ILogin) => {
  return await Client({
    method: "POST",
    url: `User/Login`,
    data: data,
  },
  "Logging in..." // ✅ optional loading message
  );
};

const loginService = {
    login
};
export { loginService };