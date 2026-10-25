import ProjectCard from "./ProjectCard"
import { useState, useEffect } from 'react'
import projectService from '../services/projects'
import ProjectPage from "./ProjectPage"

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [openProject, setOpenProject] = useState(null)

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

            <div className={`projectsLayout${openProject ? ' projectsLayout--selected' : ''}`}>
                
                <section className="projectsList">
                    
                    {errorMessage && <p>{errorMessage}</p>}
                    <div className="projectGrid">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} setOpenProject={setOpenProject}/>
                        ))}
                    </div>
                </section>
                {openProject && (
                    <aside className="projectDetails">
                        <ProjectPage project={openProject} onClose={() => setOpenProject(null)} />
                    </aside>
                )}
            </div>
        </div>
    )
}

export default Projects