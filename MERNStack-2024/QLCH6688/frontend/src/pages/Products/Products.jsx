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

    // Hàm xử lý xóa sản phẩm
    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await axios.post('/api/remove-product', { id: productId });
                alert('Xóa sản phẩm thành công!');
                fetchProductList(); // Làm mới danh sách sản phẩm
            } catch (error) {
                console.error('Lỗi xóa sản phẩm:', error);
                alert('Xóa sản phẩm thất bại!');
            }
        }
    };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleEdit = (product) => {
        alert(`Chỉnh sửa sản phẩm: ${product.name}`);
        // Thực hiện điều hướng tới trang chỉnh sửa (nếu có router)
        // navigate(`/edit-product/${product._id}`);
    };

    // Hàm xử lý nhập hàng
    const handleAddBatch = (product) => {
        alert(`Nhập hàng cho sản phẩm: ${product.name}`);
        // Thực hiện điều hướng tới trang nhập hàng (nếu có router)
        // navigate(`/add-batch/${product._id}`);
    };

    const exportToExcel = () => {
        if (!products.length) {
            alert('Không có sản phẩm để xuất!');
            return;
        }

        // Xác nhận từ người dùng
        const confirmExport = window.confirm(
            'Bạn có chắc chắn muốn tải xuống danh sách sản phẩm dưới dạng file Excel?',
        );
        if (!confirmExport) return; // Nếu người dùng từ chối, thoát hàm

        // Chuyển đổi dữ liệu sản phẩm thành định dạng cho Excel
        const excelData = products.map((product) => ({
            'Mã sản phẩm': product.productCode,
            'Mã vạch': product.barcode,
            'Tên sản phẩm': product.name,
            'Nhóm hàng': product.category,
            'Giá nhập': product.purchasePrice,
            'Giá bán': product.sellingPrice,
            'Tồn kho': product.stock,
        }));

        // Tạo worksheet và workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sản phẩm');

        // Lấy ngày giờ hiện tại
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0'); // Lấy giờ
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Lấy phút
        const day = now.getDate().toString().padStart(2, '0'); // Lấy ngày
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (cộng 1 vì getMonth trả từ 0-11)
        const year = now.getFullYear(); // Lấy năm

        // Tạo tên file với định dạng `Danh_sach_san_pham_hhmm_ddmmyyyy.xlsx`
        const fileName = `Danh_sach_san_pham_${hours}${minutes}_${day}${month}${year}.xlsx`;

        // Xuất file Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };

    return (
        <div className="products">
            <h1>Danh sách sản phẩm</h1>
            <div className="action-buttons">
                <Link to="/san-pham/them-moi-san-pham" className="toggle-btn">
                    Thêm sản sản phẩm mới
                </Link>
                <button className="toggle-btn" onClick={exportToExcel}>
                    Xuất file Excel
                </button>
                <button className="toggle-btn" onClick={toggleAllPrices} style={{ minWidth: '200px' }}>
                    {showAllPrices ? 'Ẩn toàn bộ giá nhập' : 'Hiển thị toàn bộ giá nhập'}
                </button>
            </div>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Nhóm hàng</th>
                        <th>Giá nhập</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={`${urlImage}/${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </td>
                                <td>{product.productCode}</td>
                                <td>{product.name}</td>
                                <td>{convertCategory(product.category)}</td>
                                {/* <td
                                    className="price-cell"
                                    onClick={() => togglePriceVisibility(product._id)}
                                    title="Click để xem giá"
                                >
                                    {visiblePrices[product._id] ? formatCurrency(product.purchasePrice) : '*******'}
                                </td> */}
                                <td
                                    className="price-cell"
                                    title="Click để xem giá"
                                    onClick={() => togglePriceVisibility(product._id)}
                                >
                                    {visiblePrices[product._id] ? formatCurrency(product.purchasePrice) : '*******'}
                                </td>
                                <td className="price-cell">{formatCurrency(product.sellingPrice)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(product)}>
                                        Chỉnh sửa
                                    </button>
                                    <button className="batch-btn" onClick={() => handleAddBatch(product)}>
                                        Nhập hàng
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                                        Xóa
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
