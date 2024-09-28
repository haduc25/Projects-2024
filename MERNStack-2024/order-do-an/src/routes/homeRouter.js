const { Router } = require('express');
const router = Router();

router.get('', async (req, res) => {
    res.status(200).send({ message: 'Chào mừng đến với trang web order đồ ăn trực tuyến!' });
});

module.exports = router;
