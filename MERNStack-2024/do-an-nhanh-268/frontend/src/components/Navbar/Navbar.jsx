import { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
    const [menu, setMenu] = useState('home');
    return (
        <div className="navbar">
            <img src={assets.logo} alt="" className="logo" />
            <ul className="navbar-menu">
                <li onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
                    Trang chủ
                </li>
                <li onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
                    Thực đơn
                </li>
                <li onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>
                    Mobile-app
                </li>
                <li onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>
                    Liên hệ với chúng tôi
                </li>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" className="search" />
                <div className="navbar-search-icon">
                    <img src={assets.basket_icon} alt="" className="basket" />
                    <div className="dot"></div>
                </div>
                <button>Đăng nhập</button>
            </div>
            {/* <div className="navbar-left"></div> */}
        </div>
    );
};

export default Navbar;
