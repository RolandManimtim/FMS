import type { IAvailment } from "../../Page/Client/interface/IClient";
import { Client } from "../AxosService";


const CreateAvailment = async (data: IAvailment) => {
  return await Client({
    method: "POST",
    url: "Availment/CreateAvailment",
    data,
  },
  "Creating availment..." // ✅ optional loading message
  );
};

const AvailmentDetails = async (availmentId: number) => {
  return await Client({
    method: "GET",
    url: `Availment/Availment?availmentId=${availmentId}`,
  },
  "Fetching availment..." // ✅ optional loading message
  );
};

const availmentService = {
    CreateAvailment,
    AvailmentDetails,
};

export { availmentService };