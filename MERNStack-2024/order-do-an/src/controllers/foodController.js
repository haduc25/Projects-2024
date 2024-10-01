const foodService = require('../service/foodService');
const restaurantService = require('../service/restaurantService');
const userService = require('../service/userService');

module.exports = {
    // CUSTOMER
    // SEARCH FOOD
    searchFood: async (req, res) => {
        try {
            const { name } = req.query;
            const menuItems = await foodService.searchFood(name);
            res.status(200).json(menuItems);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }
    },

    // GET MENU ITEM BY RESTAURANT ID
    getMenuItemByRestaurantId: async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const { vegetarian, seasonal, nonveg, food_category } = req.query;
            const menuItems = await foodService.getRestaurantsFood(
                restaurantId,
                vegetarian,
                nonveg,
                seasonal,
                food_category,
            );

            /**  Sử dụng phương thức getRestaurantsFood của foodService để truy vấn danh sách món ăn
             *      trong nhà hàng với các tiêu chí lọc đã cung cấp.
             */
            res.status(200).json(menuItems);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // ADMIN CONTROLLER
    // CREATE ITEM
    async createItem(req, res) {
        try {
            const item = req.body;
            const user = req.user;

            const restaurant = await restaurantService.findRestaurantById(item.restaurantId);
            const menuItem = await foodService.createFood(item, restaurant);

            /** TÌM NHÀ HÀNG: const restaurant = await restaurantService.findRestaurantById(item.restaurantId);
             * restaurantService.findRestaurantById(item.restaurantId):
             * Dựa trên restaurantId trong thông tin món ăn (item.restaurantId),
             * tìm kiếm nhà hàng tương ứng. Điều này đảm bảo rằng món ăn sẽ được liên kết với một nhà hàng cụ thể.
             *
             * TẠO MÓN ĂN: const menuItem = await foodService.createFood(item, restaurant);
             * foodService.createFood(item, restaurant): Gọi dịch vụ món ăn (foodService)
             * để tạo món ăn mới, truyền dữ liệu món ăn từ item và nhà hàng từ restaurant.
             * service này sẽ xử lý việc lưu món ăn vào cơ sở dữ liệu.
             */

            res.status(200).json(menuItem);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // DELETE ITEM
    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            await foodService.deleteFood(id);
            res.status(200).json({ message: 'Món ăn đã được xóa thành công' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // GET MENU ITEM BY NAME
    async getMenuItemByName(req, res) {
        try {
            const { name } = req.query;
            const menuItem = await foodService.searchFood(name);
            res.status(200).json(menuItem);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }
    },

    // UPDATE AVAILIBILITY STATUS | CẬP NHẬT TRẠNG THÁI CÓ SẴN
    async updateAvailabilityStatus(req, res) {
        try {
            const { id } = req.params;
            // cập nhật trạng thái available
            const menuItem = await foodService.updateAvailabilityStatus(id);
            res.status(200).json(menuItem);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
};
