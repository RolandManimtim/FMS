import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  type AlertColor,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import illustration from "../../assets/Illustration.png";
import type { ILogin } from "../../Interface/Login/ILogin.interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import CustomSnackbar from "../../Component/Notification";
import { getErrorMessage } from "../../Shared/Utils/ErrorMessage";
import { loginService } from "../../Service/Login/Login";

const LoginPage: React.FC = () => {

const [loading, setLoading] = useState(false);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [severity, setSeverity] = useState<AlertColor>("success");

useEffect(() => {
    document.title = "FMS | Login";
  }, []);

const validation = Yup.object().shape({
  username: Yup.string().required("Username is Required"),
  password: Yup.string().required("Password is Required"),
});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({ resolver: yupResolver(validation) });

const handleLogin = async (form: ILogin) => {
    try{
        setLoading(true);
        const result = await loginService.login(form);

    console.log("LOGIN SUCCESS:", result?.data);
    if(result?.data){
        handleShow();
        setSnackbarMessage("Login successful!")
        setSeverity("success")
        
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userName", result.data.userName);
        setTimeout(() => {
          window.location.href = "/dashboard";
       }, 1000);
       
    }
    
    }
    catch (err :any){
      console.log(err, "login error");
 setSnackbarMessage(getErrorMessage(err.errorMessage as unknown as string))
     setSeverity("error")
     setSnackbarOpen(true);
    }
    finally{
setLoading(false);
    }
 
  };

  const handleShow = () => setSnackbarOpen(true);
const handleClose = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #3f51ff 0%, #eaeefa 100%)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
        <CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  severity={severity}
  onClose={handleClose}
/>
      <Box
        sx={{
          width: "900px",
          height: "520px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          backgroundColor: "#fff",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#f7f7f7",
          }}
        >
          <Typography justifyContent={"center"} variant="h5" fontWeight={600} mb={3}>
            Login
          </Typography>
<form onSubmit={handleSubmit(handleLogin)}>
         <TextField
  placeholder="Username or email"
  fullWidth
  variant="outlined"
  {...register("username")}
  error={!!errors.username}
  helperText={errors.username?.message}
  sx={{ mb: 2, backgroundColor: "#e9edf5", borderRadius: 2 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EmailOutlinedIcon />
      </InputAdornment>
    ),
  }}
/>

<TextField
  placeholder="Password"
  type="password"
  fullWidth
  variant="outlined"
  {...register("password")}
  error={!!errors.password}
  helperText={errors.password?.message}
  sx={{ mb: 1, backgroundColor: "#e9edf5", borderRadius: 2 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockOutlinedIcon />
      </InputAdornment>
    ),
  }}
/>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography fontSize={12}>Remember me</Typography>}
            />

            <Typography
              fontSize={12}
              sx={{ cursor: "pointer", color: "#3f51ff" }}
            >
              Forgot password?
            </Typography>
          </Box>

        <Button
  type="submit"
  fullWidth
  variant="contained"
  disabled={loading}
  sx={{
    py: 1.5,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    background: "linear-gradient(90deg, #3f51ff, #5a6bff)",
  }}
>
  {loading ? (
    <CircularProgress size={20} sx={{ color: "white" }} />
  ) : (
    "Login"
  )}
</Button>
</form>
          <Typography mt={4} fontSize={12} textAlign="center">
            Don’t have an account?{" "}
            <span style={{ color: "#3f51ff", cursor: "pointer" }}>
              Sign up
            </span>
          </Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#eef1f7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            textAlign: "center",
          }}
        >
         <Box
            position={"absolute"}
            component="img"
            src={illustration}
            alt="illustration"
            sx={{ width: 550 ,mb:25}}
        />
        <Box mt={20}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Financial Management System
          </Typography>

          <Typography fontSize={13} color="text.secondary" mb={3}>
            Monitor your data, analytics and performance easily.
          </Typography>
        </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ width: 30, height: 4, backgroundColor: "#3f51ff", borderRadius: 2 }} />
            <Box sx={{ width: 30, height: 4, backgroundColor: "#cfd8ff", borderRadius: 2 }} />
            <Box sx={{ width: 30, height: 4, backgroundColor: "#cfd8ff", borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
