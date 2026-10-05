import ProjectCard from "./ProjectCard"
import { useState, useEffect } from 'react'
import projectService from '../services/projects'

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        projectService.getAll()
            .then(setProjects)
            .catch(error => {
                console.error('Failed to fetch projects:', error)
                setErrorMessage('Could not load projects.')
            })
    }, [])

    return (
        <div>
            <h1>List of projects</h1>
            {errorMessage && <p>{errorMessage}</p>}
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <ProjectCard project={project} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Projects