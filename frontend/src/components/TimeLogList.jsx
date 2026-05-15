import { useState,useEffect } from 'react';
import useProjects from './../hooks/useProjects';
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
  const [showModal, setShowModal] = useState(false);

  const [editData, setEditData] = useState({
      id: '',
      project_id: '',
      task_description: '',
      work_date: '',
      time_input: '',
  });

  const { projects, projectsloading } = useProjects();
  const [errors, setErrors] = useState({});
  console.log('errors',errors);
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
  const handleEdit = (log) => {
    console.log('Log data',log);
    setEditData({
        id: log.id,
        project_id: log.project_id,
        task_description: log.task_description,
        work_date: log.work_date,
        time_input: log.formatted_time,
    });

    setShowModal(true);
};

const handleUpdate = async (e) => {

    e.preventDefault();
    if (!validateTasks()) {
    return;
    }
    try {

        await api.put(
            `/time-logs/${editData.id}`,
            editData
        );

        alert('Updated successfully');

        setShowModal(false);

        fetchLogs();

    } catch (error) {

        if (error.response?.data?.message) {

            alert(error.response.data.message);

        } else {

            console.log('KLd',error);
        }
    }
};

//Error maintance
function validateTasks() {
    const newErrors = {};
    console.log('editData',editData);
    // ─── Project ───────────────────────────
    if (!editData.project_id) {

        newErrors[
        `project`
        ] = 'Project is required';
    }
    // ─── Task Description ──────────────────
    
    if (!editData.task_description?.trim()) {
        newErrors[`task_description`] = 'Task description is required';
    } else if (editData.task_description.length > 500) {
        newErrors[`task_description`] = 'Task description must not exceed 500 characters';
    }
    // ─── Time Format ───────────────────────
    const timeRegex =
        /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

    if (!timeRegex.test(editData.time_input)) {
        newErrors[
        `time`
        ] =
        'Time must be HH:MM';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)
        .length === 0;
  }
  // ─── Component ──────────────────────────────────
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

              <TableCell>
                Action
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
                      {log?.formatted_time}
                    </TableCell>

                    <TableCell>
                      {log?.formatted_work_date}
                    </TableCell>

                    <TableCell>
                      <button onClick={() => handleEdit(log)} >
                          Edit
                      </button>
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
      {
        showModal && (

            <div className="modal-overlay">

                <div className="modal-box">

                    <h2>Edit Time Log</h2>

                    <form onSubmit={handleUpdate}>

                        <div>
                            <label>Project</label>

                            <select
                                value={editData?.project_id}
                                onChange={(e) =>{
                                    setEditData({
                                        ...editData,
                                        project_id: e.target.value
                                    });
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`project_id`]: '',
                                    }));
                                  }
                                }
                            >
                                <option value="">
                                    Select Project
                                </option>

                                {
                                    projects.map((project) => (

                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors[`project`] && (

                              <p className="error-text">
                                  {errors[`project`]}
                              </p>

                              )}
                        </div>

                        <div>
                            <label>Task Description</label>

                            <textarea
                                value={editData?.task_description}
                                maxLength={500}
                                onChange={(e) =>
                                  {
                                    setEditData({
                                        ...editData,
                                        task_description: e.target.value
                                    });
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`task_description`]: '',
                                    }));
                                  }
                                }
                            />
                            {errors[`task_description`] && (

                            <p className="error-text">
                                {errors[`task_description`]}
                            </p>

                            )}
                        </div>

                        <div>
                            <label>Work Date</label>

                            <input
                                type="date" readOnly
                                max={new Date().toISOString().split('T')[0]}
                                value={editData?.work_date}
                                onChange={(e) =>{
                                      setEditData({
                                          ...editData,
                                          work_date: e.target.value
                                      });
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`work_date_`+`e.target.value`]: '',
                                      }));
                                  }
                                }
                            />
                        </div>

                        <div>
                            <label>Time Spent (HH:MM)</label>

                            <input
                                type="text"
                                placeholder="02:30"
                                value={editData?.time_input}
                                onChange={(e) =>
                                    {
                                      setEditData({
                                        ...editData,
                                        time_input: e.target.value
                                    });
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`time_input`]: '',
                                    }));
                                    }
                                }
                            />
                            {errors[`time`] && (

                            <p className="error-text">
                                {errors[`time`]}
                            </p>

                            )}
                        </div>

                        <div className="modal-actions">

                            <button type="submit">
                                Update
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        )
    }
    </div>
  );
}