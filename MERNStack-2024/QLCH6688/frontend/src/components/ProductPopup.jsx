import React, { useState, useContext } from 'react';
import './ProductPopup.css'; // CSS tùy chỉnh
import { StoreContext } from '../context/StoreContext';

const ProductPopup = ({ product, onClose }) => {
    const { urlImage, utilityFunctions } = useContext(StoreContext);
    const { formatDateTimeFromISO8601ToVietNamDateTime, formatCurrency } = utilityFunctions;

    // State để kiểm tra xem giá nhập có hiển thị hay không
    const [isPriceVisible, setIsPriceVisible] = useState(false);

    if (!product) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('popup-overlay')) {
            onClose(); // Đóng popup nếu nhấn vào overlay
        }
    };

    const togglePriceVisibility = () => {
        setIsPriceVisible(!isPriceVisible);
    };

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Chi tiết sản phẩm</h2>
                <img
                    src={`${urlImage}${product.image}`}
                    alt={product.name}
                    style={{ width: '250px', height: '250px', objectFit: 'cover', marginBottom: '20px' }}
                />
                <p>
                    <strong>Tên sản phẩm:</strong> {product.name}
                </p>
                <p>
                    <strong>Mã sản phẩm:</strong> {product.productCode}
                </p>
                <p>
                    <strong>Mã vạch:</strong> {product.barcode}
                </p>
                <p>
                    <strong>Mô tả:</strong> {product.description || 'Chưa có mô tả'}
                </p>
                <p>
                    <strong>Thương hiệu:</strong> {product.brand}
                </p>
                <p>
                    <strong>Đơn vị tính:</strong> {product.unit}
                </p>
                <p>
                    <strong>Loại hàng:</strong> {product.category}
                </p>
                <p>
                    <strong>Ngày nhập:</strong> {formatDateTimeFromISO8601ToVietNamDateTime(product.createdAt)}
                </p>
                <p>
                    <strong>Lần cuối cập nhật:</strong> {formatDateTimeFromISO8601ToVietNamDateTime(product.updatedAt)}
                </p>
                <div style={{ display: 'flex' }}>
                    <p style={{ marginRight: '12px' }}>
                        <strong>Giá nhập:</strong> {isPriceVisible ? formatCurrency(product.purchasePrice) : '******'}{' '}
                    </p>
                    <button onClick={togglePriceVisibility}>{isPriceVisible ? 'Ẩn giá' : 'Hiện giá'}</button>
                </div>
                <p>
                    <strong>Giá bán:</strong> {formatCurrency(product.sellingPrice)}
                </p>
                <p>
                    <strong>Tồn kho:</strong> {product.stock}
                </p>
                <p>
                    <strong>Ghi chú:</strong> {product.notes}
                </p>

                <div>
                    <h4 style={{ textAlign: 'center' }}>Nhà phân phối</h4>
                    <p>
                        <strong>Nhà phân phối: </strong>
                        {product.supplier.name}
                    </p>
                    <p>
                        <strong>Số điện thoại: </strong>
                        {product.supplier.contact}
                    </p>
                    <p>
                        <strong>Địa chỉ: </strong>
                        {product.supplier.address}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;
