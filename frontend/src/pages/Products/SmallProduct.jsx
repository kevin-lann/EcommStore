import {Link} from 'react-router-dom'
import HeartIcon from './HeartIcon'

const SmallProduct = ({product}) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
        <div className="relative">
            <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-[20rem] h-[12rem] display-block rounded"
            />

            <HeartIcon product={product}/>

            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h2 className="flex justify-between items-center">
                        <div>{product.name}</div>
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full light:bg-orange-900 dark:text-orange-500">
                        ${product.price}
                        </span>
                    </h2>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default SmallProduct