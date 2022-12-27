import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

export function Navbar({ setSearch }){
    const { user } = useUser()
    const [word, setWord] = useState("")
    const router = useRouter()

    function handleSubmit(e){
        e.preventDefault()
        if(router.pathname === "/shoppingCart") return console.error("Nop")
        if(router.pathname === "/profile") return console.error("Nop")
        if(router.pathname === "/cancelPay") return console.error("Nop")
        setSearch(word)
    }
    
    return(
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <div className="navbar-collapse" id="navbarSupportedContent">
                    <form onSubmit={handleSubmit}  className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" required name='word' value={word} onChange={(e)=> setWord(e.target.name = e.target.value)} />
                        <input className="btn btn-outline-success" type="submit" value="Submit" />
                    </form>
                </div>

                <div className="btn-group" role="group" aria-label="Basic outlined example">
                    {user === undefined &&
                        <Link className="btn btn-outline-primary" href="/api/auth/login" role="button">
                            Login
                        </Link>
                    }

                    {user !== undefined &&
                        <>
                            <Link className='btn btn-outline-danger' href="/" role="button">Home</Link>
                            <Link className="btn btn-outline-danger" href="/profile" role="button">{user.name}</Link>
                            <Link className="btn btn-outline-danger" href="/shoppingCart" role="button">My Shopping Cart</Link>
                            <Link className="btn btn-outline-danger" href="/api/auth/logout" role="button">Logout</Link>
                        </>
                    }
                </div>
            </div>
        </nav>
    );
};

//https://firebase.google.com/docs/auth/web/start#web-version-9_1