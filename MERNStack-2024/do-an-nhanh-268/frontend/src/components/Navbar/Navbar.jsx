import { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets_vn';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    return (
        <div className="navbar">
            <Link to="/">
                <img src={assets.logo} alt="" className="logo" />
            </Link>

            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
                    Trang chủ
                </Link>
                <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
                    Thực đơn
                </a>
                <a
                    href="#app-download"
                    onClick={() => setMenu('mobile-app')}
                    className={menu === 'mobile-app' ? 'active' : ''}
                >
                    Mobile-app
                </a>
                <a
                    href="#footer"
                    onClick={() => setMenu('contact-us')}
                    className={menu === 'contact-us' ? 'active' : ''}
                >
                    Liên hệ với chúng tôi
                </a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" className="search" />
                <div className="navbar-search-icon">
                    <Link to="/gio-hang">
                        <img src={assets.basket_icon} alt="" className="basket" />
                    </Link>
                    <div className="dot"></div>
                </div>
                <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
            </div>
            {/* <div className="navbar-left"></div> */}
        </div>
    );
};

export default Navbar;
