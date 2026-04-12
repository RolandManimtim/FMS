import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export const LoadingProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading, message, setMessage }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);