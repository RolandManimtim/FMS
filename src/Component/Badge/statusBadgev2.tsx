import { Box } from "@mui/material";

const StatusBadgev2 = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    if (status === "Paid") {
      return {
        bg: "#dcfce7",
        color: "#16a34a",
        label: "Paid",
      };
    }

    return {
      bg: "#f9aa18",
      color: "#f0ede1",
      label: "Unpaid",
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

export default StatusBadgev2;