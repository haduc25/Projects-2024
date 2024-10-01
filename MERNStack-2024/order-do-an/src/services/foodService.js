const Food = require('../models/food.model.js');

module.exports = {
    // CREATE FOOD
    async createFood(req, restaurant) {
        try {
            const food = new Food({
                foodCategory: req.category,
                creationDate: new Date(),
                description: req.description,
                images: req.images,
                name: req.name,
                price: req.price,
                isSeasonal: req.seasonal,
                isVegetarian: req.vegetarian,
                restaurant: restaurant._id,
                ingredients: req.ingredients,
                // available: req.available,
            });

            await food.save();
            restaurant.foods.push(food._id); //restaurant.foods: Đây là một mảng chứa các món ăn mà nhà hàng cung cấp. Trường này phải được định nghĩa trong mô hình Restaurant (trong file restaurant.model.js)
            await restaurant.save();
            return food;
        } catch (error) {
            throw new Error(`Không thể tạo món ăn: ${error.message}`);
        }
    },

    // DELETE FOOD
    async deleteFood(foodId) {
        try {
            const food = await Food.findById(foodId);
            if (!food) throw new Error(`Không tìm thấy món ăn với ID là ${foodId}`);

            // Nếu tìm thấy món ăn
            // food.restaurant = null; //Loại bỏ tham chiếu đến nhà hàng (đặt restaurant thành null)
            // await food.save();
            await Food.findByIdAndDelete(foodId);
        } catch (error) {
            throw new Error(`Không thể xóa món ăn có ID là ${foodId}: ${error.message}`);
        }
    },

    // GET RESTAURANTS FOOD
    async getRestaurantsFood(
        restaurantId,
        vegetarian,
        nonveg, //không ăn chay
        seasonal,
        foodCategory,
    ) {
        /** Hàm getRestaurantsFood lấy danh sách món ăn của một nhà hàng cụ thể dựa trên các tiêu chí lọc
         *  (ăn chay, không ăn chay, món theo mùa, loại món ăn).
         */
        try {
            let query = { restaurant: restaurantId }; // Mặc định, truy vấn sẽ tìm tất cả món ăn có thuộc nhà hàng với ID restaurantId.
            console.log('nonveg: ', nonveg);
            if (vegetarian == 'true') query.isVegetarian = true;

            if (nonveg == 'true') query.isVegetarian = false;
            if (seasonal == 'true') query.isSeasonal = true;
            if (foodCategory) query.foodCategory = foodCategory;

            const foods = await Food.find(query).populate([
                {
                    path: 'ingredients',
                    populate: { path: 'category', select: 'name' },
                },
                'foodCategory',
                {
                    path: 'restaurant',
                    select: 'name _id',
                },
            ]);

            /** Truy vấn các món ăn từ cơ sở dữ liệu với điều kiện được xây dựng trong query.
             * populate() để điền thông tin liên kết:
             * ingredients: Điền thêm thông tin về thành phần nguyên liệu, đồng thời populate thêm danh mục của thành phần đó (category).
             * foodCategory: Điền thêm thông tin về danh mục món ăn.
             * restaurant: Điền thêm tên và ID của nhà hàng.
             *
             * ==== Chỉ lấy ra 2 trường dưới ====
             * `select: 'name _id'`
             * select: 'name _id': Đây là danh sách các trường bạn muốn truy xuất từ tài liệu Restaurant
             * name: Trường này chứa tên của nhà hàng.
             * _id: Trường này chứa ID của nhà hàng.
             */

            return foods; // Sau khi truy vấn và populate, trả về danh sách các món ăn.
        } catch (error) {
            throw new Error(`Không thể lấy món ăn của nhà hàng: ${error.message}`);
        }
    },

    // SEARCH FOOD
    async searchFood(keyword) {
        try {
            let query = {};
            if (keyword) {
                query.$or = [
                    {
                        name: {
                            $regex: keyword,
                            $options: 'i',
                        },
                    },
                    {
                        'foodCategory.name': {
                            $regex: keyword,
                            $options: 'i',
                        },
                    },
                ];
            }

            /**
             * $or: Toán tử trong MongoDB cho phép bạn kết hợp nhiều điều kiện tìm kiếm, trả về các tài liệu thỏa mãn ít nhất một trong các điều kiện.
             * Tìm theo tên món ăn (name)
             *  - Sử dụng $regex để tìm kiếm các món ăn có tên chứa từ khóa, với tùy chọn $options: 'i' để thực hiện tìm kiếm không phân biệt chữ hoa và chữ thường.
             * Tìm theo tên danh mục món ăn (foodCategory.name): (nằm trong - food.model.js)
             *  - Tương tự, tìm kiếm trong trường foodCategory.name để tìm các danh mục mà có tên chứa từ khóa.
             */

            const foods = await Food.find(query); // Sử dụng Food.find(query) để tìm kiếm các món ăn trong cơ sở dữ liệu dựa trên điều kiện đã tạo trong query.
            return foods;
        } catch (error) {
            throw new Error(`Không thể tìm kiếm món ăn: ${error.message}`);
        }
    },

    // UPDATE AVAILIBILITY STATUS | CẬP NHẬT TRẠNG THÁI CÓ SẴN
    async updateAvailabilityStatus(foodId) {
        try {
            const food = await Food.findById(foodId).populate([
                {
                    path: 'ingredients',
                    populate: {
                        path: 'category',
                        select: 'name',
                    },
                },
                {
                    path: 'restaurant',
                    select: 'name _id',
                },
            ]);

            /** Sử dụng Food.findById(foodId) để tìm món ăn có ID tương ứng.
             *  populate: Kết hợp thông tin từ các tài liệu liên quan
             *     - ingredients: Lấy danh sách nguyên liệu cho món ăn và điền thêm thông tin về danh mục nguyên liệu (category).
             *     - restaurant: Lấy tên và ID của nhà hàng liên quan đến món ăn.
             *
             *  path: Xác định trường trong tài liệu hiện tại cần điền thông tin từ tài liệu khác.
             *  select: Chỉ định các trường cần lấy ra từ tài liệu liên quan, giúp tối ưu hóa dữ liệu và hiệu suất.
             */

            if (!food) throw new Error(`Không tìm thấy món ăn với ID là ${foodId}`);

            food.available = !food.available; // Đảo ngược giá trị của thuộc tính available (nếu đang có sẵn thì trở thành không có sẵn và ngược lại).
            await food.save();
            return food;
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái sẵn có cho món ăn với ID là ${foodId}: ${error.message}`);
        }
    },

    // FIND FOOD BY ID
    async findFoodById(foodId) {
        try {
            const food = await Food.findById(foodId);
            if (!food) throw new Error(`Không tìm thấy món ăn với ID là: ${foodId}`);
            return food;
        } catch (error) {
            throw new Error(`Không thể tìm thấy món ăn với ID là ${foodId}: ${error.message}`);
        }
    },
};
