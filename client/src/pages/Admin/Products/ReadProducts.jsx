import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReadProducts = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("title"); // "title" for name search, "company" for brand search
    const usersPerPage = 4;

    const handleDelete = (_id) => {
        const token = localStorage.getItem('userToken');
        axios.delete(`http://localhost:5000/api/products/${_id}`, {
            headers: {
                "x-auth-token": token,
            },
        })
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error("Error deleting product: ", error);
                alert("Failed to delete product. Please try again.");
            });
    };

    function getData() {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');

        if (!token) {
            console.error("No token found");
            setIsLoading(false);
            return;
        }

        axios.get("http://localhost:5000/api/products", {
            headers: {
                "x-auth-token": token,
            },
        })
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const indexOfLastProduct = currentPage * usersPerPage;
    const indexOfFirstProduct = indexOfLastProduct - usersPerPage;

    // Lọc sản phẩm dựa trên từ khóa tìm kiếm và trường tìm kiếm (title hoặc company)
    const filteredData = data.filter((product) =>
        product[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentProducts = filteredData.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <Link to="/create-product">
                    <button className="bg-green-700 px-5 py-1 text-white">Tạo mới sản phẩm</button>
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-1/3"
                />
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="title">Tên sản phẩm</option>
                    <option value="company">Hãng</option>
                </select>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên</th>
                            <th scope="col" className="px-6 py-3">Hãng</th>
                            <th scope="col" className="px-6 py-3">Xem</th>
                            <th scope="col" className="px-6 py-3">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Không có sản phẩm phù hợp
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((item, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                >
                                    <td className="px-6 py-4">{item.title}</td>
                                    <td className="px-6 py-4">{item.company}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/product-detail/${item._id}`}>
                                            <button className="bg-green-700 px-5 py-1 text-white">
                                                Xem
                                            </button>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-700 px-5 py-1 text-white"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(filteredData.length / usersPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? "bg-gray-200" : "bg-blue-500 "}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default ReadProducts;
