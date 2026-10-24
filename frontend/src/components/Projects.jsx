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
            <div className="projectGrid">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}

export default Projects