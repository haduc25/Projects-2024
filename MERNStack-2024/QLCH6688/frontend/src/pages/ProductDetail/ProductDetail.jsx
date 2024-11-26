import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const ProductDetail = () => {
    const { urlImage, url, product_list, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency, convertCategory } = utilityFunctions;
    const { id } = useParams(); // Lấy id từ URL
    const [userImageUpload, setUserImageUpload] = useState(null);
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
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}api/sanpham/chitietsanpham/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };
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
        console.log('product.supplier.name.trim(): ', product.supplier.name.trim());
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
        console.log('##################### FormData #####################');
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        console.log('##################### FormData #####################');
        console.log('product: ', product);
        console.log('file: ', file);
        // console.log('image: ', image);

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

    // Xử lý thay đổi thông tin sản phẩm
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('supplier.')) {
            const subKey = name.split('.')[1];
            setProduct((prev) => ({
                ...prev,
                supplier: { ...prev.supplier, [subKey]: value },
            }));
        } else {
            setProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatch((prev) => ({
            ...prev,
            [name]: value,
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
        <div className="edit-product">
            <h1>Chỉnh sửa sản phẩm</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Tên sản phẩm:</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Mã sản phẩm:</label>
                    <input
                        type="text"
                        name="productCode"
                        value={product.productCode}
                        onChange={handleChange}
                        disabled
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
                <div>
                    <label>Nhà cung cấp:</label>
                    <input type="text" name="supplier.name" value={product.supplier.name} onChange={handleChange} />
                    <input
                        type="text"
                        name="supplier.contact"
                        placeholder="Liên hệ"
                        value={product.supplier.contact}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="supplier.address"
                        placeholder="Địa chỉ"
                        value={product.supplier.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Giá nhập:</label>
                    <input type="number" name="purchasePrice" value={product.purchasePrice} onChange={handleChange} />
                </div>
                <div>
                    <label>Giá bán:</label>
                    <input type="number" name="sellingPrice" value={product.sellingPrice} onChange={handleChange} />
                </div>
                <div>
                    <label>Kho:</label>
                    <input type="number" name="stock" value={product.stock} onChange={handleChange} />
                </div>
                <div>
                    <label>Mô tả:</label>
                    <textarea name="description" value={product.description} onChange={handleChange}></textarea>
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
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                </div>
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default ProductDetail;
