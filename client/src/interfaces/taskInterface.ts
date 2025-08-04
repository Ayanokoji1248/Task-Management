export default interface taskProp {
    title: string,
    description: string,
    status: "In Progress" | "Completed" | "To Do",
    priority: "Low" | "Medium" | "High",
    user: {
        _id: string,
        username: string
    }
}