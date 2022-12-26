import Image from "next/image"

export function Loader(){
    return(
        <div style={{"textAlign": "center"}}>
            <Image src="/rings.svg" alt="Loading..." width={100} height={90} />
        </div>
    )
}