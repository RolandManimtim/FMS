import React, { useEffect, useState } from "react";
import { Box, TextField, type AlertColor, } from "@mui/material";
import ReusableTable from "../../Component/Table/ReusableTable";
import type ITableData from "../../Component/Table/interface/IReusableTableProps.interface";
import StatusBadge from "../../Component/Badge/StatusBadge";
import ReusableModal from "../../Component/ReusableModal/ReusableModal";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSnackbar from "../../Component/Notification";
import { userService } from "../../Service/User/User";
import type { IUserDetails } from "./interface/IUser.interface";
import { getErrorMessage } from "../../Shared/Utils/ErrorMessage";
import LockResetIcon from '@mui/icons-material/LockReset';
/* ================= HEADERS ================= */
import { IconButton, Tooltip } from "@mui/material";
import { userValidation } from "../../Shared/FormValidation/FormValidation";

const User: React.FC = () => {

 const [data, setData] = useState<IUserDetails[]>([]);
const [openModal, setOpenModal] = useState(false);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [severity, setSeverity] = useState<AlertColor>("success");
const [mode, setMode] = useState<"add" | "edit" | "delete" | "changePassword">("add");
const [selectedRow, setSelectedRow] = useState<IUserDetails | null>(null);
const [submitText, setSubmitText]  = useState<"Save" | "Update" | "Delete">("Save");

  const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm<IUserDetails>({
  resolver: yupResolver(userValidation) as any,
  context: { mode }, // ✅ THIS is passed to Yup
  defaultValues: {
    userName: "",
    email: "",
    hashPassword: "",
    confirmPassword: "",
  },
});

const modalTitle =
  mode === "add"
    ? "Add User"
    : mode === "edit"
    ? "Edit User":
    mode === "changePassword"
    ? "Change Password"
    : "Delete User";

  // table state
  const [state, setState] = useState({
    pageNumber: 1,
    pageSize: 10,
    columnToSort: "name",
    orderBy: "asc" as "asc" | "desc",
    searchQuery: "",
    pageCount: 1,
    recordsTotal: 0,
    recordsFiltered: 0,
  });

  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);



  /* ================= FETCH DATA ================= */
  const fetchClients = async () => {
    try {
      const response = await userService.GetUserList({
        draw: 1,
        start: (state.pageNumber - 1) * state.pageSize,
        length: state.pageSize,
        search: search,
      });

      // ⚠️ adjust based on your API response
      const result = response.data;
      console.log("API RESPONSE:", response);

      setData(result || []);
      const newTotalPages = Math.ceil(response.recordsFiltered / state.pageSize);
      console.log("Calculated Total Pages:", response.data.length);
      setTotalPages(newTotalPages);
      setState((prev) => ({ ...prev, pageCount: response.data.length, 
        recordsTotal: response.recordsTotal, recordsFiltered: response.recordsFiltered , }));
    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchClients();
  }, [state.pageNumber, state.pageSize, search]);
  /* ================= HANDLERS ================= */
  const handleSortChange = (column: string) => {
    setState((prev) => ({
      ...prev,
      columnToSort: column,
      orderBy: prev.orderBy === "asc" ? "desc" : "asc",
    }));
  };

  const handleSetPage = (page: number) => {
    setState((prev) => ({ ...prev, pageNumber: page }));
  };

  const handleSetItemPerPage = (event: any) => {
    setState((prev) => ({
      ...prev,
      pageSize: event.target.value,
    }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setState((prev) => ({ ...prev, searchQuery: value, pageNumber: 1 }));
  };

  const handleAdd = () => {
  setMode("add");
  setSelectedRow(null);
  reset(); // clear form
  setOpenModal(true);
  setSubmitText("Save");
  };

  const handleEdit = (row: ITableData) => {
   
    setMode("edit");
  const userItem = row as unknown as IUserDetails;
  setSelectedRow(userItem);

  // ✅ populate form
  setValue("userName", userItem.userName);
  setValue("email", userItem.email);
  setValue("hashPassword", "");
  setValue("confirmPassword", "");

  setOpenModal(true);
  setSubmitText("Update");
  };

const handlePasswordReset = (row: ITableData) => {
   
    setMode("changePassword");
  const userItem = row as unknown as IUserDetails;
  setSelectedRow(userItem);

  // ✅ populate form
  setValue("userName", userItem.userName);
  setValue("email", userItem.email);
  setValue("hashPassword", "");
  setValue("confirmPassword", "");

  setOpenModal(true);
  setSubmitText("Update");
  };

  const handleDelete = (row: ITableData) => {
    setMode("delete");
  const clientItem = row as unknown as IUserDetails;
  setSelectedRow(clientItem);

  setOpenModal(true);
  setSubmitText("Delete");
  };
 

const handleCreateClient = async (data: IUserDetails) => {
  try {
   const response = await userService.CreateUser(data);

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("User created successfully!")
    setSeverity("success")
   }
   else{
    setSnackbarMessage("Failed to create user.")
    setSeverity("error")
    setSnackbarOpen(true);
   }
    

    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
    setOpenModal(false);
  } catch (err) {
    console.error(err);
  }
};

const handleUpdateClient = async (data : IUserDetails) => {
  try {
   const payload: IUserDetails = {
  id: selectedRow!.id, // ✅ force not null (safe because edit mode)
  ...data,
};

   const response = await userService.UpdateUser(payload );

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("User updated successfully!")
    setSeverity("success")
   }
   else{
    setSnackbarMessage("Failed to update user.")
    setSeverity("error")
    setSnackbarOpen(true);
   }
    setOpenModal(false);

    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteClient = async () => {
  try {
   const response = await userService.DeleteUser(selectedRow?.id as number);

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("User deleted successfully!")
    setSeverity("success")
   }

    setOpenModal(false);

    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
  } catch (err) {
    setSnackbarMessage(getErrorMessage(err))
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

const onSubmit = async (data: IUserDetails) => {
  console.log(data);
if(mode ==="add"){
    await handleCreateClient(data);
}
else if(mode === "edit" || mode === "changePassword"){
    await handleUpdateClient(data);
}   
else{

}
  
  reset();
  setOpenModal(false);
};

const headers = [
  { Name: "UserName", Key: "userName" },
  { Name: "Email", Key: "email" },
  {
    Name: "Status",
    Key: "status",
    render: (row: any) => <StatusBadge status={row.isActive} />,
  },
  {
    Name: "Password Reset",
    Key: "passwordReset",
    render: (row: any) => (
      <Tooltip title="Change Password">
        <IconButton
          onClick={() => handlePasswordReset(row)} // ✅ your handler
          sx={{
            color: "#f59e0b", // amber color (optional)
            "&:hover": {
              backgroundColor: "#fef3c7",
            },
          }}
        >
          <LockResetIcon />
        </IconButton>
      </Tooltip>
    ),
  },
];

  return (
    <>
<CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  severity={severity}
  onClose={() => setSnackbarOpen(false)}
/>
    <Box>
    <ReusableTable
      headers={headers}
      data={data}
      state={state}
      handleSortChange={handleSortChange}
      handleSetPage={handleSetPage}
      handleSetItemPerPage={handleSetItemPerPage}
      handleSetSearchQuery={handleSearch}
      IdName="userId"
      handleEdit={handleEdit}
      handleOpen={handleAdd}
      handleDelete={handleDelete}
      headerName="User Management"
      addButtonName="Add User"
      totalPages={totalPages}
    />
    </Box>
  <ReusableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSubmit={
    mode === "delete"
      ? () => selectedRow && handleDeleteClient()
      : handleSubmit(onSubmit)
  }
  title={modalTitle}
  submitText={submitText}
>
 {/* ✅ DELETE VIEW */}
  {mode === "delete" ? (
    <Box>
      Are you sure you want to delete{" "}
      <b>{selectedRow?.userName}</b>?
    </Box>
  ) : (
    <>
      {/* ✅ FORM (ADD + EDIT) */}
      <TextField
        label="Email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mt: 1,  display: mode === "edit" || mode === "add" ? "block" : "none",}}
      />

      <TextField
        label="User Name"
        fullWidth
          inputProps={{
    autoComplete: "user-name",
    form: {
      autoComplete: "off",
    },
  }}
        {...register("userName")}
        error={!!errors.userName}
        helperText={errors.userName?.message}
        sx={{  display: mode === "edit" || mode === "add" ? "block" : "none",}}
      />

      <TextField
      
  type="password"
  label="New Password"
  fullWidth
  inputProps={{
    autoComplete: "new-password",
    form: {
      autoComplete: "off",
    },
   
  }}

  {...register("hashPassword")}
  error={!!errors.hashPassword}
  helperText={errors.hashPassword?.message}
sx={{  display: mode === "add" || mode === "changePassword" ? "block" : "none",}}
/>
      <TextField
        type="password"
        label="Confirm New Password"
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{  display: mode === "add" || mode === "changePassword" ? "block" : "none",}}
      />
    </>
  )}
  
</ReusableModal>
    </>
  );
};

export default User;