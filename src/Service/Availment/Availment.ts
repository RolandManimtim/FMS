import type { IAvailment, IAvailmentDetails } from "../../Page/Client/interface/IClient";
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

const CreatePayment = async (data: IAvailmentDetails) => {
  console.log("Payment to be created in service:", data); // Log the payment object
  return await Client(
    {
      method: "POST",
      url: "Availment/Payment",
      data,
    },
    "Creating payment..."
  );
};
const TopUp = async (payload: {
  availmentID: number;
  topUpAmount: number;
}) => {
  return await Client(
    {
      method: "GET",
      url: `Availment/topUp?availmentID=${payload.availmentID}&topUpAmount=${payload.topUpAmount}`,
    },
    "Processing loan top-up..."
  );
};
const availmentService = {
    CreateAvailment,
    AvailmentDetails,
    CreatePayment,
    TopUp
};

export { availmentService };