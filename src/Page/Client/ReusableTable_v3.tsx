import {
  Box,
  GlobalStyles,
  IconButton,
  Paper,
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
} from "@mui/material";

import { useEffect, useState } from "react";
import type { IReusableTableProps } from "../../Component/Table/interface/IReusableTableProps.interface";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";

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
export default function ReusableTablev3({
  headers,
  state,
  handleSortChange,
  data,
  handleEdit,
  handleDelete,
  IdName,
}: IReusableTableProps) {
  const [selectedItems, setSelectedItems] = useState<unknown[]>([]);

  useEffect(() => {
    const valid = selectedItems.filter((id) =>
      data.some((row) => (row as any)[IdName] === id)
    );
    setSelectedItems(valid);
  }, [data]);

  /* ================= CELL RENDERER ================= */
  const renderCell = (row: any, col: any) => {
    switch (col.Key) {
      case "amountToPaid":
      return row.availmentDetailId === undefined  || row.status === "Unpaid" ? (
        <TextField
          type="number"
          size="small"
          value={row.amountToPaid ?? ""}
          onChange={(e) =>
            handleEdit?.({
              ...row,
              amountToPaid: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          fullWidth
        />
      ) : (
        String(row.amountToPaid ?? "")
      );

      case "schedulePaymentDate":
        return (
          <TextField
            type="date"
            size="small"
            value={row.schedulePaymentDate || ""}
            onChange={(e) =>
              handleEdit?.({
                ...row,
                schedulePaymentDate: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        );

      case "actualAmountPaid":
        return (
          <TextField
            type="number"
            size="small"
            value={row.actualAmountPaid ?? ""}
            onChange={(e) =>
              handleEdit?.({
                ...row,
                actualAmountPaid: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            fullWidth
          />
        );

      case "acutualDatePaid": // ✅ fixed typo
        return (
          <TextField
            type="date"
            size="small"
            value={row.actualDatePaid || ""}
            onChange={(e) =>
              handleEdit?.({
                ...row,
                actualDatePaid: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        );

      default:
        return col.render
          ? col.render(row)
          : String(row[col.Key] ?? "");
    }
  };

  /* ================= RENDER ================= */
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 250,
          borderRadius: 2,
        }}
      >
        <Table
          stickyHeader
          sx={{
            "& .MuiTableCell-root": {
              padding: "8px",
            },
          }}
        >
          {/* HEADER */}
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

              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    backgroundColor:
                      i % 2 === 0
                        ? themeColors.rowEven
                        : themeColors.rowOdd,
                  }}
                >
                  {/* CELLS */}
                  {headers.map((col, j) => (
                    <StyledTableCell key={j}>
                      {renderCell(row, col)}
                    </StyledTableCell>
                  ))}

                  {/* ACTIONS */}
                  <StyledTableCell align="center">
                    <Tooltip title="Print">
                      <IconButton
                        onClick={() => handleEdit?.(row)}
                        sx={{
                          color: "#2563eb",
                          mr: -2,
                          "&:hover": {
                            backgroundColor: "#dbeafe",
                          },
                        }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Save">
                      <IconButton
                        onClick={() => handleDelete?.(row)}
                        sx={{
                          color: "#2563eb",
                          "&:hover": {
                            backgroundColor: "#cae5fc",
                          },
                        }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell
                  colSpan={headers.length + 1}
                  align="center"
                >
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
      />
    </>
  );
}