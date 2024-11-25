import { useState, useEffect, useContext, useRef } from 'react';
import './AddProduct.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const { url } = useContext(StoreContext);

    const [product, setProduct] = useState({
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
        supplier: {
            name: '',
            contact: '',
            address: '',
        },
        batches: [],
    });
    const [image, setImage] = useState(null);
    const [batch, setBatch] = useState({
        entryDate: '',
        expirationDate: '',
        purchasePrice: '',
        quantity: '',
    });
    const fileInputRef = useRef(null);

    const fetchLastProductCode = async () => {
        try {
            // Gọi API lấy mã sản phẩm cuối
            const response = await axios.get(`${url}api/sanpham/lay-ma-san-pham-cuoi-cung`);
            const lastCode = response.data.lastCode || 'SP000000'; // Nếu không có sản phẩm nào, bắt đầu từ SP000000
            const newCode = `SP${(parseInt(lastCode.slice(2)) + 1).toString().padStart(6, '0')}`; // Tăng mã sản phẩm
            setProduct((prev) => ({ ...prev, productCode: newCode })); // Cập nhật mã sản phẩm mới
            // console.log('response: ', response);
            // console.log('lastCode: ', lastCode);
            // console.log('newCode: ', newCode);
        } catch (error) {
            console.error('Lỗi lấy mã sản phẩm cuối:', error);
            alert('Không thể lấy mã sản phẩm cuối!');
        }
    };

    // Fetch mã sản phẩm tự động
    useEffect(() => {
        fetchLastProductCode();
    }, []);

    const [isEditingCode, setIsEditingCode] = useState(false); // State kiểm soát chế độ chỉnh sửa mã sản phẩm

    const handleChange = (e, field) => {
        const { name, value } = e.target;
        const key = field || name; // Sử dụng `field` nếu được cung cấp, nếu không thì sử dụng `name`

        // Hàm loại bỏ ký tự đặc biệt
        const removeSpecialChars = (input, key) => {
            const specialChars = '!@#$%^&*()_+={}[]|\\:;"\'<>,.?/~`-';
            // Nếu trường là 'name', không loại bỏ dấu ( và )
            if (key === 'name') {
                return input
                    .split('')
                    .filter(
                        (char) =>
                            !specialChars.includes(char) ||
                            char === '(' ||
                            char === ')' ||
                            char === '-' ||
                            char === ',',
                    )
                    .join('');
            }
            // Nếu không phải là 'name', loại bỏ tất cả các ký tự đặc biệt
            return input
                .split('')
                .filter((char) => !specialChars.includes(char))
                .join('');
        };

        // Validate cho từng trường
        const validateField = (key, sanitizedValue) => {
            switch (key) {
                case 'productCode':
                    if (sanitizedValue.length > 8) {
                        alert('Mã sản phẩm không hợp lệ! Định dạng: SPXXXXXX (6 chữ số).');
                        return null;
                    }
                    break;
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

                case 'purchasePrice':
                    if (sanitizedValue.length > 10) {
                        alert('Giá nhập không được dài hơn 10 ký tự.');
                        return null;
                    }
                    break;

                case 'sellingPrice':
                    if (sanitizedValue.length > 10) {
                        alert('Giá bán không được dài hơn 10 ký tự.');
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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Xử lý khi nhập thông tin lô hàng
    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Thêm lô hàng vào danh sách
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

    // Gửi dữ liệu tới backend
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
        console.log('product.supplier.name.trim(): ', product.supplier.name.trim());
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

        // Console log dữ liệu trong FormData
        console.log('FormData');
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        console.log('product: ', product);

        if (image) formData.append('image', image);

        try {
            const response = await axios.post(`${url}api/sanpham/themsanpham`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Thông báo và reset form sau khi thành công
            alert('Thêm sản phẩm thành công!');
            console.log('Phản hồi từ server:', response.data);

            setProduct({
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
                supplier: {
                    name: '',
                    contact: '',
                    address: '',
                },
                batches: [],
            });
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchLastProductCode();
        } catch (error) {
            // Hiển thị chi tiết lỗi
            console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
            alert(`Thêm sản phẩm thất bại! Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="add-product">
            <div>
                <Link to="/san-pham" className="add-product-form-btn">
                    Quay lại
                </Link>
            </div>
            <h1>Thêm Sản Phẩm</h1>
            <form onSubmit={handleSubmit}>
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
                                        fetchLastProductCode(); // Gọi hàm tạo mã tự động nếu người dùng đồng ý
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
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} />
                </div>

                <button type="submit" className="submit-btn">
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
