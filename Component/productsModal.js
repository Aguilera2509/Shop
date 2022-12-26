import { loadStripe } from "@stripe/stripe-js"
import { getDatabase, ref, set, remove } from "firebase/database"
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from "next/router"
import { useState } from "react"
import { NotAccount, SaveNotice } from "./alerts"
import { app } from "./configFirebase"
import { Form } from "./formMint"

function numberWithSpaces(x) {
    let y = x.split("").reverse()
    y.splice(2,0,".")
    return y.reverse().join("")
}

async function PayProduct({ idPrice }, user, setAccount, quantity){
    if(quantity === 0){
        quantity = 1
    }

    if(user !== undefined){
        const stripe = await loadStripe(`${process.env.NEXT_PUBLIC_TOKEN_PUBLIC}`)
        stripe.redirectToCheckout({
            lineItems: [{price: idPrice, quantity: quantity}],
            customerEmail: user.email,
            mode:"payment",
            successUrl:"http://localhost:3000/shoppingCart",
            cancelUrl:"http://localhost:3000/cancelPay"
        })
    }else{
        setAccount(true)
    }
}

function SaveProduct({ idPrice, idProduct }, user, setAccount, setSave){
    if(user !== undefined){
        const { nickname } = user
        const name = nickname.replace(/[-[\]{}()*+&/%?.,\\^$|#\s]/g, "")
        const db = getDatabase(app)
        set(ref(db, `${name}/` + idProduct), {
          product: idProduct,
          price: idPrice,
        })

        setSave(true)
    }else{
        setAccount(true)
    }
}

function RemoveProduct({  idProduct }, user){
    if(user !== undefined){
        const { nickname } = user
        const name = nickname.replace(/[-[\]{}()*+&/%?.,\\^$|#\s]/g, "")
        const db = getDatabase(app)
        const startRef = ref(db, `${name}/` + idProduct)
        remove(startRef)
    }
}

export function ProductsModal({ extraData, data }){
    const { user } = useUser()
    const [account, setAccount] = useState(false)
    const [save, setSave] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()

    return(
        <div className="card" style={{"width": "18rem", "padding": "1rem", "margin": "2rem"}}>
            <img src={data[0] ? data[0].images[0] : ""} className="card-img-top" alt={data[0] ? data[0].name : "UNKNOW"} />
            <div className="card-body">
                <h5 className="card-title">{data[0] ? data[0].name : "UNKNOW"}</h5>
                <p className="card-text">{data[0] ? data[0].description === null ? "Not Description" : data[0].description : ""}</p>
            </div>
            {save &&
                <SaveNotice />
            }
            <ul className="list-group list-group-flush">
                <li className="list-group-item list-group-item-dark">Prices: {numberWithSpaces(extraData.unitAmount)} $$</li>
            </ul>
            <div className="card-body">
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-primary" onClick={()=>{
                        PayProduct(extraData, user, setAccount, parseInt(quantity))
                    }} >Buy</button>
                    {router.pathname !== "/shoppingCart" &&
                        <button type="button" className="btn btn-primary" onClick={()=>{
                            SaveProduct(extraData, user, setAccount, setSave)
                        }} >Add to my Shopping Cart</button>
                    }
                    {router.pathname === "/shoppingCart" &&
                        <button type="button" className="btn btn-danger" onClick={()=>{
                            RemoveProduct(extraData, user)
                        }} >Remove to my Shopping Cart</button>
                    }
                </div>
            </div>
            {account &&
                <NotAccount />
            }
            <Form quantity={quantity} setQuantity={setQuantity} />
        </div>
    )
}