import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Icon, type AlertColor, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate, useParams } from "react-router-dom";
import ReusableTable_v2 from "../../Component/Table/ReusableTable_v2";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import type { IAvailment, IAvailmentDetails, IClient } from "./interface/IClient";
import { clientService } from "../../Service/Client/Client";
import StatusBadgev2 from "../../Component/Badge/statusBadgev2";
import ReusableModal from "../../Component/ReusableModal/ReusableModal";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { availmentService } from "../../Service/Availment/Availment";
import { clientSchema } from "../../Shared/FormValidation/FormValidation";
import CustomSnackbar from "../../Component/Notification";
import ReusableTable_v3 from "./ReusableTable_v3";
import type ITableData from "../../Component/Table/interface/IReusableTableProps.interface";
import TodayIcon from '@mui/icons-material/Today';
import ConfirmationDialog from "../../Component/ReusableModal/ModalPromt";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import PriceChangeIcon from '@mui/icons-material/PriceChange';

interface ClientDetailsProps {
  clientId: number;
}


const ClientDetails: React.FC<ClientDetailsProps> = ( ) => {
const { clientId } = useParams<{ clientId: string }>();
 const [clientDetails, setClientDetails] = useState<IClient | null>(null);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [severity, setSeverity] = useState<AlertColor>("success");
 const [clientAvailment, setClientAvailment] = useState<IAvailment | null>(null);

const navigate = useNavigate();
  
  const handleViewClientList = () => {
    
        navigate("/ClientManagement");
  };

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
  
  console.log(setState);
  const headers = [
  { Name: "Transaction No.", Key: "transactionNo" },
  { Name: "Availment Date", Key: "availmentDate" },
  { Name: "Availment Amount", Key: "availmentAmount" },
   { Name: "Interest Amount", Key: "interestAmount" },
  {
    Name: "Status",
    Key: "status",
    render: (row : any) => <StatusBadgev2 status={row.status} />,
  }
  
];

const loanHeaders = [
  { Name: "Payment No.", Key: "rowNo" },
  { Name: "Amount to Paid", Key: "amountToPaid" },
  { Name: "Schedule Payment Date", Key: "schedulePaymentDate" },
   { Name: "Actual Amount Paid", Key: "actualAmountPaid" },
    { Name: "Actual Date Paid", Key: "actualDatePaid" },
  {
  Name: "Is Overdue", 
  Key: "isOverDue",
  render: (row: any) => (row.isOverDue ? "Yes" : "No"),
},
  {
    Name: "Status",
    Key: "status",
    render: (row : any) => <StatusBadgev2 status={row.status} />,
  }
  
];

 const fetchClients = async () => {
    try {
      const response = await clientService.ClientDetails(clientId as unknown as number);
console.log("API RESPONSE:", response);
      setClientDetails(response);

    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchClients();
  }, [clientId]);

  const [openModal, setOpenModal] = useState(false);
  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
const [selectedRow, setSelectedRow] = useState<any>(null);
const [selectedRow2, setSelectedRow2] = useState<IAvailmentDetails | null>(null);
const [topUpAmount, setTopUpAmount] = useState(0);
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
  watch, setValue, 
} = useForm({
  resolver: yupResolver(clientSchema),
})

