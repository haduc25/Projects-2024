import { useState, useEffect } from 'react';
import './Home.css';
import { products } from '../../assets/products.js';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // Thêm trạng thái để lưu gợi ý
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
            // Lọc danh sách gợi ý dựa trên sự xuất hiện ở bất kỳ vị trí nào
            const filteredSuggestions = products
                .map((product) => product.name) // Chỉ lấy tên sản phẩm
                .filter(
                    (name) => name.toLowerCase().includes(value.toLowerCase()), // Kiểm tra ở bất kỳ vị trí nào
                )
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
                product.barcode.toLowerCase().includes(searchText)
            );
        });

        if (filteredProducts.length === 0) {
            setError(`Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchTerm}"`);
        }
        setSearchResults(filteredProducts);
        setSuggestions([]); // Ẩn gợi ý sau khi tìm kiếm
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion); // Điền gợi ý vào ô tìm kiếm
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
                        const startIndex = suggestion.toLowerCase().indexOf(searchTerm.toLowerCase());
                        const endIndex = startIndex + searchTerm.length;

                        return (
                            <li
                                key={index}
                                className="list-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Tách chuỗi thành 3 phần: trước, khớp, sau */}
                                {suggestion.substring(0, startIndex)}
                                <b>{suggestion.substring(startIndex, endIndex)}</b>
                                {suggestion.substring(endIndex)}
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
