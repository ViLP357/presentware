import { useEffect, useState } from 'react'
import userService from '../services/users'

const ProjectPage = ({ project, onClose }) => {
    const [creator, setCreator] = useState(null)
    const [creatorError, setCreatorError] = useState('')

    useEffect(() => {
        if (!project.creator) {
            setCreator(null)
            setCreatorError('')
            return undefined
        }

        let isCurrent = true
        setCreator(null)
        setCreatorError('')
        userService.getById(project.creator)
            .then(user => {
                if (isCurrent) {
                    setCreator(user)
                    setCreatorError('')
                }
            })
            .catch(error => {
                console.error('Failed to fetch project creator:', error)
                if (isCurrent) {
                    setCreatorError('Creator could not be loaded.')
                }
            })

        return () => {
            isCurrent = false
        }
    }, [project.creator])

    return (
        <div className="projectPage">
            <button type="button" onClick={onClose}>Close</button>
            <h1>{project.title}</h1>
            {creatorError
                ? <p role="alert">{creatorError}</p>
                : <h2>Creator: {creator?.username || ''}</h2>}
            <p>{project.type == "None" ? '' : "Project type: " + project.type}</p>
            <p>{project.content}</p>
        </div>
    )
}

export default ProjectPage