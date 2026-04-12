
import {
  Box,
  Button,
  GlobalStyles,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";


import { useCallback, useEffect, useState } from "react";
import { debounce } from "@mui/material/utils";
import type { IReusableTableProps } from "./interface/IReusableTableProps.interface";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import AddBoxIcon from '@mui/icons-material/AddBox';

/* ================= THEME CONSTANTS ================= */
const themeColors = {
  primary: "#3f51ff",
  background: "#f8fafc",
  tableHeader: "#1e293b",
  rowEven: "#f1f5f9",
  rowOdd: "#ffffff",
  border: "#e2e8f0",
};

/* ================= STYLES ================= */
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: themeColors.tableHeader,
    color: "#fff",
    fontWeight: "bold",
    fontSize: "12px",
  },
  [`&.${tableCellClasses.body}`]: {
    color: "#334155",
  },
}));



/* ================= COMPONENT ================= */
export default function ReusableTable({
  headers,
  state,
  handleSortChange,
  handleSetPage,
  data,
  handleSetItemPerPage,
  handleSetSearchQuery,
  handleEdit,
  handleOpen,
  handleDelete,
  addButtonName,
  totalPages,
  IdName,
  
}: IReusableTableProps) {
  const clientHeight = document.documentElement.clientHeight;

  const [selectedItems, setSelectedItems] = useState<unknown[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const debouncedSearch = useCallback(
    debounce(handleSetSearchQuery, 500),
    []
  );

  /* ================= HANDLERS ================= */
 
  useEffect(() => {
    const valid = selectedItems.filter((id) =>
      data.some((row) => row[IdName] === id)
    );

    setSelectedItems(valid);
  }, [data]);

  const startEntry = (state.pageNumber - 1) * state.pageSize + 1;

const endEntry = Math.min(
  state.pageNumber * state.pageSize,
  state.recordsTotal
);
  /* ================= RENDER ================= */
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />

      {/* HEADER */}
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
    mb: 2,
  }}
>


  <Button onClick={handleOpen} 
  sx={{ backgroundColor: themeColors.primary, color:"white", 
  fontSize:14,padding:"5px 15px", "&:hover": 
  { backgroundColor: themeColors.primary } }} startIcon={<AddBoxIcon />}>
    {addButtonName}
  </Button>
</Box>
      {/* TOP CONTROLS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
         <Box display="flex" alignItems="center">
          <Typography>Show</Typography>

          <Select
            size="small"
            value={state.pageSize}
            onChange={handleSetItemPerPage}
            sx={{ mx: 1 }}
          >
            {[10, 25, 50, 100].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* SEARCH */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography >{"Search:"}</Typography>

          <TextField
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />

        </Box>

      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: clientHeight - 300,
          borderRadius: 2,
        }}
      >
        <Table stickyHeader   sx={{
    "& .MuiTableCell-root": {
      padding: "8px", // or 0
    },
  }}>
          <TableHead>
  <TableRow>
    {headers.map((head, i) => (
      <TableCell key={i}>
        <TableSortLabel
          active={state.columnToSort === head.Name}
          direction={state.orderBy}
          onClick={() => handleSortChange(head.Name)}
        >
          {head.Name}
        </TableSortLabel>
      </TableCell>
    ))}

    {/* ✅ ACTION COLUMN */}
    <TableCell align="center" sx={{ fontWeight: "bold" }}>
      Action
    </TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {data.length > 0 ? (
    data.map((row, i) => (
      <TableRow
        key={i}
        sx={{
          backgroundColor:
            i % 2 === 0 ? themeColors.rowEven : themeColors.rowOdd,
        }}
      >
        {headers.map((col, j) => (
          <StyledTableCell key={j}>
            {col.render
              ? col.render(row)   // ✅ custom render (StatusBadge)
              : String(row[col.Key])}
          </StyledTableCell>
        ))}

        {/* ACTION */}
        <StyledTableCell align="center">
          
          <Tooltip title="Edit">
  <IconButton
    onClick={() => handleEdit?.(row)}
    sx={{
      color: "#2563eb", // blue
      mr: -2,
      "&:hover": {
        backgroundColor: "#dbeafe",
      },
    }}
  >
    <EditSquareIcon />
  </IconButton>
</Tooltip>
<Tooltip title="Delete">
  <IconButton
    onClick={() => handleDelete?.(row)}
    sx={{
      color: "#dc2626", // red
      "&:hover": {
        backgroundColor: "#fee2e2",
      },
    }}
  >
    <FolderDeleteIcon />
  </IconButton>
  </Tooltip>
  
</StyledTableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <StyledTableCell colSpan={headers.length + 1} align="center">
        No Data
      </StyledTableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>

      {/* FOOTER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          flexWrap: "wrap",
        }}
      >
       <Box>
  <Typography>
    {`Showing ${data.length === 0 ? 0 : startEntry} to ${endEntry} of ${state.recordsTotal} entries`}
  </Typography>
</Box>
         <Pagination
          page={totalPages}
          variant='outlined'
          shape='circular'
          count={totalPages}
          sx={{ mb: { xs: 2, md: 0 } }}
          onChange={(_, value) => handleSetPage(value)}
        />
      </Box>
    </>
  );
}