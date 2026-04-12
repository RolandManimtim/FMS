import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useLoading } from "../../Context/LoadingContext";


const GlobalLoading = () => {
  const { loading, message } = useLoading();

  return (
    <Backdrop
      open={loading}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 999,
        color: "#fff",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" />
      <Typography>{message}</Typography>
    </Backdrop>
  );
};

export default GlobalLoading;