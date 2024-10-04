import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="header-contents">
                <h2>Đặt món ăn yêu thích của bạn ở đây</h2>
                <p>
                    Hãy lựa chọn từ thực đơn đa dạng với nhiều món ăn hấp dẫn được chế biến từ những nguyên liệu tốt
                    nhất và tay nghề nấu nướng điêu luyện. Sứ mệnh của chúng tôi là thỏa mãn cơn thèm ăn của bạn và nâng
                    tầm trải nghiệm ẩm thực, từng bữa ăn ngon lành.
                </p>
                <button>Xem thực đơn</button>
            </div>
        </div>
    );
};

export default Header;
