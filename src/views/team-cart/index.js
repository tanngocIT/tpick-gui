import {
    Grid,
    Box,
    Stack,
    Typography,
    Button,
    IconButton,
    Divider,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getOrderDetails, getShopDetails } from 'services/main.service';
import { useSelector } from 'react-redux';

const Wrapper = ({ children, ...rest }) => (
    <Grid {...rest}>
        <Box sx={{ padding: 1, bgcolor: '#ffffff', borderRadius: 1 }}>{children}</Box>
    </Grid>
);

const TeamCart = () => {
    const { orderId } = useParams();
    const user = useSelector((x) => x.auth.user);
    const [order, setOrder] = useState({});
    const [shop, setShop] = useState({});
    const [mySubOrder, setMySubOrder] = useState({ owner: user, items: [], isConfirm: false });

    const addItem = (item) => {
        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            mySubOrder.items.push({ ...item, quantity: 1 });
        }

        setMySubOrder({ ...mySubOrder });
    };

    const subItem = (item) => {
        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (!existingItem) return;

        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
            mySubOrder.items = mySubOrder.items.filter((x) => x.name !== item.name);
        }

        setMySubOrder({ ...mySubOrder });
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const order = await getOrderDetails(orderId);
            setOrder(order);
        };
        fetchOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const order = await getOrderDetails(orderId);
            setOrder(order);
        };

        const interval = setInterval(fetchOrderDetails, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [orderId]);

    useEffect(() => {
        if (!order.shopId) return;

        const fetchShopDetails = async () => {
            const shop = await getShopDetails(order.shopId);
            setShop(shop);
        };
        fetchShopDetails();
    }, [order.shopId]);

    const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
        '&:not(:last-child)': {
            borderBottom: 0
        },
        '&:before': {
            display: 'none'
        }
    }));

    const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(() => ({
        backgroundColor: 'gainsboro'
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(() => ({
        padding: 0
    }));

    return (
        <Grid container spacing={2}>
            <Wrapper item lg={12}>
                <Box display="flex" p={1}>
                    <Stack p={1} spacing={1}>
                        <Typography variant="h2" fontSize={20} component="div">
                            {shop.name}
                        </Typography>
                        <Typography variant="body1" fontSize={18} component="div">
                            {shop.address}
                        </Typography>
                    </Stack>
                </Box>
            </Wrapper>
            <Grid item lg={9} container spacing={1}>
                {shop.sections?.map((section) => (
                    <Grid key={section.name} item container spacing={1} mb={2} lg={12}>
                        <Wrapper item lg={12}>
                            <Typography textAlign="center" variant="subtitle1" fontSize={18} component="div">
                                {section.name}
                            </Typography>
                        </Wrapper>
                        {section.items?.map((item) => (
                            <Wrapper key={item.name} item lg={6}>
                                <Grid container sx={{ height: 150 }}>
                                    <Grid item xs={3} display="flex" alignItems="center" justifyContent="center">
                                        <img width={140} src={item.imageUrl} alt={item.name} />
                                    </Grid>
                                    <Grid item xs={9} display="flex" flexDirection="column" justifyContent="space-between" p={1}>
                                        <Typography variant="subtitle1" fontSize={16} component="div">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" fontSize={15} component="div">
                                            {item.description}
                                        </Typography>
                                        <Grid container display="flex" alignItems="center" justifyContent="space-between" spacing={1}>
                                            <Grid item>
                                                <Typography variant="overline" fontSize={15} component="div">
                                                    {item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<AddIcon />}
                                                    disabled={!item.isAvailable}
                                                    onClick={() => addItem(item)}
                                                >
                                                    Thêm
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Wrapper>
                        ))}
                    </Grid>
                ))}
            </Grid>
            <Wrapper item lg={3} p={0}>
                <Stack>
                    <Box>
                        <Box border="1px solid gainsboro">
                            <Box bgcolor="gainsboro" py={1.5}>
                                <Typography variant="h5" textAlign="center">
                                    Dat hang
                                </Typography>
                            </Box>
                            {mySubOrder.items.map((item) => (
                                <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" px={1} pr={0}>
                                    <Typography variant="body1" fontSize={15} component="div">
                                        {item.name}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton color="primary" onClick={() => addItem(item)}>
                                            <AddCircleIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body1" fontSize={15} component="div">
                                            {item.quantity}
                                        </Typography>
                                        <IconButton color="primary" onClick={() => subItem(item)}>
                                            <RemoveCircleIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="h6" fontSize={15} component="div">
                                    Tong
                                </Typography>
                                <Typography variant="h6" fontSize={15} component="div">
                                    {mySubOrder.items.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                                </Typography>
                            </Box>
                            <TextField fullWidth variant="filled" label="Note" />
                            <Button fullWidth variant="contained" color="info">
                                Xac nhan
                            </Button>
                        </Box>
                    </Box>

                    <Box bgcolor="red" py={1.5} mt={1}>
                        <Typography variant="h5" textAlign="center">
                            Chi tiet
                        </Typography>
                    </Box>
                    {order.subOrders?.map((subOrder) => (
                        <Accordion key={subOrder.owner} expanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5">{subOrder.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ border: '1px solid gainsboro', borderTop: 'none' }}>
                                {subOrder.items?.map((item) => (
                                    <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                        <Typography variant="body1" fontSize={15} component="div">
                                            2 - {item.name}
                                        </Typography>
                                        <Typography variant="body1" fontSize={15} component="div">
                                            20000
                                        </Typography>
                                    </Box>
                                ))}
                                <Divider />
                                <Box display="flex" alignItems="center" justifyContent="space-between" p={1} color="blue">
                                    <Typography variant="body1" fontSize={15} component="div">
                                        Tong
                                    </Typography>
                                    <Typography variant="body1" fontSize={15} component="div">
                                        20000
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" alignItems="center" justifyContent="space-between" p={1} color="red">
                                    <Typography variant="body1" fontSize={15} component="div">
                                        Note
                                    </Typography>
                                    <Typography variant="body1" fontSize={15} component="div">
                                        20000
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Box border="1px solid gainsboro" borderRadius={2} my={1}>
                        <Box bgcolor="gainsboro" py={1.5}>
                            <Typography variant="h5" textAlign="center">
                                Sao ke
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="body1" fontSize={15} component="div">
                                Giam gia
                            </Typography>
                            <Typography variant="body1" fontSize={15} component="div">
                                20000
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="body1" fontSize={15} component="div">
                                20000
                            </Typography>
                            <Typography variant="body1" fontSize={15} component="div">
                                20000
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="h6" fontSize={15} component="div">
                                Tong
                            </Typography>
                            <Typography variant="h6" fontSize={15} component="div">
                                20000
                            </Typography>
                        </Box>
                        <Button fullWidth variant="contained" color="info">
                            Chot don
                        </Button>
                    </Box>
                </Stack>
            </Wrapper>
        </Grid>
    );
};

export default TeamCart;
