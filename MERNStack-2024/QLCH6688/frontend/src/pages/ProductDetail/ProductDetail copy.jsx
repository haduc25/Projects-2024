import { useState, useEffect, useContext } from 'react';
import './ProductDetail.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const ProductDetail = () => {
    const { urlImage, url, product_list, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency, convertCategory, formatDateFromYYYYMMDDToVietNamDate, removeSpecialChars } =
        utilityFunctions;
    const { id } = useParams(); // Lấy id từ URL
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        supplier: { name: '', contact: '', address: '' },
        productCode: '',
        barcode: '',
        name: '',
        category: '',
        brand: '',
        purchasePrice: '',
        sellingPrice: '',
        unit: '',
        stock: '',
        description: '',
        notes: '',
        image: '',
        batches: [],
    });

    const [file, setFile] = useState(null); // Để upload hình ảnh
    const [batch, setBatch] = useState({
        entryDate: '',
        expirationDate: '',
        purchasePrice: '',
        quantity: '',
    });

    // Lấy thông tin sản phẩm từ server
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${url}api/sanpham/chitietsanpham/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
        }
    };
    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Xử lý khi gửi form
    const handleSubmit = async (e) => {
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
        Object.keys(product).forEach((key) => {
            if (key === 'supplier') {
                // Xử lý supplier
                Object.keys(product.supplier).forEach((subKey) => {
                    formData.append(`supplier.${subKey}`, product.supplier[subKey]);
                });
            } else if (key === 'batches') {
                formData.append(key, JSON.stringify(product.batches));
            } else {
                formData.append(key, product[key]);
            }
        });
        if (file) formData.append('image', file); // Nếu có hình ảnh, thêm vào formData

        // Console log dữ liệu trong FormData
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        try {
            const response = await axios.put(`${url}api/sanpham/capnhatsanpham/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            navigate('/sanpham'); // Quay lại trang danh sách sản phẩm
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            alert('Cập nhật sản phẩm thất bại.');
        }
    };

    const handleChange = (e, field) => {
        const { name, value } = e.target;
        const key = field || name; // Sử dụng `field` nếu được cung cấp, nếu không thì sử dụng `name`

        // Validate cho từng trường
        const validateField = (key, sanitizedValue) => {
            switch (key) {
                case 'barcode': {
                    // Kiểm tra mã vạch chỉ bao gồm số
                    if (!/^\d*$/.test(sanitizedValue)) {
                        alert('Mã vạch chỉ được chứa số.');
                        return null;
                    }
                    // Kiểm tra độ dài tối đa của mã vạch
                    if (sanitizedValue.length > 13) {
                        alert('Mã vạch không được vượt quá 13 ký tự.');
                        return null;
                    }
                    break;
                }
                case 'name':
                    if (sanitizedValue.length > 50) {
                        alert('Tên sản phẩm không được dài hơn 50 ký tự.');
                        return null;
                    }
                    break;

                case 'brand':
                    if (sanitizedValue.length > 30) {
                        alert('Thương hiệu không được dài hơn 30 ký tự.');
                        return null;
                    }
                    break;

                case 'description':
                    if (sanitizedValue.length > 200) {
                        alert('Mô tả không được dài hơn 200 ký tự.');
                        return null;
                    }
                    break;

                case 'notes':
                    if (sanitizedValue.length > 100) {
                        alert('Ghi chú không được dài hơn 100 ký tự.');
                        return null;
                    }
                    break;

                case 'sellingPrice':
                case 'purchasePrice':
                    if (sanitizedValue.length > 10) {
                        alert('Giá không được dài hơn 10 ký tự.');
                        return null;
                    }
                    if (!/^\d*$/.test(sanitizedValue)) {
                        alert('Giá chỉ được chứa số.');
                        return null;
                    }
                    break;

                case 'stock':
                    if (sanitizedValue.length > 5) {
                        alert('Số lượng tồn không được dài hơn 5 ký tự.');
                        return null;
                    }
                    break;
                default:
                    break;
            }
            return sanitizedValue; // Trả về giá trị đã lọc
        };

        // Lọc ký tự đặc biệt
        const sanitizedValue = removeSpecialChars(value, key);

        // Validate giá trị
        const validValue = validateField(key, sanitizedValue);
        if (validValue === null) return; // Dừng nếu không hợp lệ

        // Cập nhật state với giá trị đã được làm sạch và hợp lệ
        if (key.startsWith('supplier.')) {
            const supplierKey = key.split('.')[1];
            setProduct((prev) => ({
                ...prev,
                supplier: { ...prev.supplier, [supplierKey]: validValue },
            }));
        } else {
            setProduct((prev) => ({
                ...prev,
                [key]: validValue,
            }));
        }
    };

    const handleBatchChange = (e, field) => {
        const { name, value } = e.target;
        const key = field || name;

        // Validate cho từng trường
        const validateField = (key, sanitizedValue) => {
            switch (key) {
                case 'purchasePrice': {
                    if (sanitizedValue.length > 10) {
                        alert('Giá nhập không được dài hơn 10 ký tự.');
                        return null;
                    }
                    if (!/^\d*$/.test(sanitizedValue)) {
                        alert('Giá mua chỉ được chứa số.');
                        return null;
                    }
                    break;
                }
                case 'quantity': {
                    if (sanitizedValue.length > 5) {
                        alert('Số lượng không được dài hơn 5 ký tự.');
                        return null;
                    }
                    break;
                }
                default:
                    break;
            }
            return sanitizedValue; // Trả về giá trị đã lọc
        };

        // Lọc ký tự đặc biệt
        const sanitizedValue = removeSpecialChars(value, key);

        // Validate giá trị
        const validValue = validateField(key, sanitizedValue);
        if (validValue === null) return; // Dừng nếu không hợp lệ

        // Cập nhật state với giá trị đã được làm sạch và hợp lệ
        setBatch((prev) => ({
            ...prev,
            [key]: validValue,
        }));
    };

    const addBatch = () => {
        if (!batch.entryDate || !batch.expirationDate || !batch.purchasePrice || !batch.quantity) {
            alert('Vui lòng điền đầy đủ thông tin lô hàng!');
            return;
        }
        setProduct((prev) => ({
            ...prev,
            batches: [...prev.batches, batch],
        }));
        setBatch({ entryDate: '', expirationDate: '', purchasePrice: '', quantity: '' });
    };

    return (
        <div className="detail-product">
            {/* <h1>Chỉnh sửa sản phẩm</h1> */}
            <h1>{isEditMode ? 'Chỉnh sửa' : 'Chi tiết'} sản phẩm</h1>
            <form className="detail-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={{ maxWidth: '600px', paddingLeft: '24px' }}>
                    <div className="form-group">
                        <label>Mã sản phẩm:</label>
                        <input type="text" name="productCode" value={product.productCode} disabled />
                    </div>
                    <div className="form-group">
                        <label>*Mã vạch:</label>
                        <input
                            type="text"
                            name="barcode"
                            value={product.barcode}
                            onChange={(e) => handleChange(e, 'barcode')}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Tên sản phẩm:</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={(e) => handleChange(e, 'name')}
                            required
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Nhóm hàng:</label>
                        <select
                            disabled={!isEditMode}
                            required
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
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Đơn vị tính:</label>
                        <input
                            disabled={!isEditMode}
                            type="text"
                            name="unit"
                            value={product.unit}
                            onChange={(e) => handleChange(e, 'unit')}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>*Giá nhập (chung): ({formatCurrency(product.purchasePrice)})</label>
                        <input
                            disabled={!isEditMode}
                            required
                            type="text"
                            name="purchasePrice"
                            value={product.purchasePrice}
                            onChange={(e) => handleChange(e, 'purchasePrice')}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Giá bán: ({formatCurrency(product.sellingPrice)})</label>
                        <input
                            disabled={!isEditMode}
                            required
                            type="text"
                            name="sellingPrice"
                            value={product.sellingPrice}
                            onChange={(e) => handleChange(e, 'sellingPrice')}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Số lượng tồn kho:</label>
                        <input
                            disabled={!isEditMode}
                            required
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={(e) => handleChange(e, 'stock')}
                        />
                    </div>
                    <div>
                        <label>Ảnh sản phẩm hiện tại:</label>
                        <br />
                        <img
                            src={`${urlImage}${product.image}`}
                            alt={`${product.name}`}
                            style={{ height: '250px', width: '250px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                        <br />
                        <div>
                            <label htmlFor="">Thay ảnh mới</label>
                            <br />
                            <input disabled={!isEditMode} type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '600px', paddingLeft: '24px' }}>
                    <div className="form-group">
                        <label>Mô tả sản phẩm:</label>
                        <textarea
                            disabled={!isEditMode}
                            placeholder="Nhập mô tả cho sản phẩm"
                            name="description"
                            value={product.description}
                            onChange={(e) => handleChange(e, 'description')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Ghi chú:</label>
                        <textarea
                            disabled={!isEditMode}
                            placeholder="Nhập ghi chú cho sản phẩm"
                            name="notes"
                            value={product.notes}
                            onChange={(e) => handleChange(e, 'notes')}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Nhà cung cấp:
                        </label>
                        <div style={{ display: 'flex', marginBottom: '15px' }}>
                            <input
                                disabled={!isEditMode}
                                required
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                type="text"
                                name="supplier.name"
                                value={product.supplier.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <input
                                disabled={!isEditMode}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    minWidth: '270px',
                                }}
                                type="text"
                                name="supplier.contact"
                                placeholder="Số điện thoại liên hệ"
                                value={product.supplier.contact}
                                onChange={handleChange}
                            />
                            <input
                                disabled={!isEditMode}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    minWidth: '270px',
                                }}
                                type="text"
                                name="supplier.address"
                                placeholder="Địa chỉ"
                                value={product.supplier.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label>Thông tin lô hàng</label>
                            <i>Tổng số lô hàng đã nhập: {product.batches.length}</i>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div>
                                <label>Ngày nhập hàng:</label>
                                <input
                                    disabled={!isEditMode}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        minWidth: '270px',
                                    }}
                                    type="date"
                                    name="entryDate"
                                    value={batch.entryDate}
                                    onChange={handleBatchChange}
                                    placeholder="Ngày nhập"
                                />
                            </div>
                            <div>
                                <label>Ngày hết hạn:</label>
                                <input
                                    disabled={!isEditMode}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        minWidth: '270px',
                                    }}
                                    type="date"
                                    name="expirationDate"
                                    value={batch.expirationDate}
                                    onChange={handleBatchChange}
                                    placeholder="Ngày hết hạn"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <label maxLength={20}>Giá nhập (lô hàng) ({formatCurrency(batch.purchasePrice)})</label>
                                <input
                                    disabled={!isEditMode}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        minWidth: '270px',
                                    }}
                                    maxLength={11}
                                    type="text"
                                    name="purchasePrice"
                                    value={batch.purchasePrice}
                                    onChange={(e) => handleBatchChange(e, 'purchasePrice')}
                                    placeholder="Giá nhập (lô hàng)"
                                />
                            </div>
                            <div>
                                <label>Số lượng</label>
                                <input
                                    disabled={!isEditMode}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        minWidth: '270px',
                                    }}
                                    type="number"
                                    name="quantity"
                                    value={batch.quantity}
                                    onChange={(e) => handleBatchChange(e, 'quantity')}
                                    placeholder="Số lượng (lô hàng)"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            style={{ padding: '8px 4px', marginRight: '16px', marginTop: '8px' }}
                            onClick={addBatch}
                            disabled={!isEditMode}
                        >
                            Thêm lô hàng
                        </button>
                        <button
                            type="button"
                            style={{ padding: '8px 4px', marginRight: '16px', marginTop: '8px' }}
                            // onClick={addBatch}
                            disabled={!isEditMode}
                        >
                            Xóa lô hàng
                        </button>
                    </div>
                    <ul>
                        {product.batches.map((batch, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                <b>Số lô {index + 1}:</b>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {/* Ngày nhập: {formatDateFromYYYYMMDDToVietNamDate(batch.entryDate)}, Ngày hết hạn:{' '}
                                    {formatDateFromYYYYMMDDToVietNamDate(batch.expirationDate)}, Giá nhập:{' '}
                                    {formatCurrency(batch.purchasePrice)}, Số lượng: {batch.quantity} */}
                                    <div>
                                        <p>Ngày nhập: {formatDateFromYYYYMMDDToVietNamDate(batch.entryDate)}</p>
                                        <p>Giá nhập: {formatCurrency(batch.purchasePrice)}</p>
                                    </div>
                                    <div>
                                        <p>Ngày hết hạn: {formatDateFromYYYYMMDDToVietNamDate(batch.expirationDate)}</p>
                                        <p>Số lượng: {batch.quantity}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ border: '1px solid', minHeight: '200px', marginTop: '14px' }}>
                        {/* <button type="button">Chỉnh sửa</button> */}
                        {/*  */}
                        <button
                            type="button"
                            style={{ padding: '8px 4px', marginRight: '16px' }}
                            // onClick={() => setIsEditMode(!isEditMode)}
                            onClick={() => {
                                if (isEditMode) {
                                    // case 1: Đang trong chế độ chỉnh sửa
                                    const confirmExit = window.confirm(
                                        'Bạn có chắc chắn muốn thoát chế độ chỉnh sửa? Mọi thay đổi sẽ không được lưu.',
                                    );
                                    if (confirmExit) {
                                        fetchProduct();
                                        setIsEditMode(false); // Thoát chế độ chỉnh sửa
                                    }
                                } else {
                                    // case 2: Chuyển sang chế độ chỉnh sửa
                                    setIsEditMode(true);
                                }
                            }}
                        >
                            {isEditMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                        </button>
                        <button
                            disabled={!isEditMode}
                            type="submit"
                            style={{ padding: '8px 4px', marginRight: '16px' }}
                        >
                            Lưu & Cập nhật
                        </button>
                        <button
                            disabled={!isEditMode}
                            type="button"
                            style={{ padding: '8px 4px', marginRight: '16px' }}
                        >
                            Xóa sản phẩm
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductDetail;
