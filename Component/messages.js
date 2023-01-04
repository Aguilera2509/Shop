export function Messages({ data }){
    return(
        <li className="list-group-item list-group-item-info">[{data.name}]: {data.message}</li>
    )
}