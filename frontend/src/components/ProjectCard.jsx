const ProjectCard = ({project}) => {
    return (
        <div>
        <h3>{project.title}</h3>
        <p>{project.content}</p>
        </div>
    )
}
export default ProjectCard