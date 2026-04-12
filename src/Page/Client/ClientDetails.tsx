import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Icon, type AlertColor } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { useNavigate, useParams } from "react-router-dom";
import ReusableTable_v2 from "../../Component/Table/ReusableTable_v2";
import StatusBadge from "../../Component/Badge/StatusBadge";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import type { IAvailment, IClient } from "./interface/IClient";
import { clientService } from "../../Service/Client/Client";
import StatusBadgev2 from "../../Component/Badge/statusBadgev2";
import ReusableModal from "../../Component/ReusableModal/ReusableModal";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { availmentService } from "../../Service/Availment/Availment";
import { clientSchema } from "../../Shared/FormValidation/FormValidation";
import CustomSnackbar from "../../Component/Notification";
import ReusableModalv2 from "../../Component/ReusableModal/ReusableModalv2";
import ReusableTable_v3 from "./ReusableTable_v3";
import type ITableData from "../../Component/Table/interface/IReusableTableProps.interface";
import TodayIcon from '@mui/icons-material/Today';

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
    { Name: "Actual Date Paid", Key: "acutualDatePaid" },
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
  const [openEditModal, setOpenEditModal] = useState(false);
const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
const [selectedRow, setSelectedRow] = useState<any>(null);


const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  resolver: yupResolver(clientSchema),
})

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
               IdName="id"
               handleEdit={ fetchAvailmentDetails}
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
      />

      <TextField
      type="number"
        label="Interest Amount"
        fullWidth
        {...register("interestAmount")}
        error={!!errors.interestAmount}
        helperText={errors.interestAmount?.message as string || ""}
        sx={{ mt: 1 }}
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
      <TextField fullWidth label="Client Name"  sx={{height:10}}
      InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}/>
    </Box>

    {/* Field 2 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField fullWidth label="Interest Amount" type="number"InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }} />
    </Box>

    {/* Field 3 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField fullWidth label="Transaction No" type="number" InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}/>
    </Box>

    {/* Field 4 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField fullWidth label="Receivable Amount" type="number" InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }} />
    </Box>

    {/* Field 5 */}
    <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField
        fullWidth
        label="Availment Amount"
        type="number"
        InputProps={{
    readOnly: true, // ✅ prevents typing but keeps normal style
  }}
      />
    </Box>
     <Box sx={{ width: { xs: "100%", md: "48%" } }}>
      <TextField fullWidth label="Ending Balance" type="number" />
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
  <Button onClick={() => handleAddpayment()} 
  sx={{ mr:1, 
  backgroundColor: "primary.main", 
  color: "white" ,
  padding:"5px 15px", "&:hover": { backgroundColor: "primary.main" }}} 
  startIcon={<AddBoxIcon />} > Add Payment </Button> </Box>
    <ReusableTable_v3
      headers={loanHeaders}
      data={clientAvailment?.availmentDetails || []}
      state={state}
      handleSortChange={() => {}}
      handleSetPage={() => {}}
      handleSetItemPerPage={() => {}}
      handleSetSearchQuery={() => {}}
      IdName="id"
      handleEdit={() => {}}
      handleOpen={() => {}}
      handleDelete={() => {}}
      headerName="Client Management"
      addButtonName="Add Client this"
      totalPages={10}
    />
  </Paper>

</ReusableModal>
    </Box>
  );
};

export default ClientDetails;