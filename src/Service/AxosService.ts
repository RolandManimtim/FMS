import axios from "axios";
import type { IClientRequest } from "../Interface/IClientRequest.interface";

export async function Client(request: IClientRequest, message?: string) {
  const api = import.meta.env.VITE_API_ENDPOINT;

  const token = localStorage.getItem("token");

  // ✅ START LOADING
   window.dispatchEvent(new CustomEvent("loading:start", { detail: message }));

  try {
    const response = await axios({
      method: request.method,
      url: `${api}/${request.url}`,
      data: request.data,

      headers: {
        "Content-Type":
          request.data instanceof FormData ? undefined : "application/json",

        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        window.location.href = "/login";
      }

      console.error("API call error:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  } finally {
    // ✅ ALWAYS STOP LOADING
    window.dispatchEvent(new Event("loading:stop"));
  }
}