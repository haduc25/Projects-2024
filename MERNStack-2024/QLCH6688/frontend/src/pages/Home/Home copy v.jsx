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

    const {
        urlImage,
        cartItems,
        addToCart,
        removeFromCart,
        utilityFunctions,
        getTotalCartAmount,
        getTotalCartQuantity,
        product_list,
    } = useContext(StoreContext);

    const { formatCurrency } = utilityFunctions;
    const TONG_SO_LUONG_SAN_PHAM = getTotalCartQuantity();

    // Shortcut tìm kiếm
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F3') {
                event.preventDefault();
                document.getElementById('search-input').focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Cập nhật tổng tiền mỗi khi giỏ hàng hoặc giảm giá thay đổi
    useEffect(() => {
        calcAmount();
    }, [cartItems]);

    const handleSearchChange = (event) => {
        let value = event.target.value;

        // Loại bỏ ký tự đặc biệt
        const removeSpecialChars = (input) => {
            const specialChars = '!@#$%^&*()_+={}[]|\\:;"\'<>,.?/~`-';
            return input
                .split('')
                .filter((char) => !specialChars.includes(char))
                .join('');
        };

        value = removeSpecialChars(value);
        setSearchTerm(value);

        if (value.trim()) {
            const filteredSuggestions = product_list
                .filter(
                    (product) =>
                        product.name.toLowerCase().includes(value.toLowerCase()) ||
                        product.barcode.toLowerCase().includes(value.toLowerCase()) ||
                        product.sellingPrice.toString().includes(value),
                )
                .map((product) => ({
                    name: product.name,
                    barcode: product.barcode,
                    sellingPrice: product.sellingPrice,
                    image: product.image,
                }))
                .slice(0, 5); // Giới hạn 5 gợi ý

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError('Vui lòng nhập thông tin tìm kiếm!');
            return;
        }
        setError('');
        const filteredProducts = product_list.filter((product) => {
            const searchText = searchTerm.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchText) ||
                product.productCode.toLowerCase().includes(searchText) ||
                product.barcode.toLowerCase().includes(searchText) ||
                product.sellingPrice.toString().includes(searchText)
            );
        });

        if (filteredProducts.length === 0) {
            setError(`Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchTerm}"`);
            return;
        }

        addToCart(filteredProducts[0]._id);
        setSearchResults(filteredProducts);
        setSearchTerm('');
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setSuggestions([]);
    };

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
                {suggestions.length > 0 && (
                    <ul className="suggestion-list">
                        {suggestions.map((suggestion, index) => {
                            const searchText = searchTerm.toLowerCase();

                            // Tìm vị trí khớp trong từng trường
                            const nameStartIndex = suggestion.name.toLowerCase().indexOf(searchText);
                            const barcodeStartIndex = suggestion.barcode.toLowerCase().indexOf(searchText);
                            const priceStartIndex = suggestion.sellingPrice.toString().indexOf(searchText);

                            return (
                                <li
                                    key={index}
                                    className="list-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="suggestion-item">
                                        {/* Hình ảnh sản phẩm */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                            <img
                                                src={`${urlImage}${suggestion.image}`}
                                                alt={suggestion.name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                }}
                                            >
                                                <div>
                                                    {/* Hiển thị tên sản phẩm với từ khóa được tô đậm */}
                                                    {nameStartIndex !== -1 ? (
                                                        <div>
                                                            {suggestion.name.substring(0, nameStartIndex)}
                                                            <b>
                                                                {suggestion.name.substring(
                                                                    nameStartIndex,
                                                                    nameStartIndex + searchTerm.length,
                                                                )}
                                                            </b>
                                                            {suggestion.name.substring(
                                                                nameStartIndex + searchTerm.length,
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{suggestion.name}</div>
                                                    )}

                                                    {/* Hiển thị mã vạch với từ khóa được tô đậm */}
                                                    {barcodeStartIndex !== -1 ? (
                                                        <div>
                                                            {suggestion.barcode.substring(0, barcodeStartIndex)}
                                                            <b>
                                                                {suggestion.barcode.substring(
                                                                    barcodeStartIndex,
                                                                    barcodeStartIndex + searchTerm.length,
                                                                )}
                                                            </b>
                                                            {suggestion.barcode.substring(
                                                                barcodeStartIndex + searchTerm.length,
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{suggestion.barcode}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    {/* Hiển thị giá bán với từ khóa được tô đậm */}
                                                    {priceStartIndex !== -1 ? (
                                                        <div>
                                                            {suggestion.sellingPrice
                                                                .toString()
                                                                .substring(0, priceStartIndex)}
                                                            <b>
                                                                {suggestion.sellingPrice
                                                                    .toString()
                                                                    .substring(
                                                                        priceStartIndex,
                                                                        priceStartIndex + searchTerm.length,
                                                                    )}
                                                            </b>
                                                            {suggestion.sellingPrice
                                                                .toString()
                                                                .substring(priceStartIndex + searchTerm.length)}{' '}
                                                            VND
                                                        </div>
                                                    ) : (
                                                        <div>{suggestion.sellingPrice} VND</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

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
