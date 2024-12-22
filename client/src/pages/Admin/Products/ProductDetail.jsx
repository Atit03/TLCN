import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [productData, setProductData] = useState({
        company: "",
        title: "",
        desc: "",
        img: [],
        alt: "",
        categories: [{ color: [], gender: [] }],
        size: [],
        price: "",
        discountPrice: "",
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const token = localStorage.getItem("userToken")
                const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: { "x-auth-token": token },
                })
                setProductData(response.data)
                setIsLoading(false)
            } catch (err) {
                setError(err.response ? err.response.data.msg : "Error fetching product information")
                setIsLoading(false)
            }
        }

        fetchProductDetails()
    }, [id])

    const handleChange = (e) => {
        const { name, value, type } = e.target
        setProductData((prevData) => ({
            ...prevData,
            [name]: type === "number" ? Number(value) : value,
        }))
    }

    const handleArrayChange = (field, index, value) => {
        setProductData((prevData) => {
            const updatedArray = [...prevData[field]]
            updatedArray[index] = value
            return { ...prevData, [field]: updatedArray }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, productData)
            navigate("/admin-dashboard/products")
        } catch (err) {
            setError(err.response ? err.response.data.msg : "Error updating product information")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Product Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={productData.company}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={productData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={productData.desc}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-1">
                        Images (comma-separated URLs)
                    </label>
                    <input
                        type="text"
                        id="img"
                        name="img"
                        value={productData.img.join(", ")}
                        onChange={(e) => handleArrayChange("img", 0, e.target.value.split(","))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                        Alt Text
                    </label>
                    <input
                        type="text"
                        id="alt"
                        name="alt"
                        value={productData.alt}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                        Categories
                    </label>
                    <textarea
                        id="categories"
                        name="categories"
                        value={JSON.stringify(productData.categories)}
                        onChange={(e) => setProductData({ ...productData, categories: JSON.parse(e.target.value) })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                        Size (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="size"
                        name="size"
                        value={productData.size.join(", ")}
                        onChange={(e) => handleArrayChange("size", 0, e.target.value.split(","))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Price
                        </label>
                        <input
                            type="number"
                            id="discountPrice"
                            name="discountPrice"
                            value={productData.discountPrice}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-8">
                    <Link
                        to="/admin-dashboard/products"
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                    >
                        Back to Product List
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    )
}
export default ProductDetail;
