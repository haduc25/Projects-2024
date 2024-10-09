import foodModel from '../models/foodModel.js';
import fs from 'fs'; //Thư viện File System - có sẵn trong nodejs

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    console.log('req-body: ', req.body);
    console.log('req.file: ', req.file);

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });

    try {
        await food.save();
        res.json({ success: true, message: 'Đã thêm món ăn' });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        // xoá ảnh trong `uploads`
        fs.unlink(`uploads/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Đã xóa món ăn' });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export { addFood, listFood, removeFood };
