import axios from "axios";
import React, { useEffect, useState } from "react";

const ReadOrders = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;

    const [searchName, setSearchName] = useState(""); // State for search by name
    const [searchEmail, setSearchEmail] = useState(""); // State for search by email

    const handleDelete = (_id) => {
        const token = localStorage.getItem('userToken');
        axios.delete(`http://localhost:5000/api/orders/${_id}`, {
            headers: {
                "x-auth-token": token,
            },
        })
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error("Error deleting order: ", error);
                alert("Failed to delete order. Please try again.");
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

        axios.get("http://localhost:5000/api/orders", {
            headers: {
                "x-auth-token": token,
            },
        })
            .then((res) => {
                setData(res.data);
                setFilteredData(res.data); // Initially set filteredData to all orders
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

    useEffect(() => {
        // Filter orders based on both name and email
        let filtered = data;

        if (searchName) {
            filtered = filtered.filter((order) =>
                order.user?.lastname.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (searchEmail) {
            filtered = filtered.filter((order) =>
                order.user?.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [searchName, searchEmail, data]);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="w-full">
            <div className="mb-4 flex space-x-4">
                {/* Search by Name */}
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full"
                />
                {/* Search by Email */}
                <input
                    type="text"
                    placeholder="Tìm kiếm theo email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full"
                />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Date</th>
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
                        ) : currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No orders available
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                >
                                    <td className="px-6 py-4">{order.user?.lastname || "Unknown"}</td>
                                    <td className="px-6 py-4">{order.user?.email || "Unknown"}</td>
                                    <td className="px-6 py-4">{order.amount}</td>
                                    <td className="px-6 py-4">{order.status}</td>
                                    <td className="px-6 py-4">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(order._id)}
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
                {Array.from({ length: Math.ceil(filteredData.length / ordersPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? "bg-gray-200" : "bg-blue-500"} text-white`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default ReadOrders;
