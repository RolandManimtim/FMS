import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  toggleDrawer?: () => void;
  open?: boolean;
  activePage: string;
}

const Header: React.FC<Props> = ({ toggleDrawer, open, activePage }) => {
  const userName = localStorage.getItem("userName") || "User";

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        borderBottom: "1px solid #e2e8f0",
        marginLeft: open ? "240px" : "70px",
        width: open ? "calc(100% - 240px)" : "calc(100% - 70px)",
        transition: "0.3s",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {toggleDrawer && (
            <IconButton onClick={toggleDrawer} sx={{ color: "#334155" }}>
              <MenuIcon />
            </IconButton>
          )}
  <Typography
    variant="h5"
    sx={{
      fontWeight: "bold",
      color: "primary.main",
    }}
  >
    {activePage}
  </Typography>
        
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">{userName}</Typography>

          <IconButton sx={{ color: "#64748b" }}>
            <Badge badgeContent={10} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;