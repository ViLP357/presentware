import { useState } from 'react'
import projectService from '../services/projects'

const ProjectForm = ({ onProjectCreated }) => {
    const [newProject, setNewProject] = useState({ title: '', content: '', type: 'software' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const addProject = async event => {
        event.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const createdProject = await projectService.create(newProject)
            onProjectCreated(createdProject)
            setNewProject({ title: '', content: '', type: 'software' })
        } catch (error) {
            console.error('Failed to create project:', error)
            setErrorMessage('Projektin luonti epäonnistui.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = event => {
        const { name, value } = event.target
        setNewProject((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="projectForm">
            <p>Create a new project</p>
            <form onSubmit={addProject}>
                title: <input type="text" name="title" value={newProject.title} onChange={handleChange} required />
                content: <input type="text" name="content" value={newProject.content} onChange={handleChange} />
                type: <select name="type" value={newProject.type} onChange={handleChange}>
                    <option value="software">Software</option>
                    <option value="hardware">Hardware</option>
                    <option value="website">Website</option>
                </select>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create'}
                </button>
            </form>
            {errorMessage && <p role="alert">{errorMessage}</p>}
        </div>
    )
}

export default ProjectForm