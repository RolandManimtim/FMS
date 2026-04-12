import React, { useEffect, useState } from "react";
import { Box,IconButton,TextField, Tooltip, type AlertColor, } from "@mui/material";
import ReusableTable from "../../Component/Table/ReusableTable";
import type ITableData from "../../Component/Table/interface/IReusableTableProps.interface";
import StatusBadge from "../../Component/Badge/StatusBadge";
import { clientService, type IUpdateClient } from "../../Service/Client/Client";
import type { IUser } from "../../Interface/User/IUser.interface";
import ReusableModal from "../../Component/ReusableModal/ReusableModal";
import * as Yup from "yup";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSnackbar from "../../Component/Notification";
import { useNavigate } from "react-router";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

/* ================= HEADERS ================= */


interface CreateClient {
  clientName: string;
  address: string;
  contactNo: string;
}

interface ClientItem {
  clientID?: number;
  clientName: string;
  address: string;
  contactNo: string;
  status: boolean;
  recordCreatorByUser?: IUser;
  [key: string]: any;
}
export const clientValidation = Yup.object().shape({
  clientName: Yup.string().required("Client Name is required"),
  address: Yup.string().required("Address is required"),
  contactNo: Yup.string().required("Contact No is required"),
});

const Client: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateClient>({
    resolver: yupResolver(clientValidation),
    defaultValues: {
      clientName: "",
      address: "",
      contactNo: ""
    }
  });
 const [data, setData] = useState<ClientItem[]>([]);
const [openModal, setOpenModal] = useState(false);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [severity, setSeverity] = useState<AlertColor>("success");
const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
const [selectedRow, setSelectedRow] = useState<ClientItem | null>(null);
const [submitText, setSubmitText]  = useState<"Save" | "Update" | "Delete">("Save");
const modalTitle =
  mode === "add"
    ? "Add Client"
    : mode === "edit"
    ? "Edit Client"
    : "Delete Client";

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
    const navigate = useNavigate();


  /* ================= FETCH DATA ================= */
  const fetchClients = async () => {
    try {
      const response = await clientService.GetClientList({
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
    console.log("Edit:", row);
    setMode("edit");
  const clientItem = row as ClientItem;
  setSelectedRow(clientItem);

  // ✅ populate form
  setValue("clientName", clientItem.clientName);
  setValue("address", clientItem.address);
  setValue("contactNo", clientItem.contactNo);

  setOpenModal(true);
setSubmitText("Update");
  };

  const handleDelete = (row: ITableData) => {
    setMode("delete");
  const clientItem = row as ClientItem;
  setSelectedRow(clientItem);

  setOpenModal(true);
  setSubmitText("Delete");
  };
 

const handleCreateClient = async (data: CreateClient) => {
  try {
   const response = await clientService.CreateClient(data);

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("Client created successfully!")
    setSeverity("success")
   }
    
    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
    setOpenModal(false);
  } catch (err) {
    setSnackbarMessage(err instanceof Error ? err.message : "An error occurred")
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

const handleUpdateClient = async (data : CreateClient) => {
  try {
   const payload: IUpdateClient = {
  clientID: selectedRow!.clientID, // ✅ force not null (safe because edit mode)
  ...data,
};

   const response = await clientService.UpdateClient(payload );

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("Client updated successfully!")
    setSeverity("success")
   }
   
    setOpenModal(false);

    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
  } catch (err) {
   setSnackbarMessage(err instanceof Error ? err.message : "An error occurred")
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

const handleDeleteClient = async () => {
  try {
  

   const response = await clientService.DeleteClient(selectedRow?.clientID as number);

   if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("Client deleted successfully!")
    setSeverity("success")
   }
    setOpenModal(false);

    reset(); // ✅ clear form using RHF

    fetchClients(); // refresh table
  } catch (err) {
     setSnackbarMessage(err instanceof Error ? err.message : "An error occurred")
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

const onSubmit = async (data: CreateClient) => {
  console.log(data);
if(mode ==="add"){
    await handleCreateClient(data);
}
else if(mode === "edit"){
    await handleUpdateClient(data);
}   
else{

}
  
  reset();
  setOpenModal(false);
};

  const handleViewClientTransactions = (row: ITableData) => {

    navigate(`/ClientDetails/${row.clientID}`);
  };

const headers = [
  { Name: "Client Name", Key: "clientName" },
  { Name: "Address", Key: "address" },
  { Name: "Contact No.", Key: "contactNo" },
  {
    Name: "Status",
    Key: "status",
    render: (row : any) => <StatusBadge status={row.isActive} />,
  },
 {
  Name: "Created By",
  Key: "recordCreatorByUser",
  render: (row: any) =>
    `${row.recordCreatorByUser?.userName ?? ""}`
},
  { Name: "Created Date", Key: "recordDateCreated" },
  {
    Name: "Transaction's",
    Key: "",
    render: (row: any) => (
      <Tooltip title="Transactions">
        <IconButton
          onClick={() => handleViewClientTransactions(row)} // ✅ your handler
          sx={{
            color: "#157105", // amber color (optional)
            "&:hover": {
              backgroundColor: "#fef3c7",
            },
          }}
        >
          <ReceiptLongIcon />
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
      IdName="id"
      handleEdit={handleEdit}
      handleOpen={handleAdd}
      handleDelete={handleDelete}
      headerName="Client Management"
      addButtonName="Add Client"
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
      <b>{selectedRow?.clientName}</b>?
    </Box>
  ) : (
    <>
      {/* ✅ FORM (ADD + EDIT) */}
      <TextField
        label="Client Name"
        fullWidth
        {...register("clientName")}
        error={!!errors.clientName}
        helperText={errors.clientName?.message}
        sx={{ mt: 1 }}
      />

      <TextField
        label="Address"
        fullWidth
        {...register("address")}
        error={!!errors.address}
        helperText={errors.address?.message}
      />

      <TextField
        label="Contact No"
        fullWidth
        {...register("contactNo")}
        error={!!errors.contactNo}
        helperText={errors.contactNo?.message}
      />
    </>
  )}
  
</ReusableModal>
    </>
  );
};

export default Client;