export function Form({ quantity ,setQuantity }){
    if(quantity > 20) setQuantity(20)
    if(quantity < 0) setQuantity(1)

    return(
        <div className="mb-3">
            <label className="form-label">How many products do you have?</label>
            <input type="number" className="form-control" name="quantity" min="1" max="20" value={quantity} onChange={(e)=> {
                setQuantity(e.target.name = e.target.value)
            }} />
        </div>
    )
}