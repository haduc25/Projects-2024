import { useState, useEffect, useContext } from 'react';
import './Products.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import thư viện xlsx
import { saveAs } from 'file-saver'; // Import thư viện file-saver
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
    const { urlImage, product_list, utilityFunctions, fetchProductList } = useContext(StoreContext); // fetchProductList để làm mới danh sách sau khi xóa
    const { formatCurrency, convertCategory } = utilityFunctions;

    const [products, setProducts] = useState([]);
    const [visiblePrices, setVisiblePrices] = useState({}); // Quản lý trạng thái hiển thị giá nhập
    const [showAllPrices, setShowAllPrices] = useState(false); // Quản lý trạng thái toggle toàn bộ giá nhập
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const navigate = useNavigate();

    useEffect(() => {
        setProducts(product_list); // Cập nhật danh sách sản phẩm từ context
        // Tạo trạng thái ban đầu cho `visiblePrices`
        const initialVisibility = {};
        product_list.forEach((product) => {
            initialVisibility[product._id] = false; // Giá mặc định là ẩn
        });
        setVisiblePrices(initialVisibility);
    }, [product_list]);

    // Hàm xử lý toggle hiển thị giá cho toàn bộ sản phẩm
    const toggleAllPrices = () => {
        setShowAllPrices(!showAllPrices); // Đảo trạng thái
        setVisiblePrices((prevState) => {
            const newVisibility = {};
            Object.keys(prevState).forEach((key) => {
                newVisibility[key] = !showAllPrices; // Hiển thị hoặc ẩn toàn bộ
            });
            return newVisibility;
        });
    };

    // Xử lý hiển thị giá nhập khi click
    const togglePriceVisibility = (id) => {
        setVisiblePrices((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Đổi trạng thái giữa ẩn và hiện
        }));
    };

    // // Hàm xử lý chỉnh sửa sản phẩm
    // const handleDetail = (product) => {
    //     navigate(`/sanpham/chitietsanpham/${product._id}`);
    // };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleDetail = (product) => {
        const url = `/sanpham/chitietsanpham/${product._id}`;
        window.open(url, '_blank'); // '_blank' mở trong tab mới
    };

    const exportToExcel = () => {
        if (!products.length) {
            alert('Không có sản phẩm để xuất!');
            return;
        }

        const confirmExport = window.confirm(
            'Bạn có chắc chắn muốn tải xuống danh sách sản phẩm dưới dạng file Excel?',
        );
        if (!confirmExport) return;

        const excelData = products.map((product) => ({
            'Mã sản phẩm': product.productCode,
            'Mã vạch': product.barcode,
            'Tên sản phẩm': product.name,
            'Nhóm hàng': product.category,
            'Giá nhập': product.purchasePrice,
            'Giá bán': product.sellingPrice,
            'Tồn kho': product.stock,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sản phẩm');

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        const fileName = `Danh_sach_san_pham_${hours}${minutes}_${day}${month}${year}.xlsx`;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };

    // Hàm sắp xếp danh sách sản phẩm theo productCode
    const sortProducts = () => {
        const sortedProducts = [...products].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.productCode.localeCompare(b.productCode); // Tăng dần
            } else {
                return b.productCode.localeCompare(a.productCode); // Giảm dần
            }
        });
        return sortedProducts;
    };

    // Thay đổi thứ tự sắp xếp khi nhấn vào tiêu đề "Mã sản phẩm"
    const handleSort = () => {
        setSortOrder((prevState) => (prevState === 'asc' ? 'desc' : 'asc')); // Đổi thứ tự sắp xếp
    };

    const sortedProducts = sortProducts();

    return (
        <div className="products">
            <h1>Danh sách sản phẩm</h1>
            <div className="action-buttons">
                <p style={{ position: 'absolute', top: '25%', left: 0 }}>Tổng số sản phẩm: {products.length}</p>
                <Link to="/sanpham/themmoisanpham" className="toggle-btn">
                    Thêm sản phẩm mới
                </Link>
                <button className="toggle-btn" onClick={exportToExcel}>
                    Xuất file excel
                </button>
                <button className="toggle-btn" onClick={toggleAllPrices} style={{ minWidth: '200px' }}>
                    {showAllPrices ? 'Ẩn toàn bộ giá nhập' : 'Hiển thị toàn bộ giá nhập'}
                </button>
            </div>
            <table className="products-table">
                <thead>
                    <tr>
                        <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                            Mã sản phẩm {sortOrder === 'asc' ? '▲' : '▼'}
                        </th>
                        <th>Mã vạch</th>
                        <th>Tên sản phẩm</th>
                        <th>Nhóm hàng</th>
                        <th>Giá nhập</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                            <tr key={product._id}>
                                <td style={{ maxWidth: '118px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div>
                                            <img
                                                draggable={false}
                                                src={`${urlImage}/${product.image}`}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>{product.productCode}</div>
                                    </div>
                                </td>
                                <td>{product.barcode}</td>
                                <td style={{ textAlign: 'start', paddingLeft: 20, maxWidth: 400 }}>{product.name}</td>
                                <td>{convertCategory(product.category)}</td>
                                <td
                                    className="price-cell"
                                    title="Click để xem giá"
                                    onClick={() => togglePriceVisibility(product._id)}
                                >
                                    {visiblePrices[product._id] ? formatCurrency(product.purchasePrice) : '*******'}
                                </td>
                                <td className="price-cell">{formatCurrency(product.sellingPrice)}</td>
                                <td>{product.stock}</td>
                                <td style={{ maxWidth: '100px' }}>
                                    <button className="detail-btn" onClick={() => handleDetail(product)}>
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Không có sản phẩm nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
