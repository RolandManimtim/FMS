import type { IClientRequest } from "../../Interface/IClientRequest.interface";
import { Client } from "../AxosService";

 interface IDataTableCommand {
  draw: number;
  start: number;
  length: number;
  search: string;
}

export interface ICreateClient {
   clientName: string;
  address: string;
  contactNo: string;
}

export interface IUpdateClient {
  clientID: number | undefined;
  clientName: string;
  address: string;
  contactNo: string;
}

const GetClientList = async (dto: IDataTableCommand) => {
  const request: IClientRequest = {
    method: "POST",
    url: "Client/ClientList", // 👈 match controller
    data: dto,
  };

  return await Client(request);
};

const CreateClient = async (data: ICreateClient) => {
  return await Client({
    method: "POST",
    url: "Client/CreateClient",
    data,
  },
  "Creating client..." // ✅ optional loading message
  );
};

const UpdateClient = async (data: IUpdateClient) => {
  return await Client({
    method: "POST",
    url: "Client/UpdateClient",
    data,
  },
  "Updating client..." // ✅ optional loading message
  );
};

const DeleteClient = async (clientId: number) => {
  return await Client({
    method: "DELETE",
    url: `Client/DeleteClient?clientId=${clientId}`,
  },
  "Deleting client..." // ✅ optional loading message
  );
};

const ClientDetails = async (clientId: number) => {
  return await Client({
    method: "GET",
    url: `Client/Client?clientId=${clientId}`,
  },
  "Fetching client..." // ✅ optional loading message
  );
};


const clientService = {
    CreateClient,
    GetClientList,
    UpdateClient,
    DeleteClient,
    ClientDetails
};
export { clientService };