import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useCreateProductMutation,
    useUploadProductImageMutation,
} from '../../redux/api/productApiSlice'
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice'
import { toast } from 'react-toastify'
import AdminMenu from './AdminMenu'

const ProductList = () => {

    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();
  
    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCategoriesQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const productData = new FormData();
          productData.append("image", image);
          productData.append("name", name);
          productData.append("description", description);
          productData.append("price", price);
          productData.append("category", category);
          productData.append("quantity", quantity);
          productData.append("brand", brand);
          productData.append("countInStock", stock);
    
          const { data } = await createProduct(productData);
    
          if (data.error) {
            toast.error("Failed to create product");
          } else {
            toast.success(`${data.name} is created`);
            navigate("/");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to create product");
        }
      };

    const uploadFileHandler = async (e) => {
        const formData = new FormData()
        formData.append("image", e.target.files[0])
    
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image);
          } catch (error) {
            toast.error(error?.data?.message || error.error);
          }
    }

  return (
  <div className = "container xl:mx-[9rem] sm:mx-[0]">
    <div className="flex flex-col md:flex-row">
        <AdminMenu/>
        <div className="md:w-3/4 p-3">
            <h1 className="pl-[1rem] text-2xl font-semibold mt-4 mb-4">Create Product</h1>
            {imageUrl && (
                <div className="text-center">
                    <img src={imageUrl} alt="product" className="block mx-auto max-h-[200px]"/>
                </div>
            )}

            <div className="mb-3">
                <label className="border text-black px-4 block w-3/4 text-center rounded-lg cursor-pointer font-bold py-11">
                    {image ? image.name : "Upload image"}
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={uploadFileHandler} 
                        className={!image ? "hidden" : "text-black"}
                     />
                </label>
            </div>

            <div className="p-3">
                <div className="flex flex-wrap ">
                    <div className="one mt-4">
                        <label htmlFor="name">Name</label>
                        <br />
                        <input
                            type="text"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="two ml-10 mt-4">
                        <label htmlFor="name block">Price</label>
                        <br />
                        <input
                            type="number"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500" 
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="one mt-4">
                        <label htmlFor="name block">Quantity</label>
                        <br />
                        <input
                            type="number"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500" 
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="two ml-10 mt-4">
                        <label htmlFor="name block">Brand</label>
                        <br />
                        <input
                            type="text"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500" 
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />
                    </div>

                    <div className="one flex flex-col mt-4">
                        <label htmlFor="">
                            Description
                        </label>
                        <textarea
                            type="text"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <div>
                            <label htmlFor="name block">Count In Stock</label> <br />
                            <input
                            type="text"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div className='ml-10'>
                            <label htmlFor="">Category</label> <br />
                            <select
                            placeholder="Choose Category"
                            className="bg-gray-100 mt-1 p-2 border rounded w-[24rem] focus:outline-none focus:bg-white focus:border-orange-500"
                            onChange={(e) => setCategory(e.target.value)}
                            >
                            {categories?.map((c) => (
                                <option key={c._id} value={c._id}>
                                {c.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        
                    </div>
                    <div className="w-[40%]">
                        <button
                            onClick={handleSubmit}
                            className="bg-orange-500 text-white px-10 py-2 rounded cursor-pointer my-8 hover:bg-orange-600"
                            >
                            Submit
                        </button>

                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
  </div>
  )
}

export default ProductList