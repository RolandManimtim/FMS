import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Router from "./Shared/Route/Router";
import { theme } from "./theme";
import { useEffect } from "react";
import { useLoading } from "./Context/LoadingContext";
import GlobalLoading from "./Component/Loading/GlobalLoading";
import NetworkErrorAlert from "./Component/NetworkAlert/NetworkAlert";


function App() {
   const { setLoading,setMessage } = useLoading();

 useEffect(() => {
  const start = (e: Event) => {
    const customEvent = e as CustomEvent;

    console.log("EVENT MESSAGE:", customEvent.detail); // ✅ debug

    setLoading(true);
    setMessage(customEvent.detail || "Loading...");
  };

  const stop = () => {
    setLoading(false);
  };

  window.addEventListener("loading:start", start);
  window.addEventListener("loading:stop", stop);

  return () => {
    window.removeEventListener("loading:start", start);
    window.removeEventListener("loading:stop", stop);
  };
}, [setLoading, setMessage]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets default styles */}
      <NetworkErrorAlert />
      <GlobalLoading />
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}

export default App;