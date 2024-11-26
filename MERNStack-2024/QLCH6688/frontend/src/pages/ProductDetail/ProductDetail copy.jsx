import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './ProductDetail.css';
import { Link, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { urlImage, url, product_list, utilityFunctions } = useContext(StoreContext); // fetchProductList để làm mới danh sách sau khi xóa
    const { formatCurrency, convertCategory } = utilityFunctions;
    const { id } = useParams(); // Lấy `id` từ URL
    const [product, setProduct] = useState(null);
    const [isEditingCode, setIsEditingCode] = useState(false); // State kiểm soát chế độ chỉnh sửa mã sản phẩm
    const [image, setImage] = useState(null);
    const [batch, setBatch] = useState({
        entryDate: '',
        expirationDate: '',
        purchasePrice: '',
        quantity: '',
    });

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`${url}api/sanpham/chitietsanpham/${id}`);
                setProduct(response.data);
                console.log('response.data: ', response.data); // Kiểm tra dữ liệu trả về
            } catch (error) {
                console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            }
        };
        fetchProductDetail();
    }, [id]);

    if (!product) {
        return <div>Đang tải thông tin sản phẩm...</div>;
    }
    // console.log('Product: ' + product);
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu trước khi gửi
        if (!product.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }
        if (!product.category) {
            alert('Vui lòng chọn nhóm hàng!');
            return;
        }
        if (!product.supplier.name.trim()) {
            alert('Vui lòng nhập tên nhà cung cấp!');
            return;
        }
        if (product.batches.length === 0) {
            alert('Vui lòng thêm ít nhất một lô hàng!');
            return;
        }

        const formData = new FormData();
        // Thêm các trường dữ liệu vào FormData
        for (const key in product) {
            if (key === 'supplier') {
                for (const subKey in product.supplier) {
                    formData.append(`supplier.${subKey}`, product.supplier[subKey]);
                }
            } else if (key === 'batches') {
                formData.append('batches', JSON.stringify(product.batches));
            } else {
                formData.append(key, product[key]);
            }
        }

        // Log FormData để kiểm tra dữ liệu
        console.log('FormData');
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // Nếu có ảnh mới thì thêm vào FormData
        if (image) formData.append('image', image);

        try {
            // Gửi yêu cầu PUT để cập nhật sản phẩm
            const response = await axios.put(`${url}api/sanpham/capnhatsanpham/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Thông báo thành công và reset form
            alert('Cập nhật sản phẩm thành công!');
            console.log('Phản hồi từ server:', response.data);

            // Reset lại form sau khi cập nhật
            setProduct({
                productCode: product.productCode, // Giữ mã sản phẩm cũ khi cập nhật
                barcode: product.barcode,
                name: product.name,
                category: product.category,
                brand: product.brand,
                purchasePrice: product.purchasePrice,
                sellingPrice: product.sellingPrice,
                unit: product.unit,
                stock: product.stock,
                description: product.description,
                notes: product.notes,
                supplier: { ...product.supplier },
                batches: product.batches,
            });
            setImage(null);

            // Reset input file nếu có
            // if (fileInputRef.current) fileInputRef.current.value = '';

            // Nếu cần, làm mới danh sách sản phẩm sau khi cập nhật
            // fetchProductList();
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data || error.message);
            alert(`Cập nhật sản phẩm thất bại! Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    const addBatch = () => {};
    const handleBatchChange = () => {};
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Giả sử bạn sẽ tải ảnh lên server và lấy URL ảnh mới
            const formData = new FormData();
            formData.append('image', file);

            axios
                .post(`${url}api/sanpham/upload-image`, formData)
                .then((response) => {
                    // Cập nhật ảnh mới cho sản phẩm
                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        imageUrl: response.data.imageUrl, // Giả sử server trả về URL ảnh mới
                    }));
                })
                .catch((error) => {
                    console.error('Lỗi khi tải ảnh lên:', error);
                });
        }
    };

    // const fileInputRef = useRef(null);

    return (
        <div className="add-product">
            <div>
                <Link to="/sanpham" className="add-product-form-btn">
                    Quay lại
                </Link>
            </div>
            <h1>Chi tiết sản phẩm</h1>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label>Mã sản phẩm ({isEditingCode ? 'tự chỉnh' : 'tự động'}):</label>
                        <div>
                            {isEditingCode && (
                                <button
                                    type="button"
                                    className="add-product-form-btn"
                                    onClick={() => {
                                        if (
                                            !window.confirm(
                                                'Mã hiện tại sẽ bị thay thế bởi mã tự động. Bạn có chắc chắn muốn tiếp tục?',
                                            )
                                        ) {
                                            return; // Dừng lại nếu người dùng chọn "Hủy"
                                        }
                                        // fetchLastProductCode(); // Gọi hàm tạo mã tự động nếu người dùng đồng ý
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        backgroundColor: isEditingCode ? '#f8d7da' : '#d4edda',
                                        color: isEditingCode ? '#721c24' : '#155724',
                                        padding: '5px 10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Tạo mã tự động
                                </button>
                            )}
                            <button
                                type="button"
                                className="add-product-form-btn"
                                style={{
                                    textDecoration: 'none',
                                    backgroundColor: isEditingCode ? '#f8d7da' : '#d4edda',
                                    color: isEditingCode ? '#721c24' : '#155724',
                                    padding: '5px 10px',
                                    marginLeft: '10px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setIsEditingCode(!isEditingCode)} // Toggle trạng thái
                            >
                                {isEditingCode ? 'Khóa chỉnh sửa' : 'Tinh chỉnh thủ công'}
                            </button>
                        </div>
                    </div>
                    <input
                        style={{ textTransform: 'uppercase' }}
                        type="text"
                        name="productCode"
                        value={product.productCode}
                        onChange={(e) => handleChange(e, 'productCode')}
                        readOnly={!isEditingCode} // Chỉ chỉnh sửa khi isEditingCode = true
                    />
                </div>

                <div className="form-group">
                    <label>Mã vạch:</label>
                    <input
                        type="text"
                        name="barcode"
                        value={product.barcode}
                        onChange={(e) => handleChange(e, 'barcode')}
                    />
                </div>
                <div className="form-group">
                    <label>Tên sản phẩm:</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={(e) => handleChange(e, 'name')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nhóm hàng:</label>
                    <select
                        name="category"
                        value={product.category}
                        onChange={(e) => handleChange(e)}
                        style={{
                            padding: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%',
                        }}
                    >
                        <option value="">-- Chọn nhóm hàng cho sản phẩm --</option>
                        <option value="dientu">Điện tử</option>
                        <option value="thoitrang">Thời trang</option>
                        <option value="giadung">Gia dụng</option>
                        <option value="thucpham">Thực phẩm</option>
                        <option value="mypham">Mỹ phẩm</option>
                        <option value="thuocla">Thuốc lá</option>
                        <option value="sua">Sữa</option>
                        <option value="keocaosu">Kẹo cao su</option>
                        <option value="nuocngot">Nước ngọt</option>
                        <option value="thucphamanlien">Thực phẩm ăn liền</option>
                        <option value="caphe">Cà phê</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Thương hiệu:</label>
                    <input
                        style={{ textTransform: 'uppercase' }}
                        type="text"
                        name="brand"
                        value={product.brand}
                        onChange={(e) => handleChange(e, 'brand')}
                    />
                </div>
                <div className="form-group">
                    <label>Đơn vị tính:</label>
                    <input type="text" name="unit" value={product.unit} onChange={(e) => handleChange(e, 'unit')} />
                </div>
                <div className="form-group">
                    <label>Mô tả sản phẩm:</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={(e) => handleChange(e, 'description')}
                    />
                </div>
                <div className="form-group">
                    <label>Ghi chú:</label>
                    <textarea name="notes" value={product.notes} onChange={(e) => handleChange(e, 'notes')} />
                </div>
                <div className="form-group">
                    <label>Giá nhập (chung):</label>
                    <input
                        type="number"
                        name="purchasePrice"
                        value={product.purchasePrice}
                        onChange={(e) => handleChange(e, 'purchasePrice')}
                    />
                </div>
                <div className="form-group">
                    <label>Giá bán:</label>
                    <input
                        type="number"
                        name="sellingPrice"
                        value={product.sellingPrice}
                        onChange={(e) => handleChange(e, 'sellingPrice')}
                    />
                </div>
                <div className="form-group">
                    <label>Số lượng tồn kho:</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={(e) => handleChange(e, 'stock')}
                    />
                </div>
                <div className="form-group">
                    <label>Nhà cung cấp:</label>
                    <input
                        type="text"
                        name="supplier.name"
                        value={product.supplier.name}
                        onChange={(e) => handleChange(e, 'supplier.name')}
                        placeholder="Tên nhà cung cấp"
                    />
                    <input
                        type="text"
                        name="supplier.contact"
                        value={product.supplier.contact}
                        onChange={(e) => handleChange(e, 'supplier.contact')}
                        placeholder="Số điện thoại"
                        maxLength={11}
                    />
                    <input
                        type="text"
                        name="supplier.address"
                        value={product.supplier.address}
                        onChange={(e) => handleChange(e, 'supplier.address')}
                        placeholder="Địa chỉ"
                    />
                </div>
                <div className="form-group">
                    <label>Thông tin lô hàng:</label>
                    <input
                        type="date"
                        name="entryDate"
                        value={batch.entryDate}
                        onChange={handleBatchChange}
                        placeholder="Ngày nhập"
                    />
                    <input
                        type="date"
                        name="expirationDate"
                        value={batch.expirationDate}
                        onChange={handleBatchChange}
                        placeholder="Ngày hết hạn"
                    />
                    <input
                        type="number"
                        name="purchasePrice"
                        value={batch.purchasePrice}
                        onChange={handleBatchChange}
                        placeholder="Giá nhập (lô hàng)"
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={batch.quantity}
                        onChange={handleBatchChange}
                        placeholder="Số lượng"
                    />
                    <button type="button" onClick={addBatch}>
                        Thêm lô hàng
                    </button>
                </div>
                <ul>
                    {product.batches.map((batch, index) => (
                        <li key={index}>
                            Ngày nhập: {batch.entryDate}, Ngày hết hạn: {batch.expirationDate}, Giá nhập:{' '}
                            {batch.purchasePrice}, Số lượng: {batch.quantity}
                        </li>
                    ))}
                </ul>
                <div className="form-group">
                    <label>Ảnh sản phẩm:</label>
                    {product.image && (
                        <div>
                            <img
                                src={`${urlImage}${product.image}`}
                                alt="Ảnh sản phẩm"
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Ảnh sản phẩm:</label>
                    {/* <input type="file" ref={fileInputRef} onChange={handleImageChange} /> */}
                </div>
                <div className="form-group">
                    <label>Chỉnh sửa ảnh sản phẩm:</label>
                    <input type="file" onChange={handleImageChange} />
                </div>

                <button type="submit" className="submit-btn">
                    Lưu & cập nhật
                </button>
            </form>
        </div>
    );
};

export default ProductDetail;
