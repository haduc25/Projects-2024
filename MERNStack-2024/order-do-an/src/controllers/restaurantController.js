const restaurantService = require('../service/restaurantService');

module.exports = {
    // CREATE RESTAURANT
    createRestaurant: async (req, res) => {
        try {
            const user = req.user;
            const restaurant = await restaurantService.createRestaurant(req.body, user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // DELETE RESTAURANT BY ID
    deleteRestaurantById: async (res, res) => {
        try {
            // const { id } = req.params;
            // const { jwt } = req.body;
            // const user = await userService.findUserProfileByJwt(jwt);
            // await restaurantService.deleteRestaurant(id);
            // res.status(200).json({
            //     message: 'Đã xóa nhà hàng thành công',
            //     success: true,
            // });

            const { id } = req.params;
            const user = req.user;
            await restaurantService.deleteRestaurant(id);
            res.status(200).json({
                message: 'Đã xóa nhà hàng thành công',
                success: true,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // UPDATE RESTAURANT STATUS
    updateRestaurantStatus: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Restaurant ID:', id);
            const restaurant = await restaurantService.updateRestaurantStatus(id.toString());

            console.log('Restaurant ID[2]:', id);
            res.status(200).json(restaurant);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // FIND RESTAURANT BY USER ID
    findRestaurantByUserId: async (req, res) => {
        try {
            const user = req.user;
            const restaurant = await restaurantService.getRestaurantsByUserId(user._id);
            res.status(200).json(restaurant);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // FIND RESTAURANT BY NAME
    findRestaurantByName: async (req, res) => {
        try {
            const { keyword } = req.query;
            const restaurants = await restaurantService.searchRestaurant(keyword);
            res.status(200).json(restaurants);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // GET ALL RESTAURANTS
    getAllRestaurants: async (req, res) => {
        try {
            const restaurants = await restaurantService.getAllRestaurants();
            res.status(200).json(restaurants);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // FIND RESTAURANT BY ID
    findRestaurantById: async (req, res) => {
        try {
            const { id } = req.params;
            const restaurant = await restaurantService.findRestaurantById(id);
            res.status(200).json(restaurant);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // ADD TO FAVORITE
    addToFavorite: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const restaurant = await restaurantService.addToFavorites(id, user);
            res.status(200).json(restaurant);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
};
