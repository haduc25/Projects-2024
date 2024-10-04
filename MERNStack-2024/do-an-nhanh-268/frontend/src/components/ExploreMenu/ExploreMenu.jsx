import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className="explore-menu" id="explore-menu">
            <h1>Khám phá thực đơn của chúng tôi</h1>
            <p className="explore-menu-text" onClick={() => console.log('category: ', category)}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet praesentium fugiat quisquam omnis, sint
                sequi dolore velit nihil eos veniam pariatur quia accusantium consectetur eligendi? Explicabo vel
                incidunt ex. Sint!
            </p>
            <div className="explore-menu-list">
                {menu_list &&
                    menu_list.map((item, index) => (
                        <div
                            onClick={() => setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))}
                            key={index}
                            className="explore-menu-list-item"
                        >
                            <img
                                className={category === item.menu_name ? 'active' : ''}
                                src={item.menu_image}
                                alt="food-item"
                            />
                            <p>{item.menu_name}</p>
                        </div>
                    ))}
            </div>
            <hr />
        </div>
    );
};

export default ExploreMenu;
