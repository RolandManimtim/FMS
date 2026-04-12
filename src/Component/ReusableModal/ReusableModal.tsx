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
  width?: "xs" | "sm" | "md" | "lg" | "xl";
  hideSubmitButton?: boolean;
}

const ReusableModal: React.FC<Props> = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitText,
  width,
  hideSubmitButton ,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={width || "sm"}>
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
        <Button onClick={onClose}>Cancel</Button>

        {onSubmit && !hideSubmitButton && (
          <Button variant="contained" color="primary" onClick={onSubmit}>
  {submitText}
</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModal;