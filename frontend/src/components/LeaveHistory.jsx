import { useState, useEffect } from 'react';

import api from '../api/client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from '@mui/material';

export default function LeaveHistory() {

  // ─── States ─────────────────────────────────────
  const today = new Date()
  .toISOString()
  .split('T')[0];

  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0];
  const [loading, setLoading] = useState(false);

  const [leaves, setLeaves] = useState([]);

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(nextMonth);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  // ─── Fetch Leave History ────────────────────────

  async function fetchLeaves() {

    try {

      setLoading(true);

      const res = await api.get(
        '/leave-history',
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      setLeaves(res.data);

      setPage(0);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Unable to fetch leave history'
      );

    } finally {

      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchLeaves();
  },[])
  // ─── Pagination ─────────────────────────────────

  const handleChangePage = (
    event,
    newPage
  ) => {

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    
    setRowsPerPage(
      parseInt(event.target.value, 10)
    );

    setPage(0);
  };
console.log(leaves);
  // ─── Component ──────────────────────────────────

  return (
    <div className="card">

      <h2>Leave History</h2>

      {/* Filters */}

      <div className="filter-row">

        <input
          type="date"
          value={startDate}
          onClick={(e) => e.target.showPicker()}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
        />

        <input
          type="date"
          value={endDate}
          onClick={(e) => e.target.showPicker()}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
        />

        <button onClick={fetchLeaves}>
          Search
        </button>

      </div>

      {/* Table */}

      <TableContainer component={Paper}>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Start Date
              </TableCell>

              <TableCell>
                End Date
              </TableCell>

              <TableCell>
                Reason
              </TableCell>

              {/* <TableCell>
                Status
              </TableCell> */}

            </TableRow>

          </TableHead>

          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell colSpan={4}>
                  Loading...
                </TableCell>

              </TableRow>

            ) : leaves?.leaves?.length > 0 ? (

              leaves
                ?.leaves?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage +
                  rowsPerPage
                )
                .map((leave) => (

                  <TableRow
                    key={leave.id}
                  >

                    <TableCell>
                      {leave.formatted_start_date}
                    </TableCell>

                    <TableCell>
                      {leave.formatted_end_date}
                    </TableCell>

                    <TableCell>
                      {leave.reason || '-'}
                    </TableCell>

                    {/* <TableCell>

                      <span
                        className={`status-badge status-${leave.status}`}
                      >
                        {leave.status}
                      </span>

                    </TableCell> */}

                  </TableRow>

                ))

            ) : (

              <TableRow>

                <TableCell colSpan={4}>
                  No leave history found
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

        {/* Pagination */}

        <TablePagination

          component="div"

          count={leaves?.leaves?.length}

          page={page}

          onPageChange={
            handleChangePage
          }

          rowsPerPage={
            rowsPerPage
          }

          onRowsPerPageChange={
            handleChangeRowsPerPage
          }

          rowsPerPageOptions={[
            5,
            10,
            20,
          ]}

        />

      </TableContainer>

    </div>
  );
}