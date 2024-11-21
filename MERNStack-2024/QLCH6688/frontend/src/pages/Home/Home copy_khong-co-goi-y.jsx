import { useState, useEffect } from 'react';
import './Home.css';
import { products } from '../../assets/products.js';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Lưu từ khóa tìm kiếm
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [isSearched, setIsSearched] = useState(false);

    // Xử lý nhấn phím F3
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F3') {
                event.preventDefault(); // Ngăn hành vi mặc định của F3
                document.getElementById('search-input').focus(); // Đưa focus vào ô tìm kiếm
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Hàm xử lý khi thay đổi từ khóa tìm kiếm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm thực hiện tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn form reload lại trang
        if (!searchTerm.trim()) {
            setError('Vui lòng nhập thông tin tìm kiếm!');
            setIsSearched(false);
            return;
        }
        setError(''); // Xóa lỗi nếu có.
        setIsSearched(true);

        const filteredProducts = products.filter((product) => {
            const searchText = searchTerm.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchText) || // Tìm theo tên
                product.productCode.toLowerCase().includes(searchText) || // Tìm theo mã hàng
                product.barcode.toLowerCase().includes(searchText) // Tìm theo mã vạch
            );
        });
        console.log('Tìm kiếm:', searchTerm);
        console.log('Kết quả:', filteredProducts);
        const NoResult = Array.isArray(filteredProducts) && filteredProducts.length === 0;
        console.log('NoResult: ', NoResult);
        if (NoResult) setError(`Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchTerm}"`);

        setSearchTerm('');
        setSearchResults(filteredProducts); // Cập nhật kết quả tìm kiếm
    };

    // Xóa item khỏi danh sách mua hàng
    const handleRemoveItem = (productId) => {
        const updatedResults = searchResults.filter((product) => product._id !== productId);
        setSearchResults(updatedResults);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm (Tên, Mã hàng, Mã vạch)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required // Đảm bảo ô nhập không để trống
                    autoFocus
                />
                <button type="submit">Tìm kiếm</button>
            </form>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {searchResults &&
                    searchResults.map((product) => (
                        <div key={product._id}>
                            <h4>{product.name}</h4>
                            <p>Mã hàng: {product.productCode}</p>
                            <p>Mã vạch: {product.barcode}</p>
                            <p>Mô tả: {product.description}</p>
                            <p>Giá bán: {product.sellingPrice} VND</p>
                            <button onClick={() => handleRemoveItem(product._id)}>Xóa</button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Home;
