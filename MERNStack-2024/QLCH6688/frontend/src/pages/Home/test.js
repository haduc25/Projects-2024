import { useState, useEffect, useContext } from 'react';
import './Home.css';
import { StoreContext } from '../../context/StoreContext.jsx';

// Giả sử số tiền khách thanh toán
const KHACH_THANH_TOAN = 100000;

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [paymentWarning, setPaymentWarning] = useState('');

    const [tongTien, setTongTien] = useState(0);
    const [giamGia, setGiamGia] = useState(0);
    const [tongTienSauGiamGia, setTongTienSauGiamGia] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const { urlImage, cartItems, addToCart, utilityFunctions, getTotalCartAmount, getTotalCartQuantity, product_list } =
        useContext(StoreContext);

    const { formatCurrency } = utilityFunctions;
    const TONG_SO_LUONG_SAN_PHAM = getTotalCartQuantity();

    // Cập nhật tổng tiền mỗi khi giỏ hàng hoặc giảm giá thay đổi
    useEffect(() => {
        calcAmount();
    }, [cartItems]);

    const handleSearchChange = (event) => {};

    const handleSearch = (e) => {};

    const handleSuggestionClick = (suggestion) => {};

    const calcAmount = () => {
        const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
        const GIAM_GIA = TONG_TIEN_SAN_PHAM > 0 ? 1000 : 0;
        const TONG_TIEN_SAU_GIAM_GIA = TONG_TIEN_SAN_PHAM - GIAM_GIA;

        setTongTien(TONG_TIEN_SAN_PHAM);
        setGiamGia(GIAM_GIA);
        setTongTienSauGiamGia(TONG_TIEN_SAU_GIAM_GIA);

        const TIEN_THUA_TRA_KHACH = KHACH_THANH_TOAN - TONG_TIEN_SAU_GIAM_GIA;

        if (TIEN_THUA_TRA_KHACH < 0) {
            setPaymentWarning(
                `KHÁCH HÀNG CHƯA THANH TOÁN ĐỦ CÒN THIẾU ${formatCurrency(Math.abs(TIEN_THUA_TRA_KHACH))}`,
            );
            setTienThuaTraKhach(0);
        } else {
            setPaymentWarning('');
            setTienThuaTraKhach(TIEN_THUA_TRA_KHACH);
        }
    };

    return (
        <div className="sale-container">
            <div style={{ backgroundColor: 'lightblue' }}>
                <form onSubmit={handleSearch} autoComplete="off">
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm (Tên, Mã hàng, Mã vạch)"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                    />
                    <button type="submit">Tìm kiếm</button>
                </form>

                {/* Hiển thị danh sách gợi ý */}

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    {searchResults.map((product) => (
                        <div key={product._id}>
                            <h4>{product.name}</h4>
                            <p>Mã hàng: {product.productCode}</p>
                            <p>Mã vạch: {product.barcode}</p>
                            <p>Mô tả: {product.description}</p>
                            <p>Giá bán: {product.sellingPrice} VND</p>
                            <img src={`${urlImage}${product.image}`} alt="image" />
                        </div>
                    ))}
                </div>

                <div>
                    {product_list.map(
                        (item) =>
                            cartItems[item._id] > 0 && (
                                <div key={item._id} className="cart-container">
                                    <div className="cart-items-title cart-items-item">
                                        <img src={`${urlImage}${item.image}`} alt={item.name} />
                                        <p className="cart-items-name">{item.name}</p>
                                        <p>{item.barcode}</p>
                                        <p>{formatCurrency(item.sellingPrice)}</p>
                                        <p className="quantity"> - {cartItems[item._id]} + </p>
                                        <p>{formatCurrency(item.sellingPrice * cartItems[item._id])}</p>
                                        {/* <p onClick={() => removeFromCart(item._id)} className="cross">
                                                x
                                            </p> */}
                                    </div>
                                    <hr />
                                </div>
                            ),
                    )}
                </div>
            </div>

            <div style={{ height: '100%' }}>
                <div className="cart-bottom">
                    <div className="cart-total">
                        <h2>Tổng giỏ hàng</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Tổng số lượng sản phẩm</p>
                                <p>{TONG_SO_LUONG_SAN_PHAM}</p>
                            </div>
                            <div className="cart-total-details">
                                <p>Tổng tiền hàng</p>
                                <p>{formatCurrency(tongTien)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Giảm giá</p>
                                <p>{formatCurrency(giamGia)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Khách cần trả</p>
                                <p>{formatCurrency(tongTienSauGiamGia)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Khách thanh toán</b>
                                <b>{formatCurrency(KHACH_THANH_TOAN)}</b>
                            </div>
                            <p style={{ color: 'red' }}>{paymentWarning}</p>

                            <hr />
                            <div className="cart-total-details">
                                <b>Tiền thừa trả khách</b>
                                <b>{formatCurrency(tienThuaTraKhach)}</b>
                            </div>
                        </div>
                        <button onClick={() => navigate('/dat-hang')}>MUA HÀNG</button>
                    </div>
                    {/* <div className="cart-promocode">
                        <div>
                            <p>Nếu bạn có mã giảm giá, Nhập vào đây</p>
                            <div className="cart-promocode-input">
                                <input type="text" placeholder="Mã giảm giá" />
                                <button>Áp dụng</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Home;
