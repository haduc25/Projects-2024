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

const updateProduct = async (req, res) => {
    let image_filename = req.file ? `${req.file.filename}` : null;
    console.log('image_filename: ', image_filename);
    console.log('BA_req:', req.body);
    try {
        const productId = req.params.id; // Lấy ID sản phẩm từ params
        const updatedData = req.body;

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        // Kiểm tra xem productCode có bị thay đổi không
        if (updatedData.productCode && updatedData.productCode !== product.productCode) {
            return res.status(400).json({ success: false, message: 'Không thể thay đổi productCode' });
        }

        // // Cập nhật thông tin hình ảnh nếu có
        // if (req.file) {
        //     updatedData.image = req.file.filename; // Cập nhật hình ảnh mới
        // }
        // Cập nhật thông tin hình ảnh nếu có
        if (image_filename) {
            updatedData.image = image_filename; // Cập nhật hình ảnh mới
        }

        console.log('updatedData.image : ', updatedData.image);

        // Cập nhật thông tin nhà cung cấp
        if (updatedData['supplier.name']) {
            product.supplier.name = updatedData['supplier.name'];
        }
        if (updatedData['supplier.contact']) {
            product.supplier.contact = updatedData['supplier.contact'];
        }
        if (updatedData['supplier.address']) {
            product.supplier.address = updatedData['supplier.address'];
        }

        // Cập nhật các thông tin khác của sản phẩm
        product.barcode = updatedData.barcode || product.barcode;
        product.name = updatedData.name || product.name;
        product.category = updatedData.category || product.category;
        product.brand = updatedData.brand || product.brand;
        product.purchasePrice = updatedData.purchasePrice ? parseInt(updatedData.purchasePrice) : product.purchasePrice;
        product.sellingPrice = updatedData.sellingPrice ? parseInt(updatedData.sellingPrice) : product.sellingPrice;
        product.unit = updatedData.unit || product.unit;
        product.stock = updatedData.stock ? parseInt(updatedData.stock) : product.stock;
        product.description = updatedData.description || product.description;
        product.notes = updatedData.notes || product.notes;
        product.image = updatedData.image || product.image;

        // Cập nhật các batches
        if (updatedData.batches) {
            let batches = [];
            try {
                batches = JSON.parse(updatedData.batches); // Parse chuỗi JSON trong batches
            } catch (error) {
                return res.status(400).json({ success: false, message: 'Lỗi trong việc parse batches' });
            }

            // Xử lý từng batch mới
            batches = batches.map((batch, index) => ({
                entryDate: batch.entryDate,
                batchNumber: batch.batchNumber || `BATCH${(index + 1).toString().padStart(3, '0')}`,
                expirationDate: batch.expirationDate,
                purchasePrice: parseInt(batch.purchasePrice),
                quantity: parseInt(batch.quantity),
            }));

            product.batches = batches; // Cập nhật lại batches cho sản phẩm
        }

        // Lưu lại sản phẩm đã cập nhật
        const updatedProduct = await product.save();

        res.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: updatedProduct });
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

const getDetailProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export {
    addProduct,
    updateProduct,
    listAllProducts,
    removeProduct,
    addBatchToProduct,
    getLastProductCode,
    getDetailProduct,
};
