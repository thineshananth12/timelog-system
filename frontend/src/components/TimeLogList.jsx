import { useState,useEffect } from 'react';

import api from '../api/client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';

export default function TimeLogList() {

  // ─── States ─────────────────────────────────────
const today = new Date()
  .toISOString()
  .split('T')[0];
  const [date, setDate] = useState(today);

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  // ─── Fetch Logs ─────────────────────────────────

  async function fetchLogs() {

    if (!date) {

      alert('Please select date');

      return;
    }

    try {

      setLoading(true);

      const res = await api.get('/time-logs', {
        params: {
          date,
        },
      });

      setLogs(res.data);

      setPage(0);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Unable to fetch logs'
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    fetchLogs(today);

 }, []);
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

  // ─── Component ──────────────────────────────────
console.log(logs?.length);
  return (
    <div className="card">

      <h2>View Time Logs</h2>

      {/* Filter */}

      <div className="filter-row">

        <input
          type="date"
          onClick={(e) => e.target.showPicker()}
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button onClick={fetchLogs}>
          Search
        </button>

      </div>

      {/* Table */}

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Project
              </TableCell>

              <TableCell>
                Task Description
              </TableCell>

              <TableCell>
                Hours
              </TableCell>

              <TableCell>
                Date
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={4}
                >
                  Loading...
                </TableCell>

              </TableRow>

            ) : logs?.length > 0 ? (

              logs
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage +
                  rowsPerPage
                )
                .map((log) => (

                  <TableRow
                    key={log?.id}
                  >

                    <TableCell>
                      {log?.project?.name}
                    </TableCell>

                    <TableCell>
                      {
                        log?.task_description
                      }
                    </TableCell>

                    <TableCell>
                      {log?.hours}h{' '}
                      {log?.minutes}m
                    </TableCell>

                    <TableCell>
                      {log?.formatted_work_date}
                    </TableCell>

                  </TableRow>

                ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={4}
                >
                  No records found
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

        {/* Pagination */}

        <TablePagination

          component="div"

          count={logs?.length}

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