import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home/Home';
import ChiTietSanPhamPopup from './components/ChiTietSanPhamPopup';

const App = () => {
    // const [showLogin, setShowLogin] = useState(false);
    // const [showChiTietSanPham, setShowChiTietSanPham] = useState(true);

    return (
        <>
            {/* {showLogin && <LoginPopup setShowLogin={setShowLogin} />} */}
            {/* {showChiTietSanPham && <ChiTietSanPhamPopup setShowChiTietSanPham={setShowChiTietSanPham} />} */}
            <div className="app">
                {/* <Navbar setShowLogin={setShowLogin} /> */}
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* <Route path="/gio-hang" element={<Cart />} /> */}
                    {/* <Route path="/dat-hang" element={<PlaceOrder />} /> */}
                    {/* <Route path="/verify" element={<Verify />} /> */}
                    {/* <Route path="/myorders" element={<MyOrders />} /> */}
                </Routes>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default App;
