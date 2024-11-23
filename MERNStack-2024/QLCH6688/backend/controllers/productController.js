import productModel from '../models/productModel.js';
import fs from 'fs';

// Thêm sản phẩm mới
const addProduct = async (req, res) => {
    let image_filename = req.file ? `${req.file.filename}` : null;

    // Tạo mảng batches từ form-data và tự động thêm batchNumber
    const batches = [];
    let i = 0;

    while (req.body[`batches[${i}].entryDate`]) {
        batches.push({
            entryDate: req.body[`batches[${i}].entryDate`],
            batchNumber: `BATCH${(i + 1).toString().padStart(3, '0')}`, // Tự động tạo batchNumber
            expirationDate: req.body[`batches[${i}].expirationDate`],
            purchasePrice: req.body[`batches[${i}].purchasePrice`], // Thêm giá nhập cho lô hàng
        });
        i++;
    }

    const product = new productModel({
        productCode: req.body.productCode,
        barcode: req.body.barcode,
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        purchasePrice: req.body.purchasePrice,
        sellingPrice: req.body.sellingPrice,
        unit: req.body.unit,
        stock: req.body.stock,
        description: req.body.description,
        notes: req.body.notes,
        supplier: {
            name: req.body.supplierName,
            contact: req.body.supplierContact,
            address: req.body.supplierAddress,
            email: req.body.supplierEmail,
        },
        image: image_filename,
        batches: batches, // Lưu thông tin lô hàng dưới dạng mảng
    });

    try {
        await product.save();
        res.json({ success: true, message: 'Đã thêm sản phẩm thành công', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// Danh sách tất cả sản phẩm
const listAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// Xoá sản phẩm
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);

        // Xoá ảnh trong `uploads`
        fs.unlink(`uploads/${product.image}`, () => {});

        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: `Đã xóa sản phẩm thành công ${req.body.id}` });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// Thêm lô hàng mới (cập nhật thông tin lô hàng cho sản phẩm)
const addBatchToProduct = async (req, res) => {
    const { productCode, entryDate, expirationDate, purchasePrice } = req.body;

    // Kiểm tra xem thông tin đã đầy đủ chưa
    if (!productCode || !entryDate || !expirationDate || !purchasePrice) {
        return res.status(400).json({ success: false, message: 'Thông tin không đầy đủ' });
    }

    try {
        // Tìm sản phẩm theo productCode
        const product = await productModel.findOne({ productCode });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
        }

        // Tạo batchNumber mới bằng cách sử dụng mảng batches và tăng dần số lô
        const newBatchNumber = `BATCH${(product.batches.length + 1).toString().padStart(3, '0')}`;

        // Thêm thông tin lô hàng mới vào mảng `batches`
        product.batches.push({
            entryDate,
            batchNumber: newBatchNumber,
            expirationDate,
            purchasePrice, // Thêm giá nhập cho lô hàng mới
        });

        // Lưu lại sản phẩm với mảng `batches` đã được cập nhật
        await product.save();

        res.json({ success: true, message: 'Đã thêm lô hàng thành công', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export { addProduct, listAllProducts, removeProduct, addBatchToProduct };
