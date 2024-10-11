import { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets_vn';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/');
    };

    console.log('token: ', token, localStorage.getItem('token'));

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
                    <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="profile" />
                        <ul className="navbar-profile-dropdown">
                            <li>
                                <img src={assets.bag_icon} alt="bag icon" />
                                Đơn hàng
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="bag icon" />
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