const availmentAmount = watch("availmentAmount");
console.log(setMode);
const onSubmit = async (data: any) => {
  try {
    const payload = {
      ...data,
      clientId: Number(clientId), // ✅ attach clientId here
    };

    console.log("Submitting payload:", payload);
    const response = await availmentService.CreateAvailment(payload);
   
      if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("Client created successfully!")
    setSeverity("success")
    reset(); // ✅ reset form after successful submission
   }
    setOpenModal(false);
    fetchClients();
     // ✅ reset form after submission
  } catch (err) {
     setSnackbarMessage(err instanceof Error ? err.message : "An error occurred")
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

useEffect(() => {
  if (openModal) {
    reset({
      availmentDate: "",
      availmentAmount: undefined,
      interestAmount: undefined,
    });
  }
}, [openModal, reset]);


const fetchAvailmentDetails = async (row: ITableData) => {
    try {
console.log("Selected Row:", row);
      setSelectedRow(row);
      const response = await availmentService.AvailmentDetails(row.availemntID as number);
console.log("API RESPONSEDetails:", response);
if(response)
  {
setClientAvailment(response);
setOpenEditModal(true);
  }


    } catch (err) {
      console.error(err);
    } 
  };

  const handleAddpayment = async () => {
    try {
setClientAvailment((prev: any) => {
      const currentDetails = prev?.availmentDetails || [];

      const nextRowNo =
        currentDetails.length > 0
          ? Math.max(...currentDetails.map((x: any) => x.rowNo || 0)) + 1
          : 1;

      const newRow = {
        rowNo: nextRowNo, // ✅ auto increment
        amountToPaid: 0,
        schedulePaymentDate: "",
        actualAmountPaid: undefined,
        actualDatePaid: "",
        isOverDue: false,
        status: "Unpaid",
      };

      return {
        ...prev,
        availmentDetails: [...currentDetails, newRow],
      };
    });
    } catch (err) {
      console.error(err);
    } 
  };

const [openConfirm, setOpenConfirm] = useState(false);
const [openValidationDialog, setOpenValidationDialog] = useState(false);
const [missingFields, setMissingFields] = useState<string[]>([]);
  const handleOpenEdit = async (payment: any) => {
    const missingFields: string[] = [];

  if (!payment.schedulePaymentDate) {
    missingFields.push("Schedule Payment Date");
  }

  if (!payment.actualAmountPaid || payment.actualAmountPaid <= 0) {
    missingFields.push("Actual Amount Paid");
  }

  if (
    !payment.actualDatePaid ||
    payment.actualDatePaid === "0001-01-01"
  ) {
    missingFields.push("Actual Date Paid");
  }

   if (missingFields.length > 0) {
     setMissingFields(missingFields);
  setOpenValidationDialog(true);
    return;
  }
    setSelectedRow2(payment);
setOpenConfirm(true)
};


const handleConfirmSave = async (payment: IAvailmentDetails) => {

 const updatedPayment: IAvailmentDetails = {
    ...payment,
    availmentId:
      payment.availmentId ??
      clientAvailment?.availmentDetails?.[0]?.availmentID,
  };
  console.log("Payment to be saved:", updatedPayment,clientAvailment?.availmentDetails?.[0]);
  setOpenConfirm(false);

   try {  
    const response = await availmentService.CreatePayment(updatedPayment);

    if (response.success) {
      // Success message
      console.log("Payment created successfully.");
      fetchAvailmentDetails(selectedRow as ITableData); // Refresh the availment details
      setSnackbarOpen(true);
      setSnackbarMessage("Payment successfully saved")
      setSeverity("success")
    }
  } catch (error) {
    console.error(error);
     setSnackbarOpen(true);
      setSnackbarMessage(error instanceof Error ? error.message : "An error occurred")
      setSeverity("error")
  }
};

const handleEdit = (updatedRow: IAvailmentDetails) => {
  setClientAvailment(prev => {
    if (!prev || !prev.availmentDetails) return prev;

    return {
      ...prev,
      availmentDetails: prev.availmentDetails.map(item =>
        item.availmentDetailId === updatedRow.availmentDetailId
          ? updatedRow
          : item
      ),
    };
  });
};

useEffect(() => {
    console.log("Amount:", availmentAmount);
  const amount = Number(availmentAmount) || 0;

  // 20% interest
  const interest = amount * 0.2;

  setValue("interestAmount", interest);
}, [availmentAmount, setValue]);


const handleSaveLoanAdjustment = async (amount: any) => {
  try {
    console.log("Top up Amount:", amount);
    const payload = {
      topUpAmount: Number(amount),
      availmentID: Number(clientAvailment?.availmentDetails?.[0]?.availmentID,), // ✅ attach availmentID here
    };

  console.log("Submitting payload:", payload);
    const response = await availmentService.TopUp(payload);
   
      if(response.success){
    setSnackbarOpen(true);
    setSnackbarMessage("Top-up successfully!")
    setSeverity("success")
    fetchAvailmentDetails(selectedRow as ITableData); // Refresh the availment details
   }
    setOpenTopUpModal(false);
     // ✅ reset form after submission
  } catch (err) {
     setSnackbarMessage(err instanceof Error ? err.message : "An error occurred")
    setSeverity("error")
    setSnackbarOpen(true);
  }
};

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  severity={severity}
  onClose={() => setSnackbarOpen(false)}
/>
      {/* Right aligned button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={handleViewClientList}
          sx={{ backgroundColor: "primary.main", color: "white" }}
          startIcon={<MoreVertIcon />}
        >
          View Client List
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
        sx={{
          display: "flex",
          justifyContent:"flex-start",
          flexDirection:"row",
          gap:1,
        }}>
        <Icon ><PermIdentityIcon fontSize="medium" /></Icon>
        <Typography variant="h6" mb={2}>
          Client Information
        </Typography>
        </Box>

        {/* Flex container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* 2 columns */}
          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
            <TextField 
            fullWidth 
            label="Client Name" 
            value={clientDetails?.clientName || ""}
             InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}
            />
          </Box>

          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
            <TextField  
            fullWidth 
            label="Address" 
            value={clientDetails?.address || ""} 
                     InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}
            />
          </Box>

          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
            <TextField  fullWidth
             label="Contact No."
              value={clientDetails?.contactNo || ""} 
                       InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}
              />
          </Box>

          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
            <TextField 
             fullWidth 
             label="Status"
              value={clientDetails?.status ? "Active" : "In Active"} 
                       InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}
              />
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
            mt: 3,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
  sx={{
    mb: 2,
    display: "flex",              // ✅ make it flex
    justifyContent: "space-between",
    alignItems: "center",         // optional (vertical alignment)
  }}
