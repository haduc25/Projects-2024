import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';

const Navbar = () => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/');
    };

    return (
        <div className="navbar" style={{ borderBottom: '1px solid' }}>
            <Link to="/">{/* <img src={assets.logo} alt="" className="logo" /> */}</Link>

            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
                    Trang chủ
                </Link>
                <Link to="/san-pham" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
                    Hàng hóa
                </Link>
                <a href="#explore-menu2" onClick={() => setMenu('menu2')} className={menu === 'menu2' ? 'active' : ''}>
                    Thống kê
                </a>
                <a
                    href="#app-download"
                    onClick={() => setMenu('mobile-app')}
                    className={menu === 'mobile-app' ? 'active' : ''}
                >
                    Doanh thu
                </a>
                <Link
                    to="/ban-hang"
                    onClick={() => setMenu('contact-us')}
                    className={menu === 'contact-us' ? 'active' : ''}
                >
                    Bán hàng
                </Link>
            </ul>
            <div className="navbar-right">
                {/* <img src={assets.search_icon} alt="" className="search" /> */}
                <div className="navbar-search-icon">
                    <Link to="/gio-hang">{/* <img src={assets.basket_icon} alt="" className="basket" /> */}</Link>
                    {/* <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div> */}
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
                ) : (
                    <div className="navbar-profile">
                        {/* <img src={assets.profile_icon} alt="profile" /> */}
                        <ul className="navbar-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
                                {/* <img src={assets.bag_icon} alt="bag icon" /> */}
                                Đơn hàng của tôi
                            </li>
                            <hr />
                            <li onClick={logout}>
                                {/* <img src={assets.logout_icon} alt="bag icon" /> */}
                                <p>Đăng xuất</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            {/* <div className="navbar-left"></div> */}
        </div>
    );
};

export default Navbar;
