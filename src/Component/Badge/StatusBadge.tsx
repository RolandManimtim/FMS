import { Box } from "@mui/material";

const StatusBadge = ({ status }: { status: boolean }) => {
  const getStatusStyle = (status: boolean) => {
    if (status) {
      return {
        bg: "#dcfce7",
        color: "#16a34a",
        label: "Active",
      };
    }

    return {
      bg: "#fee2e2",
      color: "#dc2626",
      label: "Inactive",
    };
  };

  const style = getStatusStyle(status);

  return (
    <Box
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.5,
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold",
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </Box>
  );
};

export default StatusBadge;
