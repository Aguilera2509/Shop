import { useUser } from '@auth0/nextjs-auth0/client'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { NotPayment } from '../Component/alerts'
import { Navbar } from '../Component/bar'
import { Loader } from '../Component/loader'
import { FETCHOPTIONS } from '../Component/products'
import { ProductsModalPay } from '../Component/productsModalPay'
import Link from 'next/link'

export default function Profile() {
  const { user, isLoading } = useUser()
  const [productsPay, setProductsPay] = useState([])
  const [loading, setLoading] = useState(true)

  async function filterDataPay(){
    if(user !== undefined){
      const response = await fetch('https://api.stripe.com/v1/charges/search?query=status:\"succeeded\"&limit=100', FETCHOPTIONS)
      const json = await response.json()
      const productsUserPay = json.data.filter(el => el["billing_details"].email === user.email)

      setProductsPay(productsUserPay)
      setLoading(false)
    }
  }

  useEffect(()=>{
    filterDataPay()
  }, [user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My Profile</title>
        <meta name="description" content="My profile, be careful" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous"></link>
      </Head>

      <main className={styles.main}>
        <Navbar />
        {loading &&
          <Loader />
        }
        {productsPay.length === 0 && !loading &&
          <NotPayment />
        }
        {productsPay.length !== 0 && productsPay.map(el => <ProductsModalPay  key={el.id} pd={el} user={user} />)}
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