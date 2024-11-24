import { useState, useEffect, useContext } from 'react';
import './Products.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Products = () => {
    const { urlImage, product_list } = useContext(StoreContextContext);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // // Lấy danh sách sản phẩm từ backend
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const response = await axios.get('/api/products'); // Endpoint backend
    //             setProducts(response.data.data);
    //         } catch (error) {
    //             console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProducts();
    // }, []);

    // Xử lý nút Xóa
    const handleDelete = async (productId) => {
        // if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        //     try {
        //         await axios.post('/api/products/remove', { id: productId });
        //         setProducts(products.filter((product) => product._id !== productId));
        //         alert('Xóa sản phẩm thành công!');
        //     } catch (error) {
        //         console.error('Lỗi khi xóa sản phẩm:', error.message);
        //         alert('Không thể xóa sản phẩm.');
        //     }
        // }
    };

    // Hiển thị loading
    if (loading) {
        return <div>Đang tải danh sách sản phẩm...</div>;
    }

    return (
        <div className="products-container">
            <h1>Danh sách sản phẩm</h1>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Mã hàng</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.productCode}</td>
                            <td>{product.name}</td>
                            <td>{product.sellingPrice.toLocaleString()} VND</td>
                            <td>{product.stock}</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => alert(`Chỉnh sửa sản phẩm: ${product.name}`)}
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    className="restock-btn"
                                    onClick={() => alert(`Nhập hàng cho sản phẩm: ${product.name}`)}
                                >
                                    Nhập hàng
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
