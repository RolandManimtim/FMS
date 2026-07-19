import type { IClientRequest } from "../../Interface/IClientRequest.interface";
import type { IUserDetails } from "../../Page/User/interface/IUser.interface";
import { Client } from "../AxosService";

 interface IDataTableCommand {
  draw: number;
  start: number;
  length: number;
  search: string;
}

const CreateUser = async (data: IUserDetails) => {
  return await Client({
    method: "POST",
    url: "User/CreateUser",
    data,
  },
  "Creating user..." // ✅ optional loading message
  );
};

const GetUserList = async (dto: IDataTableCommand) => {
  const request: IClientRequest = {
    method: "POST",
    url: "User/UserList", // 👈 match controller
    data: dto,
  };

  return await Client(request);
};

const UpdateUser = async (data: IUserDetails) => {
  return await Client({
    method: "POST",
    url: "User/UpdateUser",
    data,
  },
  "Updating user..." // ✅ optional loading message
  );
};

const DeleteUser = async (userId: number) => {
  return await Client({
    method: "DELETE",
    url: `User/DeleteUser?userId=${userId}`,
  },
  "Deleting user..." // ✅ optional loading message
  );
};
const userService = {
    CreateUser,
    GetUserList,
    UpdateUser,
    DeleteUser
};
export { userService };