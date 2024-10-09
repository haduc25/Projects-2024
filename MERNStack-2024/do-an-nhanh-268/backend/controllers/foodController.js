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
        console.log('error: ', error);
        res.json({ success: false, message: 'Error' });
    }
};

export { addFood };
