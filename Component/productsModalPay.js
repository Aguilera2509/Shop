function numberWithSpaces(x) {
    let y = x.toString().split("").reverse()
    y.splice(2,0,".")
    return y.reverse().join("")
}

export function ProductsModalPay({ pd, user }){
    return(
        <div className="card">
            <div className="card-header">
                {pd.description} --- {numberWithSpaces(pd.amount)}
            </div>
            <div className="card-body">
                <blockquote className="blockquote mb-0">
                    <p>Receipt: <a href={pd.receipt_url} target="_blank" rel="noopener noreferrer"> Go Receipt</a></p>
                    <p>Print receipt and contact us. Come looking for your product/products to Puerto La Cruz, Regina</p>
                    <footer className="blockquote-footer">Buy by: <cite title="Source Title">{user.name ? user.name : user.email}</cite></footer>
                </blockquote>
            </div>
        </div>
    )
}