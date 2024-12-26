import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
    const [productData, setProductData] = useState({
        company: '',
        title: '',
        desc: '',
        price: '',
        discountPrice: '',
        alt: '',
        categories: [{ color: [], gender: [] }],
        size: [],
    });

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "size") {
            setProductData({
                ...productData,
                size: value.split(',').map((item) => item.trim()),
            });
        } else if (name.startsWith("categories")) {
            const [_, index, field] = name.split('-');
            const updatedCategories = [...productData.categories];
            updatedCategories[index][field] = value.split(',').map((item) => item.trim());
            setProductData({ ...productData, categories: updatedCategories });
        } else {
            setProductData({
                ...productData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add images
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('img', selectedFiles[i]);
        }

        // Add other fields
        Object.entries(productData).forEach(([key, value]) => {
            if (Array.isArray(value) || typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        try {
            const token = localStorage.getItem("userToken")
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "x-auth-token": token 
                },
            });

            alert('Product created successfully!');
            setProductData({
                company: '',
                title: '',
                desc: '',
                price: '',
                discountPrice: '',
                alt: '',
                categories: [{ color: [], gender: [] }],
                size: [],
            });
            setSelectedFiles([]);
        } catch (error) {
            console.error(error);
            alert('Error creating product');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Create New Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Company */}
                <div className="mb-4">
                    <label className="block text-gray-700">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={productData.company}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Company Name"
                        required
                    />
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={productData.title}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Product Title"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="desc"
                        value={productData.desc}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Product Description"
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Price"
                        required
                    />
                </div>

                {/* Discount Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={productData.discountPrice}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Discount Price"
                        required
                    />
                </div>

                {/* Alt Text */}
                <div className="mb-4">
                    <label className="block text-gray-700">Alt Text for Image</label>
                    <input
                        type="text"
                        name="alt"
                        value={productData.alt}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Alt Text"
                        required
                    />
                </div>

                {/* Categories */}
                <div className="mb-4">
                    <label className="block text-gray-700">Categories</label>
                    {productData.categories.map((category, index) => (
                        <div key={index} className="flex space-x-4 mb-2">
                            <div>
                                <label className="block">Color</label>
                                <input
                                    type="text"
                                    name={`categories-${index}-color`}
                                    value={category.color.join(', ')}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                    placeholder="Enter colors separated by commas"
                                />
                            </div>
                            <div>
                                <label className="block">Gender</label>
                                <input
                                    type="text"
                                    name={`categories-${index}-gender`}
                                    value={category.gender.join(', ')}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 border border-gray-300 rounded"
                                    placeholder="Enter genders separated by commas"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Size */}
                <div className="mb-4">
                    <label className="block text-gray-700">Size</label>
                    <input
                        type="text"
                        name="size"
                        value={productData.size.join(', ')}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter sizes separated by commas"
                    />
                </div>

                {/* Images */}
                <div className="mb-4">
                    <label className="block text-gray-700">Product Images</label>
                    <input
                        type="file"
                        name="img"
                        multiple
                        onChange={handleFileChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
