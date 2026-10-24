import { useState } from 'react'
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
      setSuccessMessage('Linkit tallennettu.')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile links:', error)
      setErrorMessage(
        error.response?.status === 401 || error.response?.status === 403
          ? 'Kirjautuminen on vanhentunut. Kirjaudu uudelleen sisään.'
          : 'Linkkien tallennus epäonnistui.'
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

    onUserUpdate(loginService.updateLoggedInUser({ projects: updatedProjects }))
  }
  console.log(user.projects)
  return (
    <div>
      <h2>Profile</h2>
      <dl>
        <button onClick={() => setIsCreating(!isCreating)}>Create a new project</button>
        {isCreating && <ProjectForm onProjectCreated={handleProjectCreated} />}
        <dt>Käyttäjätunnus</dt>
        <dd>{user.username}</dd>
        <dt>Rooli</dt>
        <dd>{user.role || 'normal'}</dd>
        {user.country && (
          <>
            <dt>Maa</dt>
            <dd>{user.country}</dd>
          </>
        )}
        {user.projects && (
          <>
            <dt>Projektit</dt>
            <dd>{user.projects.length}</dd>
                <ul>
                {user.projects.map((project) => <li>{project}</li>)}
              </ul>
          </>
        )}
      </dl>
      <button type="button" onClick={() => setIsEditing(true)} hidden={isEditing}>
        Edit
      </button>
      {Object.keys(links).length > 0 && (
        <section>
          <h3>Linkit</h3>
          <ul>
            {Object.entries(links).map(([name, link]) => {
              const href = typeof link === 'string' ? getLinkHref(link) : null
              return (
                <li key={name}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  ) : (
                    <span>{name}: {link}</span>
                  )}
                  {' '}
                  {isEditing && (
                    <button type="button" onClick={() => handleRemoveLink(name)}>
                      Poista
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}
      {isEditing && <section>
        <h3>Lisää linkki</h3>
        <form onSubmit={handleAddLink}>
          <div>
            <label htmlFor="link-name">Palvelun nimi</label>
            <input
              id="link-name"
              value={linkName}
              onChange={event => setLinkName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="link-url">Linkki</label>
            <input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={event => setLinkUrl(event.target.value)}
              required
            />
          </div>
          <button type="submit">Lisää listaan</button>
        </form>
        <button type="button" onClick={handleSaveLinks} disabled={isSaving}>
          {isSaving ? 'Tallennetaan...' : 'Tallenna linkit'}
        </button>
        <button type="button" onClick={handleCancelEdit} disabled={isSaving}>
          Peruuta
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
