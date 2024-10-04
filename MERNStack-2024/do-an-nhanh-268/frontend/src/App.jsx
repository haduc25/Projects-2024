import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';

const App = () => {
    return (
        <div className="app">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gio-hang" element={<Cart />} />
                <Route path="/dat-hang" element={<PlaceOrder />} />
            </Routes>
            {/* <p>
                Con gái Việt Nam từ lâu đã được biết đến với vẻ đẹp duyên dáng, thanh lịch và đầy cuốn hút. Điều đặc
                biệt ở họ không chỉ nằm ở ngoại hình xinh đẹp mà còn ở những phẩm chất và nét tính cách rất đáng yêu.
                Trong mỗi vùng miền, con gái Việt lại mang theo những nét đẹp riêng biệt, nhưng tựu chung lại đều toát
                lên một vẻ hiền dịu và thân thiện. Đầu tiên, nói về vẻ đẹp bên ngoài, con gái Việt Nam sở hữu làn da mịn
                màng và mái tóc đen óng ả. Họ thường có vóc dáng nhỏ nhắn, nhẹ nhàng, phù hợp với chuẩn mực của nét đẹp
                Á Đông truyền thống. Một đặc điểm nổi bật khác là nụ cười rạng rỡ, luôn làm sáng bừng khuôn mặt và thu
                hút ánh nhìn của mọi người xung quanh. Đôi mắt to tròn, đen láy như biết nói, làm toát lên sự thông
                minh, lanh lợi nhưng cũng đầy dịu dàng. Bên cạnh vẻ đẹp hình thể, con gái Việt còn nổi bật bởi cách ăn
                mặc tinh tế và thời trang. Áo dài – trang phục truyền thống của người phụ nữ Việt – là một biểu tượng rõ
                ràng nhất cho vẻ đẹp dịu dàng và thanh thoát của họ. Khi khoác lên mình tà áo dài, con gái Việt như trở
                thành những đoá hoa e ấp, vừa kiêu sa vừa duyên dáng. Không chỉ dừng lại ở trang phục truyền thống, họ
                còn biết cách chọn lựa những bộ trang phục hiện đại, trẻ trung nhưng không kém phần lịch sự, tôn lên nét
                đẹp tự nhiên vốn có. Vẻ đẹp của con gái Việt Nam không chỉ đến từ ngoại hình mà còn từ trái tim và tâm
                hồn. Họ luôn mang trong mình tính cách hiền lành, dễ mến, nhưng cũng rất mạnh mẽ và kiên cường. Người
                con gái Việt Nam được nuôi dưỡng bởi văn hóa gia đình, luôn coi trọng tình cảm và đạo đức. Họ là những
                người con hiếu thảo, người chị ân cần, và khi lớn lên, trở thành những người vợ, người mẹ đảm đang và
                yêu thương gia đình. Chính sự tận tâm, hết lòng vì những người xung quanh đã làm cho con gái Việt trở
                nên đặc biệt trong mắt mọi người. Không chỉ vậy, con gái Việt còn có sự thông minh và nhạy bén. Trong
                môi trường học tập và công việc, họ luôn chứng tỏ được khả năng và tài năng của mình. Dù là ở các thành
                phố lớn hay ở những miền quê xa xôi, con gái Việt đều biết cách vươn lên, tự khẳng định bản thân. Họ
                không ngại khó khăn, luôn sẵn sàng học hỏi và không ngừng nỗ lực để đạt được những mục tiêu trong cuộc
                sống. Chính vì thế, con gái Việt Nam ngày nay không chỉ xinh đẹp mà còn rất tài giỏi và tự tin. Một điểm
                nữa làm nên sự đáng yêu của con gái Việt chính là nét hồn nhiên và vô tư. Dù có trải qua bao nhiêu thăng
                trầm của cuộc sống, họ vẫn giữ được sự lạc quan, yêu đời. Đó có thể là hình ảnh của những cô gái cười
                rạng rỡ khi đạp xe trên những con phố, hay những nụ cười duyên dáng khi trao nhau những cái nhìn đầu
                tiên. Sự vô tư, trong sáng đó khiến con gái Việt trở nên gần gũi và dễ mến, làm xiêu lòng không biết bao
                nhiêu người. Trong giao tiếp, con gái Việt thường mang đến cảm giác nhẹ nhàng, tinh tế và biết cách lắng
                nghe. Họ luôn giữ được phong thái nhã nhặn, tôn trọng người đối diện và biết cách thể hiện cảm xúc một
                cách chừng mực. Chính vì thế, con gái Việt thường tạo được ấn tượng tốt ngay từ lần gặp đầu tiên. Họ
                không chỉ thu hút bởi ngoại hình, mà còn bởi sự khéo léo, tế nhị trong từng lời nói, cử chỉ. Mặc dù vẻ
                đẹp và sự đáng yêu của con gái Việt Nam là điều không thể phủ nhận, nhưng điều làm nên sức hút lâu dài
                chính là trái tim ấm áp và lòng nhân hậu. Họ biết quan tâm, chăm sóc những người xung quanh và luôn dành
                tình cảm chân thành nhất cho gia đình, bạn bè và những người họ yêu thương. Họ không chỉ là những người
                phụ nữ của gia đình, mà còn là những người bạn, người đồng hành đáng tin cậy trong cuộc sống. Cuối cùng,
                điều đáng quý ở con gái Việt Nam chính là sự kết hợp hài hòa giữa vẻ đẹp truyền thống và hiện đại. Họ có
                thể giữ gìn những giá trị văn hóa tốt đẹp từ thế hệ trước, nhưng đồng thời cũng không ngừng học hỏi, đổi
                mới để phù hợp với nhịp sống hiện đại. Chính điều này đã giúp con gái Việt Nam luôn giữ được sự trẻ
                trung, năng động mà vẫn giữ nguyên được những giá trị cốt lõi về tinh thần và đạo đức.
            </p> */}
        </div>
    );
};

export default App;
