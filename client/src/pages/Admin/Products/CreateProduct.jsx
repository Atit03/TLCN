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
        img: []
    });

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "size" || name === "color" || name === "gender") {
            const [categoryIndex, field] = name.split('-');
            const updatedCategories = [...productData.categories];
            updatedCategories[categoryIndex][field] = value.split(','); // Split by comma for arrays
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

        // Tạo đối tượng FormData để gửi dữ liệu bao gồm ảnh và các trường nhập liệu khác
        const formData = new FormData();

        // Thêm các file ảnh vào formData
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('img', selectedFiles[i]);
        }

        // Thêm các trường dữ liệu khác vào formData
        for (const [key, value] of Object.entries(productData)) {
            if (key !== 'img') {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value)); // Xử lý các trường là mảng (như categories, size)
                } else {
                    formData.append(key, value);
                }
            }
        }

        try {
            // Gửi yêu cầu POST tới API backend
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đảm bảo gửi đúng kiểu dữ liệu
                },
            });
            console.log(response.data);
            alert('Product created successfully!');
        } catch (error) {
            console.error(error);
            alert('Error creating product');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Create New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={productData.company}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Company Name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={productData.title}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Product Title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="desc"
                        value={productData.desc}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Product Description"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Price"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={productData.discountPrice}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Discount Price"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Alt Text for Image</label>
                    <input
                        type="text"
                        name="alt"
                        value={productData.alt}
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Alt Text"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Categories</label>
                    <div className="flex space-x-4">
                        <div>
                            <label className="block">Color</label>
                            <input
                                type="text"
                                name="0-color"  // To target the first category
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded"
                                placeholder="Enter colors separated by commas"
                            />
                        </div>
                        <div>
                            <label className="block">Gender</label>
                            <input
                                type="text"
                                name="0-gender"  // To target the first category
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded"
                                placeholder="Enter gender(s) separated by commas"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Size</label>
                    <input
                        type="text"
                        name="size"
                        value={productData.size.join(', ')}  // Join array values into a comma-separated string
                        onChange={handleChange}
                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter sizes separated by commas"
                    />
                </div>

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
