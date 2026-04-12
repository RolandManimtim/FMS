import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
  submitText: string;
}

const ReusableModalv2: React.FC<Props> = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitText,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle  sx={{
    backgroundColor: "primary.main", // your primary color
    color: "#fff",
    fontWeight: "bold",
    px: 3,
    py: 2,
  }}>{title}</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
          padding: 3,
        }}
      >
        {children}
      </DialogContent>

      <DialogActions sx={{mb:2,mr:2}}>
        <Button onClick={onClose}>Close</Button>

      </DialogActions>
    </Dialog>
  );
};

export default ReusableModalv2;