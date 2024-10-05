import { assets } from '../../assets/assets_vn';
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="logo" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta saepe eos distinctio vel illum!
                        Saepe ex dolorum magnam ea provident doloremque corrupti maxime minima molestiae veniam. Culpa
                        accusantium a est!
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="facebook icon" />
                        <img src={assets.twitter_icon} alt="twitter icon" />
                        <img src={assets.linkedin_icon} alt="linkedin icon" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Công ty</h2>
                    <ul>
                        <li>Trang chủ</li>
                        <li>Giới thiệu</li>
                        <li>Giao hàng</li>
                        <li>Chính sách quyền riêng tư</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Liên hệ</h2>
                    <ul>
                        <li>+84 964 103 861</li>
                        <li>duchm250901@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 © duc25.com - All Right Reserved.</p>
        </div>
    );
};

export default Footer;
