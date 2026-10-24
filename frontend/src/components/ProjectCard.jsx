import '../index.css'

const ProjectCard = ({project}) => {
    let color

    switch (project.type) {
        case "website":
            color = "#F6850C"
            break
        case "robotics":
            color = "#39B1D1"
            break
        case "hardware":
            color = "#f5e345"
            break
        case "game":
            color = "#d6fb61"
            break
        case "app":
            color = "#de3e3e"
            break
        default:
            color = "#aeb7c8"
    }

    return (
        <div className="projectCard" style={{'--category-color': color}}>
        <h3>{project.title}</h3>
        <p>{project.content}</p>
        </div>
    )
}
export default ProjectCard