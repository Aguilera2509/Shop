export function NotAccount(){
    return(
        <div className="alert alert-danger" role="alert">
            Not have allows cause you are not in your account
        </div>
    )
}

export function SaveNotice(){
    return(
        <div className="alert alert-success" role="alert">
            Your product have been save succesfully
        </div>
    )
}

export function NotData(){
    return(
        <div className="alert alert-info" role="alert">
            N0t Data
        </div>
    )
}

export function NotPayment(){
    return(
        <div className="alert alert-info" role="alert">
            You have not bought nothing
        </div>
    )
}

export function CancelToBuy(){
    return(
        <div className="alert alert-info" role="alert">
            You have cancel to pay product, click Home
        </div>
    )
}