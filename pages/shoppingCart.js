import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Navbar } from '../Component/bar'
import { FETCHOPTIONS, Products } from '../Component/products'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "../Component/configFirebase"
import { Loader } from '../Component/loader'
import { NotData } from '../Component/alerts'
import Link from 'next/link'

export default function ShoppingCart() {
  const [products, setProducts] = useState([])
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [sizeData, setSizeData] = useState(true)
  const { user } = useUser()
  
  function getDataDB(){
    if(user !== undefined){
      const name = user.nickname.replace(/[-[\]{}()*+&/%?.,\\^$|#\s]/g, "")
      const db = getDatabase(app)
      const starCountRef = ref(db, `${name}`)
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val()
        if(data === null){
          setLoading(false)
          setSizeData(false)
          return
        }
        const dataVArray = Object.values(data)
        getProducts(dataVArray)
      })
    }else{
      setLoading(false)
      setSizeData(false)
    }
  }

  async function getProducts(dataVArray){
    const responseCartProducts = await Promise.all(dataVArray.map(pd => fetch(`https://api.stripe.com/v1/products/${pd.product}`, FETCHOPTIONS)))
    const jsonCartProducts = await Promise.all(responseCartProducts.map(js => js.json()))
    setProducts(jsonCartProducts)

    const responseCartPrices = await Promise.all(dataVArray.map(pd => fetch(`https://api.stripe.com/v1/prices/${pd.price}`, FETCHOPTIONS)))
    const jsonCartPrices = await Promise.all(responseCartPrices.map(js => js.json()))
    setPrices(jsonCartPrices)

    setLoading(false)
  }

  useEffect(()=>{
    getDataDB()
  },[user])

  return (
    <div className={styles.container}>
    <Head>
      <title>My Shopping Cart</title>
      <meta name="description" content="Your Shopping Cart of simple store" />
      <link rel="icon" href="/favicon.ico" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous"></link>
    </Head>

    <main className={styles.main}>
      <Navbar />
      {loading &&
        <Loader />
      }
      {!sizeData &&
        <NotData />
      }
      <Products products={products} prices={prices} />
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