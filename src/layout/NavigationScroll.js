import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //

const NavigationScroll = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [router]);

    return children || null;
};

NavigationScroll.propTypes = {
    children: PropTypes.node
};

export default NavigationScroll;
