import { useEffect, useState } from 'react';
import api from '../api/client';

export default function useProjects() {

    const [projects, setProjects] = useState([]);
    const [projectsloading, setProjectsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        projects,
        projectsloading,
        refreshProjects: fetchProjects
    };
}