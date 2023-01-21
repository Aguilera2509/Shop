import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { getDatabase, onValue, ref, set } from "firebase/database"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { app } from "../Component/configFirebase"
import { Navbar } from '../Component/bar'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Messages } from '../Component/messages'

const dataMessage = {
    name: '',
    message: '',
    id: ''
}

export default function Chat(){
    const router = useRouter()
    const [userMessage, setUserMessage] = useState(dataMessage)
    const [seeUserMessages, setSeeUserMessages] = useState([])
    const { user } = useUser()
    const db = getDatabase(app)
    let showMess = null

    console.log(router)

    if(seeUserMessages[0]){
        showMess = Object.values(seeUserMessages[0])
    }

    function submitMessage({ message, name, id }){
        set(ref(db, `chats/${router.query.chat[0]}/${id-1}`), {
            name,
            message,
            id
        })
    }

    function watchMessages(){
        const starCountRef = ref(db, `chats/${router.query.chat[0]}`)
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val()
          if(data === null) return
          setSeeUserMessages([...seeUserMessages, data])
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        if(user !== undefined){
            const name = user.nickname.replace(/[-[\]{}()*+&/%?.,\\^$|#\s]/g, "")
            userMessage.name = name
            userMessage.id = Date.now()
            submitMessage(userMessage)
            setUserMessage(dataMessage)
        }
    }

    function handleChange(e){
        setUserMessage({
            ...userMessage,
            [e.target.name] : e.target.value
        })
    }

    useEffect(()=>{
        if(router.asPath !== "/[chat]"){
            watchMessages()
        }
    }, [router.asPath])

    return(
        <div className={styles.container}>
            <Head>
                <title>Chat</title>
                <meta name="description" content="Product's Chat" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous"></link>
            </Head>

            <main className={styles.main}>
                <Navbar />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" name='message' value={userMessage.message} onChange={handleChange} placeholder="Comment about your experience with the product" />
                        <input type="submit" value='Submit' className="btn btn-success" />
                    </div>
                </form>
                <section className='showMessages'>
                    <ul className="list-group listMessages">
                        {showMess !== null && showMess.map(el => <Messages key={el.id} data={el} />)}
                    </ul>
                </section>
            </main>

            <footer className={styles.footer}>
                <Link
                    href="https://github.com/Aguilera2509"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                Created by{' '}
                <span className={styles.logo}>
                Aguilera Jose
                </span>
                </Link>
            </footer>
        </div>
    )
}