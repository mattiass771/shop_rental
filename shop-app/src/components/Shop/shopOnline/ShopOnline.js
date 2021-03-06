import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios"

import ViewShop from "../ViewShop"
import Spinner from "react-bootstrap/Spinner";

export default ({userId}) => {
    const {shopUrl} = useParams()
    const [isUrlAvailible, setIsUrlAvailible] = useState(true)
    const [shopData, setShopData] = useState({})
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`http://localhost:5000/shop/link/${shopUrl}`)
            .then((res) => res.data ? setShopData(res.data) : setShopData({}))
            .catch((err) => err && console.log(err))
            .then(() => {
                if (shopData._id) setIsUrlAvailible(false)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if (shopData.ownerId !== undefined && shopData.ownerId === userId) {
            setIsOwner(true)
        }
    }, [shopData])

    return (
        loading ? 
        <Spinner
          style={{ marginLeft: "49%", marginTop: "20%" }}
          animation="border"
        /> :
        isUrlAvailible && shopData._id ? 
        <ViewShop shopData={shopData} isOwner={isOwner} userId={userId} /> :
        <h5 style={{ marginTop: "20%" }} className="text-center">No shop found. The url http://localhost:3000/{shopUrl} is still available.</h5>
        
    )
}