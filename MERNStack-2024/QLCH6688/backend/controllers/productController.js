import productModel from '../models/productModel.js';
import fs from 'fs';

const addProduct = async (req, res) => {
    let image_filename = req.file ? `${req.file.filename}` : null;
    console.log('req.body: ', req.body);

    // Tạo mảng batches từ form-data và tự động thêm batchNumber
    let batches = [];
    if (req.body.batches) {
        try {
            batches = JSON.parse(req.body.batches); // Parse chuỗi JSON trong req.body.batches
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Lỗi trong việc parse batches' });
        }
    }

    // Xử lý thông tin của từng batch
    batches = batches.map((batch, index) => ({
        entryDate: batch.entryDate,
        batchNumber: `BATCH${(index + 1).toString().padStart(3, '0')}`, // Tự động tạo batchNumber
        expirationDate: batch.expirationDate,
        purchasePrice: parseInt(batch.purchasePrice), // Thêm giá nhập cho lô hàng
        quantity: parseInt(batch.quantity), // Thêm số lượng
    }));

    // Xử lý thông tin của nhà cung cấp
    const supplier = {
        name: req.body['supplier.name'], // Lấy thông tin từ req.body
        contact: req.body['supplier.contact'],
        address: req.body['supplier.address'],
    };

    // Tạo sản phẩm mới
    const product = new productModel({
        productCode: req.body.productCode,
        barcode: req.body.barcode,
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        purchasePrice: parseInt(req.body.purchasePrice), // Chuyển giá thành số
        sellingPrice: parseInt(req.body.sellingPrice), // Chuyển giá thành số
        unit: req.body.unit,
        stock: parseInt(req.body.stock), // Chuyển số lượng thành số
        description: req.body.description,
        notes: req.body.notes,
        supplier: supplier, // Lưu thông tin nhà cung cấp
        image: image_filename,
        batches: batches, // Lưu thông tin lô hàng dưới dạng mảng
    });

    try {
        console.log('BA_product: ', product);
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
    const { productCode, entryDate, expirationDate, purchasePrice, quantity } = req.body;

    // Kiểm tra xem thông tin đã đầy đủ chưa
    if (!productCode || !entryDate || !expirationDate || !purchasePrice || !quantity) {
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
            quantity, // Thêm số lượng mới
        });

        // Lưu lại sản phẩm với mảng `batches` đã được cập nhật
        await product.save();

        res.json({ success: true, message: 'Đã thêm lô hàng thành công', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// Lấy mã sản phẩm cuối cùng
const getLastProductCode = async (req, res) => {
    try {
        const lastProduct = await productModel.findOne().sort({ createdAt: -1 }).select('productCode');
        const lastCode = lastProduct?.productCode || 'SP000000'; // Nếu không có sản phẩm nào, bắt đầu từ SP000000
        res.json({ success: true, lastCode });
    } catch (error) {
        res.status(500).json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export { addProduct, listAllProducts, removeProduct, addBatchToProduct, getLastProductCode };
