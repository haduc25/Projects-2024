import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { StoreContext } from '../../context/StoreContext';

const ProductDetail = ({ productId }) => {
    const { urlImage, url, product_list, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency, convertCategory } = utilityFunctions;
    const [product, setProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    // Lấy thông tin sản phẩm khi component được render
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}api/sanpham/chitietsanpham/${id}`);
                setProduct(response.data);
                setValue('name', response.data.name);
                setValue('barcode', response.data.barcode);
                setValue('category', response.data.category);
                setValue('brand', response.data.brand);
                setValue('purchasePrice', response.data.purchasePrice);
                setValue('sellingPrice', response.data.sellingPrice);
                setValue('unit', response.data.unit);
                setValue('stock', response.data.stock);
                setValue('description', response.data.description);
                setValue('notes', response.data.notes);
                setValue('supplier.name', response.data.supplier.name);
                setValue('supplier.contact', response.data.supplier.contact);
                setValue('supplier.address', response.data.supplier.address);
            } catch (error) {
                console.error('Error fetching product', error);
            }
        };

        fetchProduct();
    }, [productId, setValue]);

    // Xử lý khi người dùng chọn hình ảnh mới
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Xử lý khi submit form
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Thêm dữ liệu form vào FormData
        formData.append('name', data.name);
        formData.append('barcode', data.barcode);
        formData.append('category', data.category);
        formData.append('brand', data.brand);
        formData.append('purchasePrice', data.purchasePrice);
        formData.append('sellingPrice', data.sellingPrice);
        formData.append('unit', data.unit);
        formData.append('stock', data.stock);
        formData.append('description', data.description);
        formData.append('notes', data.notes);
        formData.append('supplier.name', data['supplier.name']);
        formData.append('supplier.contact', data['supplier.contact']);
        formData.append('supplier.address', data['supplier.address']);

        // Nếu có hình ảnh, thêm vào FormData
        if (data.image) {
            formData.append('image', data.image[0]);
        }

        try {
            const response = await axios.put(`/api/products/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating product', error);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-product">
            <h2>Cập nhật sản phẩm</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Tên sản phẩm</label>
                    <input {...register('name', { required: true })} defaultValue={product.name} />
                    {errors.name && <span>Chưa nhập tên sản phẩm</span>}
                </div>

                <div>
                    <label>Mã sản phẩm (productCode)</label>
                    <input {...register('barcode')} defaultValue={product.barcode} />
                </div>

                <div>
                    <label>Danh mục</label>
                    <input {...register('category')} defaultValue={product.category} />
                </div>

                <div>
                    <label>Thương hiệu</label>
                    <input {...register('brand')} defaultValue={product.brand} />
                </div>

                <div>
                    <label>Giá mua</label>
                    <input type="number" {...register('purchasePrice')} defaultValue={product.purchasePrice} />
                </div>

                <div>
                    <label>Giá bán</label>
                    <input type="number" {...register('sellingPrice')} defaultValue={product.sellingPrice} />
                </div>

                <div>
                    <label>Đơn vị</label>
                    <input {...register('unit')} defaultValue={product.unit} />
                </div>

                <div>
                    <label>Số lượng</label>
                    <input type="number" {...register('stock')} defaultValue={product.stock} />
                </div>

                <div>
                    <label>Mô tả</label>
                    <textarea {...register('description')} defaultValue={product.description} />
                </div>

                <div>
                    <label>Ghi chú</label>
                    <textarea {...register('notes')} defaultValue={product.notes} />
                </div>

                <div>
                    <h3>Thông tin nhà cung cấp</h3>
                    <label>Tên nhà cung cấp</label>
                    <input {...register('supplier.name')} defaultValue={product.supplier.name} />
                    <label>Liên hệ</label>
                    <input {...register('supplier.contact')} defaultValue={product.supplier.contact} />
                    <label>Địa chỉ</label>
                    <input {...register('supplier.address')} defaultValue={product.supplier.address} />
                </div>

                <div>
                    <label>Hình ảnh sản phẩm</label>
                    <input type="file" {...register('image')} onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Image preview" width="100" />}
                </div>

                <button type="submit">Cập nhật sản phẩm</button>
            </form>
        </div>
    );
};

export default ProductDetail;
