import { useState, useEffect, useContext } from 'react';
import './Home.css';
import { StoreContext } from '../../context/StoreContext.jsx';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [paymentWarning, setPaymentWarning] = useState('');

    const [tongTien, setTongTien] = useState(0);
    const [giamGia, setGiamGia] = useState(0); // Giảm giá nhập từ bàn phím
    const [tongTienSauGiamGia, setTongTienSauGiamGia] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [khachThanhToan, setKhachThanhToan] = useState(0); // Khách thanh toán nhập từ bàn phím

    const { urlImage, cartItems, addToCart, utilityFunctions, getTotalCartAmount, getTotalCartQuantity, product_list } =
        useContext(StoreContext);

    const { formatCurrency } = utilityFunctions;
    const TONG_SO_LUONG_SAN_PHAM = getTotalCartQuantity();

    // Cập nhật tổng tiền mỗi khi giỏ hàng, giảm giá hoặc khách thanh toán thay đổi
    useEffect(() => {
        calcAmount();
    }, [cartItems, giamGia, khachThanhToan]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Thực hiện tìm kiếm ở đây
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setSuggestions([]);
    };

    const calcAmount = () => {
        // const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
        const TONG_TIEN_SAN_PHAM = 100000;
        const TONG_TIEN_SAU_GIAM_GIA = TONG_TIEN_SAN_PHAM - giamGia;

        setTongTien(TONG_TIEN_SAN_PHAM);
        setTongTienSauGiamGia(TONG_TIEN_SAU_GIAM_GIA);

        const TIEN_THUA_TRA_KHACH = khachThanhToan - TONG_TIEN_SAU_GIAM_GIA;

        if (TIEN_THUA_TRA_KHACH < 0) {
            setPaymentWarning(
                `KHÁCH HÀNG CHƯA THANH TOÁN ĐỦ, CÒN THIẾU ${formatCurrency(Math.abs(TIEN_THUA_TRA_KHACH))}`,
            );
            setTienThuaTraKhach(0);
        } else {
            setPaymentWarning('');
            setTienThuaTraKhach(TIEN_THUA_TRA_KHACH);
        }
    };

    // ########### TEST #########
    const [totalAmount, setTotalAmount] = useState(0);

    // Mảng mệnh giá tiền
    const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

    // // Hàm gợi ý mệnh giá tiền
    // const getSuggestions = (amount) => {
    //     // Lọc mệnh giá lớn hơn hoặc bằng số tiền
    //     const suggestions = denominations.filter((denomination) => denomination >= amount);
    //     // Thêm totalAmount vào đầu mảng nếu chưa có
    //     if (!suggestions.includes(amount)) {
    //         suggestions.unshift(amount);
    //     }
    //     return suggestions;
    // };

    const getSuggestions = (amount) => {
        let suggestions = [];

        // Nếu số tiền lớn hơn 500000, gợi ý các mệnh giá bắt đầu từ 500000 và theo quy tắc tăng dần
        if (amount > 500000) {
            let nextAmount = 500000;
            // Duyệt đến mệnh giá lớn hơn hoặc bằng amount
            while (nextAmount < amount) {
                nextAmount += 100000; // Tăng theo bội số 100000
            }
            // Thêm mệnh giá vào mảng gợi ý (tối thiểu là 500000, hoặc lớn hơn)
            while (nextAmount <= amount || suggestions.length < 8) {
                suggestions.push(nextAmount);
                nextAmount += 100000; // Tăng thêm bội số 100000
                if (suggestions.length >= 8) break; // Dừng lại khi đã có đủ 8 lựa chọn
            }
        } else {
            // Mảng mệnh giá tiền nếu số tiền nhỏ hơn hoặc bằng 500000
            suggestions = denominations.filter((denomination) => denomination >= amount);
        }

        // Thêm totalAmount vào đầu mảng nếu chưa có
        if (!suggestions.includes(amount)) {
            suggestions.unshift(amount);
        }

        // Đảm bảo rằng danh sách không vượt quá 8 lựa chọn
        return suggestions.slice(0, 8);
    };

    const handleAmountChange = (event) => {
        const value = parseInt(event.target.value, 10) || 0; // Đảm bảo giá trị luôn là số
        setTotalAmount(value);
    };

    const suggestions2 = getSuggestions(totalAmount);
    // ########### TEST #########

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
                                <label>Giảm giá:</label>
                                <input
                                    style={{ textAlign: 'right' }}
                                    type="text"
                                    value={giamGia}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10) || 0; // Đảm bảo giá trị luôn là số
                                        setGiamGia(value);
                                    }}
                                    placeholder="Nhập giảm giá"
                                    maxLength={12}
                                />
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Khách cần trả</p>
                                <p>{formatCurrency(tongTienSauGiamGia)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <label>Khách thanh toán:</label>
                                <input
                                    style={{ textAlign: 'right' }}
                                    type="text"
                                    value={khachThanhToan}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10) || 0; // Đảm bảo giá trị luôn là số
                                        setKhachThanhToan(value);
                                    }}
                                    placeholder="Nhập số tiền khách thanh toán"
                                    maxLength={12}
                                />
                            </div>
                            <p style={{ color: 'red' }}>{paymentWarning}</p>
                            <hr />
                            <div className="cart-total-details">
                                <b>Tiền thừa trả khách</b>
                                <b>{formatCurrency(tienThuaTraKhach)}</b>
                            </div>
                        </div>
                        <button onClick={() => console.log('Mua hàng')}>MUA HÀNG</button>

                        {/*  */}
                        <div>
                            <input
                                type="text"
                                value={totalAmount}
                                onChange={handleAmountChange}
                                placeholder="Nhập số tiền"
                            />
                            <div>
                                <h3>Gợi ý mệnh giá tiền:</h3>
                                <ul>
                                    {suggestions2.map((suggestion, index) => (
                                        <li key={index}>{suggestion.toLocaleString()} VND</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
