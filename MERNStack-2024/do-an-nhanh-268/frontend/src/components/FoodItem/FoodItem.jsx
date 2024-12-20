import { useContext } from 'react';
import { assets } from '../../assets/assets_vn';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, utilityFunctions, url } = useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    return (
        <div className="food-item">
            <div className="food-item-img-container">
                {/* <img src={image} alt="" className="food-item-image" /> */}
                <img src={url + 'images/' + image} alt="" className="food-item-image" />

                {!cartItems[id] ? (
                    <img onClick={() => addToCart(id)} src={assets.add_icon_white} alt="add icon" className="add" />
                ) : (
                    <div className="food-item-counter">
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="remove icon" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="add icon 2" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating_starts" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">{formatCurrency(price)}</p>
            </div>
        </div>
    );
};

export default FoodItem;
