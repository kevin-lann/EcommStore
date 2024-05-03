import Category from '../models/categoryModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'

const createCategory = asyncHandler( async (req, res) => {
    try {
         const {name} = req.body

         if(!name) {
            return res.json({error: "Name is required"})
         }

         const existingCategory = await Category.findOne({name})

         if(existingCategory) {
            return res.json({error: "Already exists"})
         }

         const category = await new Category({name}).save()
         res.json(category)

    } catch(err) {
        console.error(err)
        return res.status(400).json(err)
    }
})

const updateCategory = asyncHandler( async (req, res) => {
    try {
        const { name } = req.body
        const { categoryId } = req.params

        const category = await Category.findOne({_id: categoryId})

        if(!category) {
            return res.status(404).json({error: "Category not found"})
        }

        category.name = name

        const updatedCategory = await category.save()

        res.json(updatedCategory)

    } catch(err) {
        console.error(err)
        return res.status(400).json(err)
    }
    
})

const deleteCategory = asyncHandler( async (req, res) => {
    try {
        const removedCategory = await Category.findByIdAndDelete(req.params.categoryId)
        res.json(removedCategory)

    } catch(err) {
        console.error(err)
        return res.status(400).json(err)
    }
})

const getAllCategories = asyncHandler( async (req, res) => {
    try {
        const categories = await Category.find({})
        res.json(categories)
    }catch(err) {
        console.error(err)
        return res.status(400).json(err)
    }
})

const readCategory = asyncHandler ( async( req, res) => {
    try {
        const category = await Category.findOne({_id: req.params.id})
        res.json(category)
    } catch(err) {
        console.error(err)
        return res.status(400).json(err)
    }
})

export { 
    createCategory,
    updateCategory,
    deleteCategory, 
    getAllCategories,
    readCategory
}