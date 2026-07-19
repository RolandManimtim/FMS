import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({
  open,
  title = "Confirmation",
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={!loading ? onCancel : undefined}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <HelpOutlineIcon color="warning" />

          <Typography
            variant="h6"
            fontWeight={600}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.primary" }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;