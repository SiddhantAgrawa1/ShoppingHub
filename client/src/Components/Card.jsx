import React from 'react';
import './css/Card.css';

const Card = (props) => {    
    console.log("Props : ",props)
    const addtoCart = async() => {
        const response = await fetch('/cart',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                product : props.data
            })
        })
        // console.log(response);
        if(response.status === 200)
            alert("Item added to the cart");
        else
            alert("Please log in first!");
    }

    return(
        <div className='card'>
            <div>
                <img src={require(`${props.data['imgsrc']}`)}/>
            </div>
            <div id='name'>{props.data['name']}</div>
            <div id='price'>
                <span id='oprice'>${props.data['oprice']} </span>
                <span id='dprice'>${props.data['dprice']}</span>
            </div>
            <div>
            <span id='discount'>Flat {props.data['discount']} off</span>
            </div>
            <div>
                <button onClick={() => addtoCart()}>Add to cart</button>
            </div>
        </div>
    )
}

export default Card;