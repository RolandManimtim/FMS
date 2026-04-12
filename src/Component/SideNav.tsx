import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Client Management", icon: <PeopleIcon />, path: "/ClientManagement" },
  { text: "User Management", icon: <SupervisedUserCircleIcon />, path: "/UserManagement" },
];

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNav: React.FC<Props> = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear token / auth data here
    localStorage.removeItem("token");

    // Redirect to login
     window.location.href = "/";
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 70,
          transition: "0.3s",
          backgroundColor: "#1e293b",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
        }}
      >
       
          <Typography variant="h6" fontWeight="bold">
            FMS
          </Typography>
      

       
      </Box>
      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "#3f51ff",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>

            {open && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>

      {/* Logout Section (Bottom) */}
      <Divider sx={{ backgroundColor: "#334155" }} />

      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            my: 1,
            "&:hover": {
              backgroundColor: "#3f51ff",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>

          {open && <ListItemText primary="Logout" />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default SideNav;