import { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets_vn';

const DANG_NHAP = 'Đăng nhập';
const DANG_KY = 'Đăng ký';

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState(DANG_NHAP);

    return (
        <div className="login-popup">
            <form className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="cross icon" />
                </div>
                <div className="login-popup-inputs">
                    {currState === DANG_KY && <input type="text" placeholder="Nhập tên đăng nhập" required />}
                    <input type="email" placeholder="Nhập email" required />
                    <input type="password" placeholder="Nhập mật khẩu" required />
                </div>
                <button>{currState === DANG_KY ? 'Tạo tài khoản' : DANG_NHAP}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Bằng việc tiếp tục, tôi đồng ý với Điều khoản sử dụng & Chính sách bảo mật.</p>
                </div>
                {currState === DANG_NHAP ? (
                    <p>
                        Tạo một tài khoản mới? <span onClick={() => setCurrState(DANG_KY)}>{DANG_KY} ngay</span>
                    </p>
                ) : (
                    <p>
                        Bạn đã có tài khoản? <span onClick={() => setCurrState(DANG_NHAP)}>{DANG_NHAP} ngay</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