>
  <Box
  sx={{display:"flex",
    flexDirection:"row",
    gap:1,
  }}>
  <Icon><BusinessCenterIcon /></Icon>
  <Typography variant="h6">
    Transaction History
  </Typography>
</Box>
<Box >
  <Button
 onClick={() => setOpenModal(true)}
    sx={{ mr:1, backgroundColor: "primary.main", color: "white" ,padding:"5px 15px", "&:hover": { backgroundColor: "primary.main" }}}
    startIcon={<AddBoxIcon />}
  >
    Add Loan
  </Button>
   
  </Box>
</Box>
        {/* Flex container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap"
          }}
        >
         <ReusableTable_v2
               headers={headers}
               data={clientDetails?.availment || []}
               state={state}
               handleSortChange={() => {}}
               handleSetPage={() => {}}
               handleSetItemPerPage={() => {}}
               handleSetSearchQuery={() => {}}
               handleEdit={(row) => {fetchAvailmentDetails(row)}}
               IdName="id"
               handleOpen={() => {}}
               handleDelete={() => {}}
               headerName="Client Management"
               addButtonName="Add Client"
         totalPages={10}/>
        </Box>
      </Paper>

        <ReusableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSubmit={
      handleSubmit(onSubmit)
  }
  title={"Add Loan"}
  submitText={"Save"}
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
      type="date"
        label="Availment Date"
        fullWidth
        {...register("availmentDate")}
        error={!!errors.availmentDate}
        helperText={errors.availmentDate?.message as string || ""}
        sx={{ mt: 1 }}
         InputLabelProps={{
    shrink: true, // ✅ forces label to stay above
  }}
      />


      <TextField
  type="number"
  label="Availment Amount"
  fullWidth
  {...register("availmentAmount")}
  error={!!errors.availmentAmount}
  helperText={errors.availmentAmount?.message as string || ""}
   sx={{ mt: 1 }}
         InputLabelProps={{
    shrink: true, // ✅ forces label to stay above
  }}
  
/>

      <TextField
  type="number"
  label="Interest Amount"
  fullWidth
  {...register("interestAmount")}
  InputProps={{
    readOnly: true,
  }}
  error={!!errors.interestAmount}
  helperText={errors.interestAmount?.message as string || ""}
  sx={{ mt: 1 }}
         InputLabelProps={{
    shrink: true, // ✅ forces label to stay above
  }}
/>

      
    </>
  )}
  
</ReusableModal>

      <ReusableModal
  open={openEditModal}
  onClose={() => setOpenEditModal(false)}
  onSubmit={
      handleSubmit(onSubmit)
  }
  title={"Loan Information"}
  submitText={"Save"}
  width="xl"
  hideSubmitButton={true}
>
  <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
   
    <Box display="flex" flexWrap="wrap" gap={2}>
    
    {/* Field 1 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
  fullWidth
  label="Client Name"
  value={
    clientAvailment?.client || ""
  }
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>  

    </Box>

    {/* Field 2 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField
  fullWidth
  label="Interest Amount"
  value={
    clientAvailment?.interestAmount != null
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        }).format(clientAvailment.interestAmount)
      : ""
  }
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>
    </Box>

    {/* Field 3 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField 
      fullWidth 
      label="Transaction No"
       type="text" 
       value={clientAvailment?.transactionNo}  
       InputProps={{
          readOnly: true, // ✅ prevents typing but keeps normal style
      }}  
      InputLabelProps={{
        shrink: true,
      }}  
  />
    </Box>

    {/* Field 4 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
         <TextField
  fullWidth
  label="Receivable Amount"
  value={
    clientAvailment?.availmentAmount != null
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        }).format(clientAvailment.availmentAmount + (clientAvailment?.interestAmount || 0)  )
      : ""
  }
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>
    </Box>

    {/* Field 5 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
     <TextField
  fullWidth
  label="Availment Amount"
  value={
    clientAvailment?.availmentAmount != null
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        }).format(clientAvailment.availmentAmount)
      : ""
  }
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>
    </Box>
     <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <TextField
  fullWidth
  label="Ending Balance"
  value={
    clientAvailment?.endingBalance != null
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        }).format(clientAvailment.endingBalance)
      : ""
  }
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>
    </Box>

  </Box>
  
  </Paper>
   <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
    <Box display={"flex"} justifyContent={"right"} mb={2}>
      {/* Optional Button */}
    </Box>
