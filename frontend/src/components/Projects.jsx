import ProjectCard from "./ProjectCard"

const Projects = () => {
    const testProjects = [
    {
        "title": "12234",
        "creator": "6a9ae8d0bfbe6b4202ac087e",
        "type": "website",
        "content": "id test",
        "used_time": 0,
        "ai_usage": 0,
        "contributors": [],
        "tags": [],
        "links": [],
        "created_at": "2026-09-05T11:48:12.013Z",
        "id": "6a9c017cd0b4aea5d9417c88"
    },
    {
        "title": "token test",
        "creator": "6a9c04965f2a7a8701d3cb41",
        "type": "None",
        "content": "123",
        "used_time": 0,
        "ai_usage": 0,
        "contributors": [],
        "tags": [],
        "links": [],
        "created_at": "2026-09-05T12:33:41.145Z",
        "id": "6a9c0c25920295b9756331dc"
    },
    {
        "title": "master project",
        "creator": "6ab7e91b1b0939e1f7e0b4be",
        "type": "None",
        "content": "hello world",
        "used_time": 0,
        "ai_usage": 0,
        "contributors": [],
        "tags": [],
        "links": [],
        "created_at": "2026-09-26T15:49:05.445Z",
        "id": "6ab7e9711b0939e1f7e0b4bf"
    },
    {
        "title": "master project",
        "creator": "6ab7e91b1b0939e1f7e0b4be",
        "type": "None",
        "content": "hello world",
        "used_time": 0,
        "ai_usage": 0,
        "contributors": [],
        "tags": [],
        "links": [],
        "created_at": "2026-09-26T15:50:05.235Z",
        "id": "6ab7e9ad8988e00437a296f1"
    },
    {
        "title": "master project",
        "creator": "6ab7e91b1b0939e1f7e0b4be",
        "type": "robotics",
        "content": "hello world1",
        "used_time": 0,
        "ai_usage": 0,
        "contributors": [],
        "tags": [
        "pro",
        "robot"
        ],
        "links": [],
        "created_at": "2026-09-26T15:54:41.355Z",
        "id": "6ab7eac1f14c2c24686e0b8f"
    }
    ]

    return (
        <div>
        <h1>List of projects</h1>
        <ul>
            {testProjects.map(project=><ProjectCard project={project}/>)}
        </ul>
        </div>

    )
}
export default Projects