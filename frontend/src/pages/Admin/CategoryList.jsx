import { useState } from "react"
import { toast } from "react-toastify"
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice"
import CategoryForm from "../../components/CategoryForm/CategoryForm"
import Modal from "../../components/Modal"
import { Model } from "mongoose"
import AdminMenu from "./AdminMenu"

const CategoryList = () => {
  
  const {data: categories}  = useFetchCategoriesQuery();
  const [name, setName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [updatingName, setUpdatingName] = useState("")
  const [modalVisible, setModalVisible] = useState(false)

  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()


  const handleCreateCategory = async (e) => {
    e.preventDefault()

    if(!name) {
        toast.error("Category name is required")
        return
    }

    try {
        const result = await createCategory({name}).unwrap()
        if (result.error) {
            toast.error(result.error)
        } 
        else {
            setName("")
            toast.success(`${result.name} has been created`)
        }
    } catch(err) {
        console.error(err)
        toast.error("Failed creating category")
    }
  }


  const handleUpdateCategory = async (e) => {
    e.preventDefault()

    if(!updatingName) {
      toast.error("Category name is required")
      return
    }

    try {
      const result = await updateCategory({categoryId: selectedCategory._id, updatedCategory: {name: updatingName}}).unwrap()
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed.");
    }
  };

  return (
    <div className = "ml-[10rem] flex flex-col md:flex-row">
        <AdminMenu/>
        <div className="md:w-3/4 p-3">
        <h1 className="pl-[1rem] text-2xl font-semibold mt-4 mb-4">Manage Categories</h1>
            <CategoryForm
                value = {name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
            />
            <br />
            <br />
            <div className="flex flex-wrap">
                {categories?.map((category) => (
                  <div key={category._id}>
                    <button 
                    className="bg-white border border-orange-500 text-orange-500 py-2 px-4 rounded-lg m-3 hover:bg-orange-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    onClick={() => {
                      setModalVisible(true)
                      setSelectedCategory(category)
                      setUpdatingName(category.name)
                    }}
                    >
                      {category.name}
                    </button>
                  </div>
                ))}
            </div>

            <Modal 
            isOpen={modalVisible} 
            onClose={()=> setModalVisible(false)}
            >
              <CategoryForm
                value={updatingName}
                setValue={(value) => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Update"
                handleDelete={handleDeleteCategory}
              />  

            </Modal>

        </div>
    </div>
  )
}

export default CategoryList