<Box display={"flex"} justifyContent={"space-between"} mb={2}>
  <Box display={"flex"} flexDirection={"row"}>
  <TodayIcon  />
  <Typography fontWeight={600}>
    Payment Schedule
  </Typography>
  </Box> 
  <Box>
  <Button onClick={() => setOpenTopUpModal(true)} 
  sx={{ mr:1, 
  backgroundColor: "primary.main", 
  color: "white" ,
  padding:"5px 15px", "&:hover": { backgroundColor: "primary.main" }}} 
  startIcon={<PriceChangeIcon />} > Top up </Button>
  <Button onClick={() => handleAddpayment()} 
  sx={{ mr:1, 
  backgroundColor: "primary.main", 
  color: "white" ,
  padding:"5px 15px", "&:hover": { backgroundColor: "primary.main" }}} 
  startIcon={<AddBoxIcon />} > Add Payment </Button></Box> </Box>
    <ReusableTable_v3
      headers={loanHeaders}
      data={clientAvailment?.availmentDetails || []}
      state={state}
      handleSortChange={() => {}}
      handleSetPage={() => {}}
      handleSetItemPerPage={() => {}}
      handleSetSearchQuery={() => {}}
      IdName="id"
      handleEdit={handleEdit}
      handleSave={handleOpenEdit}
      handleOpen={() => {}}
      handleDelete={() => {}}
      headerName="Client Management"
      addButtonName="Add Client this"
      totalPages={10}
    />
  </Paper>

</ReusableModal>

<ConfirmationDialog
  open={openConfirm}
  title="Save Payment"
  message="Are you sure you want to save this payment?"
  confirmText="Save"
  cancelText="Cancel"
  onConfirm={() => handleConfirmSave(selectedRow2 as IAvailmentDetails)}
  onCancel={() => setOpenConfirm(false)}
/>
<ConfirmationDialog
  open={openConfirm}
  title="Save Payment"
  message="Are you sure you want to save this payment?"
  confirmText="Save"
  cancelText="Cancel"
  onConfirm={() => handleConfirmSave(selectedRow2 as IAvailmentDetails)}
  onCancel={() => setOpenConfirm(false)}
/>

<Dialog
  open={openValidationDialog}
  onClose={() => setOpenValidationDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ pb: 1 }}>
    <Box display="flex" alignItems="center" gap={1.5}>
      <WarningAmberRoundedIcon
        sx={{
          color: "#f59e0b",
          fontSize: 34,
        }}
      />

      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Validation Required
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Please complete the required fields before saving.
        </Typography>
      </Box>
    </Box>
  </DialogTitle>

  <DialogContent dividers>
    <List dense>
      {missingFields.map((field) => (
        <ListItem key={field}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ErrorOutlineRoundedIcon
              color="error"
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText primary={field} />
        </ListItem>
      ))}
    </List>
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button
      variant="contained"
      onClick={() => setOpenValidationDialog(false)}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

 <ReusableModal
  open={openTopUpModal}
  onClose={() => setOpenModal(false)}
  onSubmit={() => handleSaveLoanAdjustment(topUpAmount)}
  title={"Loan Adjustment"}
  submitText={"Save"}
>


      <TextField
  type="number"
  label="Top up Amount"
  fullWidth
   sx={{ mt: 1 }}
         InputLabelProps={{
    shrink: true, // ✅ forces label to stay above
  }}
    onChange={(e) => setTopUpAmount(Number(e.target.value))}
/>

</ReusableModal>
    </Box>
  );
};



export default ClientDetails;