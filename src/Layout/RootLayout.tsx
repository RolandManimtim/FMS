import { Outlet } from "react-router-dom";
import type { AlertColor } from "@mui/material";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../Service/Jwt/Jwt";
import Login from "../Page/Login/Login";
import SideNav from "../Component/SideNav";
import CustomSnackbar from "../Component/Notification";
import Header from "../Component/Header";
import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function RootLayout() {
  const [IsLoggedIn, setIsLoggedIn] = useState(false);

  // 👇 Sidebar state moved here
  const [open, setOpen] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const location = useLocation();
  
  useEffect(() => {
    const logged = isLoggedIn();
    setIsLoggedIn(logged);

    if (!logged) {
      setSnackbarOpen(true);
      setSeverity("error");
      setSnackbarMessage("Session Timeout");
    } 
  }, []);

  const handleClose = () => setSnackbarOpen(false);

const formatActivePage = (path: string) => {
  return path
    .split("/")[1] // ✅ get only "ClientDetails" (removes /59)
    ?.replace(/([a-z])([A-Z])/g, "$1 $2") // add space before capitals
    ?.replace(/-/g, " ") // replace "-" with space
    ?.toUpperCase();
};

  if (!IsLoggedIn) {
    
    return <Login />;
  }

  return (
    <>
      {/* ✅ Pass state */}
      <SideNav open={open} setOpen={setOpen} />

      {/* ✅ Header */}
      <Header open={open} toggleDrawer={() => setOpen(!open)} activePage={formatActivePage(location.pathname)} />

      {/* ✅ Content area */}
      <Box
        component="main"
        sx={{
          marginLeft: open ? "240px" : "70px",
          transition: "0.3s",
          p: 3,
        }}
      >
        <Toolbar /> {/* pushes content below header */}
        <Outlet />
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={severity}
        onClose={handleClose}
      />
    </>
  );
}