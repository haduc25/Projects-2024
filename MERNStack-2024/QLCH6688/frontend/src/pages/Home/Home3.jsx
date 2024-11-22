import { useState, useEffect, useContext } from 'react';
import './Home.css';
import { StoreContext } from '../../context/StoreContext.jsx';

const CHI_PHI_VAN_CHUYEN = 2000;

// Khách thanh toán (giả sử số tiền khách đưa vào)
let KHACH_THANH_TOAN = 5000; // Thay bằng số tiền khách thực sự thanh toán

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [paymentWarning, setPaymentWarning] = useState('');
    const [tongTien, setTongTien] = useState(0);

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

    // useEffect(() => {
    //     calcAmount();
    // }, [paymentWarning]);

    const handleSearchChange = (event) => {
        let value = event.target.value;

        // Hàm loại bỏ ký tự đặc biệt
        const removeSpecialChars = (input) => {
            const specialChars = '!@#$%^&*()_+={}[]|\\:;"\'<>,.?/~`-'; // Danh sách ký tự đặc biệt
            return input
                .split('')
                .filter((char) => !specialChars.includes(char))
                .join('');
        };

        // Loại bỏ ký tự đặc biệt
        value = removeSpecialChars(value);

        setSearchTerm(value);

        if (value.trim()) {
            // Lọc danh sách gợi ý dựa trên tên hoặc mã vạch
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
                    image: product.image, // Thêm hình ảnh vào gợi ý
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

        // console.log('filteredProducts: ', filteredProducts[0]._id);
        addToCart(filteredProducts[0]._id);
        console.log('cartItems: ', cartItems);
        console.log('product_list: ', product_list);
        setSearchResults(filteredProducts);

        // calc
        calcAmount();

        // Clear input fields
        setSearchTerm('');
        setSuggestions([]); // Ẩn gợi ý sau khi tìm kiếm
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name); // Điền tên sản phẩm vào ô tìm kiếm
        setSuggestions([]); // Ẩn danh sách gợi ý
    };

    // // Tính tổng
    // const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
    // const CHI_PHI_VAN_CHUYEN_THUC_TE = TONG_TIEN_SAN_PHAM === 0 ? 0 : CHI_PHI_VAN_CHUYEN;
    // const TONG_TIEN = TONG_TIEN_SAN_PHAM + CHI_PHI_VAN_CHUYEN_THUC_TE;

    // // Tính tổng
    // Tổng tiền hàng
    // Giảm giá
    // Khách cần trả
    // Khách thanh toán

    // const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
    // // const CHI_PHI_VAN_CHUYEN_THUC_TE = TONG_TIEN_SAN_PHAM === 0 ? 0 : CHI_PHI_VAN_CHUYEN;
    // // const TONG_TIEN = TONG_TIEN_SAN_PHAM + CHI_PHI_VAN_CHUYEN_THUC_TE;

    // console.log(getTotalCartAmount());
    // console.log('product_list: ', product_list);

    // ################### TESTING ZONE ################# //
    // Lấy tổng tiền sản phẩm
    const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
    const TONG_SO_LUONG_SAN_PHAM = getTotalCartQuantity();

    // Giảm giá
    const GIAM_GIA = TONG_TIEN_SAN_PHAM > 0 ? 1000 : 0; // Giảm giá chỉ áp dụng nếu có sản phẩm

    const calcAmount = () => {
        // Tính toán chỉ khi TONG_TIEN_SAN_PHAM > 0
        if (TONG_TIEN_SAN_PHAM > 0) {
            // Tổng tiền sau giảm giá
            const TONG_TIEN_SAU_GIAM_GIA = TONG_TIEN_SAN_PHAM - GIAM_GIA;

            // Tiền thừa trả khách
            const TIEN_THUA_TRA_KHACH = KHACH_THANH_TOAN - TONG_TIEN_SAU_GIAM_GIA;

            // Tổng tiền cần thanh toán
            const TONG_TIEN_CAN_TRA = TONG_TIEN_SAU_GIAM_GIA;

            setTongTien(TONG_TIEN_SAU_GIAM_GIA);

            // In ra kết quả
            console.log('Tổng tiền sản phẩm: ', TONG_TIEN_SAN_PHAM);
            console.log('Tổng số lượng sản phẩm: ', TONG_SO_LUONG_SAN_PHAM);
            console.log('Giảm giá: ', GIAM_GIA);
            console.log('Tổng tiền sau giảm giá: ', TONG_TIEN_SAU_GIAM_GIA);
            console.log('Số tiền khách thanh toán: ', KHACH_THANH_TOAN);
            console.log('Tiền thừa trả khách: ', TIEN_THUA_TRA_KHACH);
            console.log('Tổng tiền cần thanh toán: ', TONG_TIEN_CAN_TRA);

            if (TIEN_THUA_TRA_KHACH < 0) {
                setPaymentWarning(`KHÁCH HÀNG CHƯA THANH TOÁN ĐỦ CÒN THIẾU ${Math.abs(TIEN_THUA_TRA_KHACH)}`);
            } else {
                setPaymentWarning(''); // Xóa cảnh báo nếu khách đã thanh toán đủ
            }
        } else {
            // Nếu không có sản phẩm, các giá trị đặt về 0
            console.log('Tổng tiền sản phẩm: ', TONG_TIEN_SAN_PHAM);
            console.log('Tổng số lượng sản phẩm: ', TONG_SO_LUONG_SAN_PHAM);
            console.log('Giảm giá: ', GIAM_GIA);
            console.log('Tổng tiền sau giảm giá: ', 0);
            console.log('Số tiền khách thanh toán: ', 0);
            console.log('Tiền thừa trả khách: ', 0);
            console.log('Tổng tiền cần thanh toán: ', 0);

            setTongTien(0);
            setPaymentWarning('');
            console.log('Không có sản phẩm trong giỏ hàng.');
        }
    };
    // ################### TESTING ZONE ################# //

    return (
        <div className="sale-container">
            <div style={{ backgroundColor: 'yellow' }}>
                <form onSubmit={handleSearch} autoComplete="off">
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm (Tên, Mã hàng, Mã vạch)"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                        autoComplete="off"
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

                {/*  */}

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
                                {/* <p>{formatCurrency(TONG_TIEN_SAN_PHAM)}</p> */}
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Giảm giá</p>
                                {/* <p>{formatCurrency(GIAM_GIA)}</p> */}
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Khách cần trả</p>
                                {/* <p>{formatCurrency(tongTien)}</p> */}
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Khách thanh toán</b>
                                {/* <b>{formatCurrency(KHACH_THANH_TOAN)}</b> */}
                            </div>
                            <p style={{ color: 'red' }}>{paymentWarning}</p>
                        </div>
                        <button onClick={() => navigate('/dat-hang')}>MUA HÀNG</button>
                    </div>
                    <div className="cart-promocode">
                        <div>
                            <p>Nếu bạn có mã giảm giá, Nhập vào đây</p>
                            <div className="cart-promocode-input">
                                <input type="text" placeholder="Mã giảm giá" />
                                <button>Áp dụng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
