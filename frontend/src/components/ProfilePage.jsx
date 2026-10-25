import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import loginService from '../services/login'
import userService from '../services/users'
import ProjectForm from './ProjectForm'

const getLinkHref = link => {
  const trimmedLink = link.trim()
  if (/^https?:\/\//i.test(trimmedLink)) {
    return trimmedLink
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmedLink)) {
    return null
  }
  return `https://${trimmedLink}`
}

const ProfilePage = ({ user, onUserUpdate }) => {
  const [links, setLinks] = useState(
    user?.links && typeof user.links === 'object' && !Array.isArray(user.links)
      ? user.links
      : {}
  )
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [profileProjects, setProfileProjects] = useState(user?.projects || [])
  const [projectsError, setProjectsError] = useState('')

  useEffect(() => {
    if (!user?.id) {
      setProfileProjects([])
      return undefined
    }

    let isCurrent = true
    setProfileProjects(user.projects || [])
    setProjectsError('')

    userService.getById(user.id)
      .then(profile => {
        if (isCurrent) {
          setProfileProjects(profile.projects || [])
        }
      })
      .catch(error => {
        console.error('Failed to fetch profile projects:', error)
        if (isCurrent) {
          setProjectsError('Projektien lataaminen epäonnistui.')
        }
      })

    return () => {
      isCurrent = false
    }
  }, [user?.id])

  if (!user) {
    return (
      <div>
        <h2>Profile</h2>
        <p>Kirjaudu sisään nähdäksesi profiilisi.</p>
        <Link to="/">Siirry kirjautumiseen</Link>
      </div>
    )
  }

  const handleAddLink = event => {
    event.preventDefault()
    const name = linkName.trim()
    const url = linkUrl.trim()

    if (!name || !url) {
      setErrorMessage('Anna sekä palvelun nimi että linkki.')
      setSuccessMessage('')
      return
    }
    if (Object.keys(links).some(existingName => existingName.toLowerCase() === name.toLowerCase())) {
      setErrorMessage('Tällä palvelun nimellä on jo linkki.')
      setSuccessMessage('')
      return
    }

    setLinks(currentLinks => ({ ...currentLinks, [name]: url }))
    setLinkName('')
    setLinkUrl('')
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleRemoveLink = name => {
    setLinks(currentLinks => {
      const updatedLinks = { ...currentLinks }
      delete updatedLinks[name]
      return updatedLinks
    })
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleCancelEdit = () => {
    setLinks(
      user.links && typeof user.links === 'object' && !Array.isArray(user.links)
        ? user.links
        : {}
    )
    setLinkName('')
    setLinkUrl('')
    setErrorMessage('')
    setSuccessMessage('')
    setIsEditing(false)
  }

  const handleSaveLinks = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const updatedUser = await userService.update(user.id, { links })
      onUserUpdate(loginService.updateLoggedInUser(updatedUser))
      setSuccessMessage('Links saved.')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile links:', error)
      setErrorMessage(
        error.response?.status === 401 || error.response?.status === 403
          ? 'Login expired, login again.'
          : 'Saving links failed.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleProjectCreated = createdProject => {
    const projects = user.projects || []
    const updatedProjects = projects.some(project =>
      (typeof project === 'string' ? project : project.id) === createdProject.id
    )
      ? projects
      : [...projects, createdProject.id]

    setProfileProjects(currentProjects => (
      currentProjects.some(project =>
        (typeof project === 'string' ? project : project.id) === createdProject.id
      )
        ? currentProjects
        : [...currentProjects, createdProject]
    ))
    onUserUpdate(loginService.updateLoggedInUser({ projects: updatedProjects }))
  }

  return (
    <div>
      <h2>Profile</h2>
      <dl>
        <button onClick={() => setIsCreating(!isCreating)}>Create a new project</button>
        {isCreating && <ProjectForm onProjectCreated={handleProjectCreated} />}
        <dt>Username</dt>
        <dd>{user.username}</dd>
        <dt>Role</dt>
        <dd>{user.role || 'normal'}</dd>
        {user.country && (
          <>
            <dt>Country</dt>
            <dd>{user.country}</dd>
          </>
        )}
        {(Array.isArray(user.projects) || profileProjects.length > 0) && (
          <>
            <dt>Projects</dt>
            <dd>{profileProjects.length}</dd>
            <ul>
              {profileProjects.map(project => {
                const projectId = typeof project === 'string' ? project : project.id
                const projectTitle = typeof project === 'string' ? null : project.title
                return (
                  <li key={projectId}>
                    {projectTitle}
                  </li>
                )
              })}
            </ul>
          </>
        )}
        {projectsError && <p role="alert">{projectsError}</p>}
      </dl>

      {Object.keys(links).length > 0 && (
        <section>
          <h3>Links (github, instagram...)</h3>
          <button type="button" onClick={() => setIsEditing(true)} hidden={isEditing}>
          Edit
        </button>
          <ul>
            {Object.entries(links).map(([name, link]) => {
              const href = typeof link === 'string' ? getLinkHref(link) : null
              return (
                <li className='link' key={name}>
                  {href ? (
                    <a className="link" href={href} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  ) : (
                    <span>{name}: {link}</span>
                  )}
                  {' '}
                  {isEditing && (
                    <button type="button" onClick={() => handleRemoveLink(name)}>
                      Delete
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}
      {isEditing && <section>
        <h3>Add link</h3>
        <form onSubmit={handleAddLink}>
          <div>
            <label htmlFor="link-name">Name</label>
            <input
              id="link-name"
              value={linkName}
              onChange={event => setLinkName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="link-url">Link</label>
            <input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={event => setLinkUrl(event.target.value)}
              required
            />
          </div>
          <button type="submit">Add to list</button>
        </form>
        <button type="button" onClick={handleSaveLinks} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save links'}
        </button>
        <button type="button" onClick={handleCancelEdit} disabled={isSaving}>
          Cancel
        </button>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {successMessage && <p role="status">{successMessage}</p>}
      </section>}
      {!isEditing && errorMessage && <p role="alert">{errorMessage}</p>}
      {!isEditing && successMessage && <p role="status">{successMessage}</p>}
    </div>
  )
}

export default ProfilePage
