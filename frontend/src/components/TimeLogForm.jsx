import { useEffect, useState } from 'react';
import api from '../api/client';

export default function TimeLogForm() {
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [workDate, setWorkDate] = useState('');

  const [tasks, setTasks] = useState([
    {
      project_id: '',
      task_description: '',
      time_input: '',
    },
  ]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  function addTask() {
    setTasks([
      ...tasks,
      {
        project_id: '',
        task_description: '',
        time_input: '',
      },
    ]);
  }
  
  function updateTask(index, field, value) {
    setErrors((prev) => ({
        ...prev,
        [`${field}_${index}`]: '',
    }));
    const updatedTasks = [...tasks];

    updatedTasks[index][field] = value;

    setTasks(updatedTasks);
    
  }

  //Form validation 
  function validateTasks() {

    const newErrors = {};

    tasks.forEach(
        (task, index) => {

        // ─── Project ───────────────────────────

        if (!task.project_id) {

            newErrors[
            `project_${index}`
            ] = 'Project is required';
        }

        // ─── Task Description ──────────────────
        
        if (!task.task_description?.trim()) {
            newErrors[`task_${index}`] = 'Task description is required';
        } else if (task.task_description.length > 500) {
            newErrors[`task_${index}`] = 'Task description must not exceed 500 characters';
        }
        // ─── Time Format ───────────────────────

        const timeRegex =
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

        if (
            !timeRegex.test(
            task.time_input
            )
        ) {

            newErrors[
            `time_${index}`
            ] =
            'Time must be HH:MM';
        }
        }
    );

    setErrors(newErrors);

    return Object.keys(newErrors)
        .length === 0;
    }
  async function submitForm(e) {
    e.preventDefault();
    if (!validateTasks()) {
    return;
    }
    try {
      await api.post('/time-logs', {
        work_date: workDate,
        tasks,
      });

      alert('Time log added successfully');
      setErrors({});
      setTasks([
        {
        project_id: '',
        task_description: '',
        time_input: '',
        },
    ]);
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="card">
      <h2>Daily Time Log</h2>

      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            required
          />
        </div>

        {tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <select
              value={task.project_id}
              onChange={(e) =>
                updateTask(index, 'project_id', e.target.value)
              }
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors[`project_${index}`] && (

            <p className="error-text">
                {errors[`project_${index}`]}
            </p>

            )}
            <textarea
              placeholder="Task Description"
              value={task.task_description}
              onChange={(e) =>
                updateTask(index, 'task_description', e.target.value)
              }
            />
            {errors[`task_${index}`] && (

            <p className="error-text">
                {errors[`task_${index}`]}
            </p>

            )}
            <input
              type="text"
              placeholder="2:30"
              value={task.time_input}
              onChange={(e) =>
                updateTask(index, 'time_input', e.target.value)
              }
            />
            {errors[`time_${index}`] && (

            <p className="error-text">
                {errors[`time_${index}`]}
            </p>

            )}
          </div>
        ))}

        <div className="button-row">
          <button type="button" onClick={addTask}>
            Add Task
          </button>

          <button type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}