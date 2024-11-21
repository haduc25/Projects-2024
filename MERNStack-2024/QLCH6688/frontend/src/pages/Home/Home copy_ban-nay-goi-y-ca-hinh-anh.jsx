import { useState, useEffect } from 'react';
import './Home.css';
import { products } from '../../assets/products.js';

const localhostImageBackEnd = 'http://localhost:6868/images/';
const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

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

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            // Lọc danh sách gợi ý dựa trên tên hoặc mã vạch
            const filteredSuggestions = products
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
        const filteredProducts = products.filter((product) => {
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
        }
        setSearchResults(filteredProducts);

        // Clear input fields
        setSearchTerm('');
        setSuggestions([]); // Ẩn gợi ý sau khi tìm kiếm
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name); // Điền tên sản phẩm vào ô tìm kiếm
        setSuggestions([]); // Ẩn danh sách gợi ý
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
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
                        const nameStartIndex = suggestion.name.toLowerCase().indexOf(searchTerm.toLowerCase());
                        const barcodeStartIndex = suggestion.barcode.toLowerCase().indexOf(searchTerm.toLowerCase());
                        const priceStartIndex = suggestion.sellingPrice.toString().indexOf(searchTerm);
                        console.log('suggestion: ', suggestion);

                        return (
                            <li
                                key={index}
                                className="list-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Hiển thị tên sản phẩm */}
                                {nameStartIndex !== -1 && (
                                    <>
                                        <div className="suggestion-item">
                                            <div>
                                                <div style={{ display: 'flex' }}>
                                                    <div>
                                                        <img
                                                            src={`${localhostImageBackEnd}${suggestion.image}`}
                                                            alt={suggestion.name}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                                borderRadius: '5px',
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
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
                                                        <div>{suggestion.barcode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="suggestion-item-price">
                                                {suggestion.sellingPrice.toString()} vnd
                                            </div>
                                        </div>
                                    </>
                                )}
                                {nameStartIndex !== -1 && <span> </span>}
                                {/* Hiển thị mã vạch */}
                                {barcodeStartIndex !== -1 && (
                                    <>
                                        {suggestion.barcode.substring(0, barcodeStartIndex)}
                                        <b>
                                            {suggestion.barcode.substring(
                                                barcodeStartIndex,
                                                barcodeStartIndex + searchTerm.length,
                                            )}
                                        </b>
                                        {suggestion.barcode.substring(barcodeStartIndex + searchTerm.length)}
                                    </>
                                )}
                                {priceStartIndex !== -1 && <span> | </span>}
                                {/* Hiển thị giá bán */}
                                {priceStartIndex !== -1 && (
                                    <>
                                        {suggestion.sellingPrice.toString().substring(0, priceStartIndex)}
                                        <b>
                                            {suggestion.sellingPrice
                                                .toString()
                                                .substring(priceStartIndex, priceStartIndex + searchTerm.length)}
                                        </b>
                                        {suggestion.sellingPrice
                                            .toString()
                                            .substring(priceStartIndex + searchTerm.length)}{' '}
                                        vnđ
                                    </>
                                )}
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
                        <img src={`${localhostImageBackEnd}${product.image}`} alt="image" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
