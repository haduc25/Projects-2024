const Restaurant = require('../models/restaurant.model');

module.exports = {
    // CREATE RESTAURANT
    async createRestaurant(req, res) {
        try {
            const address = new address({
                city: req.address.city,
                country: req.address.country,
                fullName: req.address.fullName,
                postalCode: req.address.postalCode,
                state: req.address.state,
                streetAddress: req.address.streetAddress,
            });

            const savedAddress = await address.save();

            const restaurant = new restaurant({
                address: savedAddress,
                contactInformation: req.contactInformation,
                cuisineType: req.cuisineType,
                description: req.description,
                images: req.images,
                name: req.name,
                openingHours: req.openingHours,
                registrationDate: req.registrationDate,
                owner: user,
            });

            const savedRestaurant = await restaurant.save();

            return savedRestaurant;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // FIND RESTAURANT BY ID
    async findRestaurantById(restaurantId) {
        try {
            const restaurant = await restaurant.findById(restaurantId);
            if (!restaurant) throw new Error('Không tìm thấy nhà hàng nào!');
            return restaurant;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // DELETE RESTAURANT
    async deleteRestaurant(restaurantId) {
        // method 1: async delete
        /*
            try {
                const restaurant = await restaurant.findByIdAndDelete(restaurantId);
                if (!restaurant) throw new Error('Không tìm thấy nhà hàng nào!');
                return restaurant;
            } catch (error) {
                throw new Error(error.message);
            }
        **/

        // method 2:
        try {
            this.findRestaurantById(restaurantId);
            const restaurant = await Restaurant.deleteById(restaurantId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // GET ALL RESTAURANTS
    async getAllRestaurants() {
        try {
            const restaurants = await Restaurant.find();
            return restaurants;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // GET RESTAURANT BY USER ID
    async getRestaurantsByUserId(userId) {
        try {
            const restaurant = await Restaurant.findOne({ owner: userId }).populate('owner').populate('address');

            if (!restaurant) throw new Error('Không tìm thấy nhà hàng nào!');

            return restaurant;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // SEARCH RESTAURANT:
    async searchRestaurant(keyword) {
        /**
         * $options: 'i': Biến việc tìm kiếm thành không phân biệt chữ hoa chữ thường.
         * Ví dụ, nếu bạn tìm kiếm "pizza", thì kết quả sẽ bao gồm cả "Pizza", "PIZZA", "piZzA",...
         */

        try {
            const restaurants = await Restaurant.find({
                $or: [
                    {
                        name: { $regex: keyword, $options: 'i' },
                        description: { $regex: keyword, $options: 'i' },
                        cuisineType: { $regex: keyword, $options: 'i' },
                    },
                ],
            });
            return restaurants;
        } catch (error) {}
    },

    // ADD TO FAVORITE
    async addToFavorites(restaurantId, user) {
        try {
            const restaurant = await this.findRestaurantById(restaurantId);

            // DTO: Data Transfer Object (Đối tượng Chuyển Dữ Liệu)
            const dto = {
                _id: restaurant._id,
                title: restaurant.name,
                images: restaurant.images,
                description: restaurant.description,
            };

            const favorites = user.favorites || [];
            const index = favorites.findIndex((favorites) => favorites._id === restaurantId);

            if (index !== -1) {
                // Nếu đã có trong danh sách yêu thích => Xóa nhà hàng khỏi danh sách yêu thích bằng cách sử dụng phương thức splice.
                favorites.splice(index, 1);
            } else {
                favorites.push(dto);
                // Thêm đối tượng DTO của nhà hàng vào danh sách yêu thích.
            }

            // Cập nhật danh sách yêu thích của người dùng và lưu vào cơ sở dữ liệu:
            user.favorites = favorites;
            // Sau khi cập nhật danh sách yêu thích, nó lưu lại dữ liệu người dùng (user.save()).
            await user.save();
            return dto;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // UPDATE RESTAURANT STATUS
    async updateRestaurantStatus(id) {
        try {
            const restaurant = await Restaurant.findById(id).populate('owner').populate('address');

            if (!restaurant) {
                throw new Error('Không tìm thấy nhà hàng nào!');
            }

            restaurant.open = !restaurant.open;
            await restaurant.save();
            return restaurant;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
