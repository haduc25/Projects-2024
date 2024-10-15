import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // useSearchParams(): lấy các tham số như `success, orderId` ở trên url
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        console.log('RUNNING... ');
        console.log(token);
        const response = await axios.post(
            url + 'api/order/verify',
            { success, orderId },
            { headers: { token } }, // Chèn token vào headers
        );
        if (response.data.success) {
            console.log('navigate(/myorders): ', response);
            navigate('/myorders');
        } else {
            console.log('navigate(/)', response);
            navigate('/');
        }
    };

    useEffect(() => {
        if (token) verifyPayment();
    }, [token]);

    console.log('success, orderId: ', success, orderId);

    return (
        <div className="verify">
            <div className="spinner" onClick={verifyPayment}>
                Verify
            </div>
        </div>
    );
};

export default Verify;
