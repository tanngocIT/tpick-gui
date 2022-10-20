import { Grid, Typography, Button, TextField, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { initOrder, addOrUpdateShop } from 'services/main.service';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SpinIcon = () => (
    <RefreshIcon
        sx={{
            animation: 'spin 2s linear infinite',
            '@keyframes spin': {
                '0%': {
                    transform: 'rotate(0deg)'
                },
                '100%': {
                    transform: 'rotate(360deg)'
                }
            }
        }}
    />
);

const OrderInit = () => {
    const navigate = useNavigate();
    const [shopUrl, setShopUrl] = useState('');
    const [processing, setProcessing] = useState(false);
    const user = useSelector((x) => x.auth?.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validUrl = shopUrl.match(
            // eslint-disable-next-line no-useless-escape
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        if (!validUrl) {
            setShopUrl('');
            return;
        }

        setProcessing(true);

        try {
            const { id: shopId } = await addOrUpdateShop(shopUrl);
            const { id: orderId } = await initOrder(shopId, user);
            navigate(`orders/${orderId}/cart`);
        } catch (error) {
            // ignore
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Paper>
                <Grid m={1} p={1}>
                    <Grid item xs={12} py={1}>
                        <Typography textAlign="center" variant="h3" fontSize={20} component="h1" color="primary">
                            Chào mừng đến với TPick, nhập đường dẫn ShopeeFood để bắt đầu đặt nhóm!
                        </Typography>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Grid item xs={12} py={1}>
                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                label="Đường dẫn"
                                placeholder="Nhập đường dẫn..."
                                fullWidth
                                focused
                                disabled={processing}
                                value={shopUrl}
                                onChange={(e) => setShopUrl(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={processing}
                                endIcon={processing ? <SpinIcon /> : <SendIcon />}
                                type="submit"
                                // onClick={handleSubmit}
                            >
                                {processing ? 'Processing' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </form>
    );
};

export default OrderInit;
