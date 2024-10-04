module.exports = {
    async createCategory(req, res) {
        try {
            const category = req.body;
            const user = req.user;
            const createdCategory = await categoryService.createCategory(category.name, user._id);
            res.status(200).json(createdCategory);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
};
