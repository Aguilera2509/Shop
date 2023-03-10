import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { NotData } from '../Component/alerts'
import { Navbar } from '../Component/bar'
import { Loader } from '../Component/loader'
import { FETCHOPTIONS, Products } from '../Component/products'
import Link from 'next/link'

let pages = {
  pt: "",
  ps: ""
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState([])
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [notData, setNotData] = useState(false)
  const [changePage, setChangePage] = useState(0)

  function HomeData(){
    if(search === ""){
      Promise.all([
        fetch("https://api.stripe.com/v1/products", FETCHOPTIONS),
        fetch("https://api.stripe.com/v1/prices", FETCHOPTIONS)
      ])
      .then(responses =>{
        return Promise.all(responses.map((res)=> res.json()))
      })
      .then(json => {
        setProducts(json[0].data)
        setPrices(json[1].data)
        pages.pt = json[0].data[9].id
        pages.ps = json[1].data[9].id
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() =>{
        setLoading(false)
      })
    }
  }

  async function SearchData(){
    if(search !== ""){
      setProducts([])
      setPrices([])
      setLoading(true)
      setNotData(false)

      const responseProducts = await fetch(`https://api.stripe.com/v1/products/search?query=name:\'${search}\'`, FETCHOPTIONS)
      const jsonProducts = await responseProducts.json()
      if(jsonProducts.data.length === 0) {
        setLoading(false)
        setNotData(true)
        return
      }
      setProducts(jsonProducts.data)

      const responsePrices = await Promise.all(jsonProducts.data.map(pd => fetch(`https://api.stripe.com/v1/prices/${pd.default_price}`, FETCHOPTIONS)))
      const jsonPrices = await Promise.all(responsePrices.map(js => js.json()))
      setPrices(jsonPrices)
      setLoading(false)
    }
  }

  function AddData(){
    if(changePage !== 0){
      Promise.all([
        fetch(`https://api.stripe.com/v1/products?starting_after=${pages.pt}`, FETCHOPTIONS),
        fetch(`https://api.stripe.com/v1/prices?starting_after=${pages.ps}`, FETCHOPTIONS)
      ])      
      .then(responses =>{
        return Promise.all(responses.map((res)=> res.json()));
      })
      .then(json => {
        setProducts([...products, ...json[0].data])
        setPrices([...prices, ...json[1].data])
        let long = json[0].data.length - 1

        pages.pt = json[0].data[long].id
        pages.ps = json[1].data[long].id
      })
      .catch(err => {
        console.error(err)
      })
    }
  }

  useEffect(()=>{
    HomeData()
    SearchData()
  }, [search])

  useEffect(()=>{
    AddData()
  }, [changePage])

  return (
    <div className={styles.container}>
      <Head>
        <title>Store</title>
        <meta name="description" content="Home of my store" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous"></link>
      </Head>

      <main className={styles.main}>
        <Navbar setSearch={setSearch} />
        {loading &&
          <Loader />
        }
        {notData &&
          <NotData />
        }
        <Products products={products} prices={prices} />
        {search === "" && products.length !== 42 && !loading &&
          <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <div style={{"marginLeft": "auto", "marginRight": "auto"}} className="btn-group me-2" role="group" aria-label="First group">
              <button type="button" className="btn btn-primary" onClick={() =>{
                setChangePage(changePage + 1)
              }} >Show more</button>
            </div>
          </div>
        }
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
