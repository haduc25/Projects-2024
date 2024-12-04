import { useState, useEffect, useContext, useRef } from 'react';
import './AddProduct.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const AddProduct = () => {
    const { urlImage, url, utilityFunctions, fetchProductList } = useContext(StoreContext);
    const { formatCurrency, formatDateFromYYYYMMDDToVietNamDate, removeSpecialChars } = utilityFunctions;

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
            const response = await axios.get(`${url}api/sanpham/laymasanphamcuoicung`);
            const lastCode = response.data.lastCode || 'SP000000'; // Nếu không có sản phẩm nào, bắt đầu từ SP000000
            const newCode = `SP${(parseInt(lastCode.slice(2)) + 1).toString().padStart(6, '0')}`; // Tăng mã sản phẩm
            setProduct((prev) => ({ ...prev, productCode: newCode })); // Cập nhật mã sản phẩm mới
        } catch (error) {
            console.error('Lỗi lấy mã sản phẩm cuối:', error);
            alert('Không thể lấy mã sản phẩm cuối!');
        }
    };

    // Fetch mã sản phẩm tự động
    useEffect(() => {
        fetchLastProductCode();
        console.log('productCode: ', product.productCode);
    }, []);

    // handle delete batch
    const [deleteBatchMode, setDeleteBatchMode] = useState(false);
    const [selectedBatches, setSelectedBatches] = useState([]);

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

        // Hiển thị cảnh báo xác nhận
        const confirmSubmit = window.confirm('Sản phẩm mới sẽ được thêm vào. Bạn có chắc chắn muốn tiếp tục?');
        if (!confirmSubmit) {
            return; // Dừng nếu người dùng không xác nhận
        }

        const formData = new FormData();
        // Case 1
        // for (const key in product) {
        //     if (key === 'supplier') {
        //         for (const subKey in product.supplier) {
        //             formData.append(`supplier.${subKey}`, product.supplier[subKey]);
        //         }
        //     } else if (key === 'batches') {
        //         formData.append('batches', JSON.stringify(product.batches));
        //     } else {
        //         formData.append(key, product[key]);
        //     }
        // }

        // Case 2
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
        if (image) formData.append('image', image);

        //// Console log dữ liệu trong FormData
        //    console.log('FormData');
        //    formData.forEach((value, key) => {
        //        console.log(`${key}: ${value}`);
        //    });
        //    console.log('product: ', product);

        try {
            const response = await axios.post(`${url}api/sanpham/themsanpham`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Thông báo và reset form sau khi thành công
            fetchProductList();

            // Reset values to default values
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

            // Refresh lại trang
            window.location.reload();

            alert(response.data.message);
            // navigate('/sanpham'); // Quay lại trang danh sách sản phẩm
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
                    if (sanitizedValue.length > 100) {
                        alert('Tên sản phẩm không được dài hơn 100 ký tự.');
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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleBatchChange = (e, field) => {
        const { name, value } = e.target;
        const key = field || name;

        // Validate cho từng trường
        const validateField = (key, value) => {
            switch (key) {
                case 'purchasePrice': {
                    if (value.length > 10) {
                        alert('Giá nhập không được dài hơn 10 ký tự.');
                        return null;
                    }
                    if (!/^\d*$/.test(value)) {
                        alert('Giá mua chỉ được chứa số.');
                        return null;
                    }
                    break;
                }
                case 'quantity': {
                    if (value.length > 5) {
                        alert('Số lượng không được dài hơn 5 ký tự.');
                        return null;
                    }
                    break;
                }
                default:
                    break;
            }
            return value; // Trả về giá trị đã lọc
        };

        // Validate giá trị
        const validValue = validateField(key, value);
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
            <h1>Thêm mới sản phẩm</h1>
            <Link to="/sanpham" className="back-to-product-form-btn">
                Quay lại
            </Link>
            <form className="detail-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={{ maxWidth: '600px', paddingLeft: '24px' }}>
                    <div className="form-group">
                        <label>Mã sản phẩm (tự động):</label>
                        <input type="text" name="productCode" value={product.productCode} disabled />
                    </div>
                    <div className="form-group">
                        <label>*Mã vạch:</label>
                        <input
                            required
                            type="text"
                            name="barcode"
                            value={product.barcode}
                            onChange={(e) => handleChange(e, 'barcode')}
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
                        />
                    </div>
                    <div className="form-group">
                        <label>*Nhóm hàng:</label>
                        <select
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
                            <option value="mitom">Mì tôm</option>
                            <option value="pho">Phở</option>
                            <option value="bun">Bún</option>
                            <option value="chao">Cháo</option>
                            <option value="mien">Miến</option>
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
                        <label>*Đơn vị tính:</label>
                        <input
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
                            required
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={(e) => handleChange(e, 'stock')}
                        />
                    </div>
                    <div className="form-group">
                        <label>*Ảnh sản phẩm:</label>
                        <br />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <input required type="file" ref={fileInputRef} onChange={handleImageChange} />
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '600px', paddingLeft: '24px' }}>
                    <div className="form-group">
                        <label>Mô tả sản phẩm:</label>
                        <textarea
                            placeholder="Nhập mô tả cho sản phẩm"
                            name="description"
                            value={product.description}
                            onChange={(e) => handleChange(e, 'description')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Ghi chú:</label>
                        <textarea
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
                                <label>*Ngày nhập hàng:</label>
                                <input
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
                                <label>*Ngày hết hạn:</label>
                                <input
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
                        >
                            Thêm lô hàng
                        </button>

                        <button
                            disabled={product.batches.length === 0}
                            type="button"
                            style={{ padding: '8px 4px', marginRight: '16px', marginTop: '8px' }}
                            onClick={() => {
                                if (deleteBatchMode) {
                                    // Khi đang ở chế độ chọn, thực hiện xóa các lô hàng đã chọn
                                    const confirmDelete = window.confirm(
                                        'Bạn có chắc chắn muốn xóa các lô hàng đã chọn?',
                                    );
                                    if (confirmDelete) {
                                        setProduct((prev) => ({
                                            ...prev,
                                            batches: prev.batches.filter(
                                                (_, index) => !selectedBatches.includes(index),
                                            ),
                                        }));
                                        setSelectedBatches([]); // Xóa danh sách đã chọn
                                    }
                                }
                                setDeleteBatchMode(!deleteBatchMode); // Chuyển đổi chế độ
                            }}
                        >
                            {deleteBatchMode ? 'Xóa các lô hàng đã chọn' : 'Xóa lô hàng'}
                        </button>
                    </div>
                    <ul>
                        {product.batches.map((batch, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                <b>Số lô {index + 1}:</b>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p>Ngày nhập: {formatDateFromYYYYMMDDToVietNamDate(batch.entryDate)}</p>
                                        <p>Giá nhập: {formatCurrency(batch.purchasePrice)}</p>
                                    </div>
                                    {deleteBatchMode && (
                                        <input
                                            type="checkbox"
                                            checked={selectedBatches.includes(index)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    // Thêm vào danh sách đã chọn
                                                    setSelectedBatches((prev) => [...prev, index]);
                                                } else {
                                                    // Loại bỏ khỏi danh sách đã chọn
                                                    setSelectedBatches((prev) => prev.filter((i) => i !== index));
                                                }
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p>Ngày hết hạn: {formatDateFromYYYYMMDDToVietNamDate(batch.expirationDate)}</p>
                                        <p>Số lượng: {batch.quantity}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            minHeight: '200px',
                            marginTop: '14px',
                            padding: '18px',
                        }}
                    >
                        {/*  */}
                        <button type="submit" style={{ padding: '8px 4px', marginRight: '16px' }}>
                            Thêm mới sản phẩm
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
