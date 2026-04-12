import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const NetworkErrorAlert = () => {
  const [isNetworkError, setIsNetworkError] = useState(false);

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setIsNetworkError(false); // Reset network error on new request
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response || error.code === "ERR_NETWORK") {
          setIsNetworkError(true);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      // Cleanup interceptors when the component unmounts
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // const handleRetry = async () => {
  //   try {
  //     // Try to call a simple API endpoint
  //     await axios.get(import.meta.env.VITE_API_ENDPOINT + "/health-check");
  //     setIsNetworkError(false); // Close modal on success
  //   } catch (error) {
  //     console.error("Retry failed:", error);
  //   }
  // };
  useEffect(() => {
    let retryInterval: ReturnType<typeof setInterval>;

    if (isNetworkError) {
      retryInterval = setInterval(async () => {
        try {
          // Try to call a simple API endpoint
          await axios.get(import.meta.env.VITE_API_ENDPOINT + "/health-check");
          setIsNetworkError(false); // Close modal on success
          clearInterval(retryInterval); // Stop retrying once reconnected
        } catch (error) {
          console.warn("Retrying connection...");
        }
      }, 5000); // Retry every 5 seconds
    }

    return () => clearInterval(retryInterval); // Cleanup on unmount
  }, [isNetworkError]);
  return (
    <Snackbar
      open={isNetworkError}
      autoHideDuration={6000}
      onClose={() => setIsNetworkError(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centered Snackbar
    >
      <Alert severity='error' onClose={() => setIsNetworkError(false)}>
        Network error: Unable to connect to the backend. Reconnecting...
      </Alert>
    </Snackbar>
  );
};

export default NetworkErrorAlert;
    