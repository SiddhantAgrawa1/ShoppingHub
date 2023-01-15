import React, { useState } from 'react';
import './css/Card.css';
import { useNavigate } from 'react-router-dom';

const Card = (props) => {    
    console.log("Props : ",props)
    const navigate = useNavigate();
    const [ads, setads] = useState(false);

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

    const buynow = async() => {
        const response = await fetch('/auth')
        const data = await response.json()
        console.log(data)
        if(data.status === 200){
            setads(true)
            props.setAddress({
                status : true,
                address : props.data
            })
        }
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
                  <button onClick={() => addtoCart()} className="addtocart">Add to cart</button>
                  <button onClick={() => buynow()} className="buynow">Buy Now</button>
              </div>
          </div> 
    )
}

export default Card;