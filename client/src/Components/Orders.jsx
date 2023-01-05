import { useState, useEffect } from "react";
// import Card from "./Card";
import './css/Home.css'
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
// import { response } from "express";

function Orders() {
    
    const [OrderList, setOrderList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const order = async () => {
            const response = await fetch('/order')
            const data = await response.json()
            console.log("data : ",data)
            if(data.status === 200){
                setOrderList([...data.data.orderlist])
                console.log(OrderList)
            }
            else   
                setOrderList([]);
        }
        order()
    },[])
    
    const cancelOrder = async (data) => {
        console.log(data[0]['id'])
        const response = await fetch('cancelorder', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({id : data[0]['id']})
        })

        const temp = await response.json();
        console.log(temp)
        if(temp.status === 200){
            alert("Order cancelled successfully! Your amount will be refunded soon");
            navigate('/')
        }else{
            alert("Please try after some time");
        }
        
    }


    return (
        <div className="Home">
            {
                OrderList.length > 0 ? 
                    OrderList.map((data,index) => {
                        return (
                        <div className='card' key={index}>
                            <div>
                                <img src={require(`${data[0]['imgsrc']}`)}/>
                            </div>
                            <div id='name'>{data[0]['name']}</div>
                            <div id='price'>
                                <span id='oprice'>${data[0]['oprice']} </span>
                                <span id='dprice'>${data[0]['dprice']}</span>
                            </div>
                            <div>
                            <span id='discount'>Flat {data[0]['discount']} off</span>
                            </div>
                            <div>
                                <button onClick={() => cancelOrder(data)}>Cancel Order</button>
                            </div>
                        </div>)
                    })
                : <Typography component="h1"  variant="h5" color="primary">Please add some products!</Typography>
            }
        </div>
    );
}

export default Orders;
