import { assets } from '../../assets/assets_vn';
import './AppDownload.css';

const AppDownload = () => {
    return (
        <div className="app-download" id="app-download">
            <p>
                Để có trải nghiệm tốt hơn hãy tải xuống <br /> Ứng dụng đồ ăn nhanh 268
            </p>
            <div className="app-download-platforms">
                <img src={assets.play_store} alt="play store" />
                <img src={assets.app_store} alt="app store" />
            </div>
        </div>
    );
};

export default AppDownload;
