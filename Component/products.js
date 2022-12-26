import { ProductsModal } from "./productsModal"

export const FETCHOPTIONS = { headers:{
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_PRIVATE}`
    }
}

export function Products({ products, prices }){
    return(
        <div className="container text-center">
            <div className="row">
            {prices.length !== 0 && prices.map(el => {
                let data = products.filter(pd => pd.id === el.product)
                let extraData = {
                    unitAmount: el.unit_amount_decimal,
                    idPrice: el.id,
                    idProduct: el.product 
                }
                return <ProductsModal key={el.id} extraData={extraData} data={data} />
            })} 
            </div>
        </div>
    )
}