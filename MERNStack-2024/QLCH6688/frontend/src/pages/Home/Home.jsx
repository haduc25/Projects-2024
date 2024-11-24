import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center' }}>
            <p>Home</p>
            <hr />
            <h3>
                <Link to="/ban-hang">Bán hàng</Link>
            </h3>
            <hr />
            <h3>
                <Link to="/san-pham">Sản phẩm</Link>
            </h3>
            <hr />
        </div>
    );
};

export default Home;
