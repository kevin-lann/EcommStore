
import { Link, useParams } from "react-router-dom"
import { useGetProductsQuery } from "../redux/api/productApiSlice.js"
import Loader from "../components/Loader.jsx"
import Header from "../components/Header.jsx"
import Message from "../components/Message.jsx"
import Product from "./Products/Product.jsx"

const Home = () => {

  const {keyword} = useParams()
  const {data, isLoading, isError} = useGetProductsQuery({ keyword })

  return <>
    {!keyword ? <Header /> : null}
    {isLoading ? (<Loader />) : isError ? (<Message variant='danger'>
        {isError?.data.message || isError.error}
    </Message>) : (
        <>
            <div className="ml-[18rem] flex justify-center items-center">
                <h1 className="mt-[10rem] text-[3rem] mr-40">
                    Special Products
                </h1>

                <Link to="/shop"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"    
                >
                    Shop
                </Link>
            </div>

            <div>
                <div className="flex justify-center flex-wrap mt-[2rem]">
                {data.products.map((product) => (
                    <div key={product._id}>
                    <Product product={product} />
                    </div>
                ))}
                </div>
            </div>
        </>
    )}
  </>
}

export default Home