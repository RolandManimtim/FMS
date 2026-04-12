import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

interface Props {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<Props> = ({ open, message = "Loading..." }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 999,
        color: "#fff",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" />
      
      <Box>
        <Typography variant="body1">{message}</Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;