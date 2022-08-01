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
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as mainService from 'services/main.service';
import { sum, toLocalePrice } from 'utils/pricing-tool';

const Wrapper = ({ children, ...rest }) => (
    <Grid {...rest}>
        <Box sx={{ padding: 1, bgcolor: '#ffffff', borderRadius: 1 }}>{children}</Box>
    </Grid>
);

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    },
    borderRadius: 0
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(() => ({
    backgroundColor: 'transparent',
    border: '1px solid gainsboro',
    borderRadius: 0
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    padding: 0,
    borderRadius: 0
}));

const TeamCart = () => {
    const { orderId } = useParams();
    const user = useSelector((x) => x.auth?.user);
    const [order, setOrder] = useState({ subOrders: [] });
    const [shop, setShop] = useState({ sections: [] });
    const [mySubOrder, setMySubOrder] = useState({ owner: null, items: [], using: false, confirmed: false });

    const isHost = () => user.id === order.host?.id;

    const addItem = (item) => {
        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            mySubOrder.items.push({ ...item, quantity: 1 });
        }

        setMySubOrder({ ...mySubOrder, using: true });
    };

    const subItem = (item) => {
        const existingItem = mySubOrder.items.find((x) => x.name === item.name);
        if (!existingItem) return;

        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
            mySubOrder.items = mySubOrder.items.filter((x) => x.name !== item.name);
        }

        setMySubOrder({ ...mySubOrder, using: true });
    };

    const submitMySubOrder = useCallback(async () => {
        await mainService.submitSubOrder(orderId, mySubOrder);

        setMySubOrder({ ...mySubOrder, using: false, confirmed: true });
        setOrder({
            ...order,
            subOrders: [...order.subOrders, mySubOrder]
        });
    }, [mySubOrder, order, orderId]);

    const removeMySubOrder = useCallback(async () => {
        await mainService.removeSubOrder(orderId, user.id);

        setMySubOrder({ owner: user, items: [], using: false, confirmed: false });
        setOrder({
            ...order,
            subOrders: order.subOrders.filter((x) => x.owner.id !== user.id)
        });
    }, [order, orderId, user]);

    const removeTeamSubOrder = useCallback(
        async (ownerId) => {
            await mainService.removeSubOrder(orderId, ownerId);

            setOrder({
                ...order,
                subOrders: order.subOrders.filter((x) => x.owner.id !== ownerId)
            });
        },
        [order, orderId]
    );

    const fetchOrderDetails = useCallback(async () => {
        const order = await mainService.getOrderDetails(orderId);
        setOrder(order);

        const myConfirmedSubOrder = order?.subOrders?.find((x) => x.owner?.id === user?.id);
        if (myConfirmedSubOrder && !mySubOrder.using) {
            setMySubOrder({
                ...myConfirmedSubOrder,
                confirmed: true
            });
        }
    }, [mySubOrder.using, orderId, user?.id]);

    const fetchShopDetails = useCallback(async () => {
        if (!order.shopId) return;

        const shop = await mainService.getShopDetails(order.shopId);
        setShop(shop);
    }, [order?.shopId]);

    useEffect(() => {
        if (!user) return;

        setMySubOrder({ ...mySubOrder, owner: user });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        fetchOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchOrderDetails, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchOrderDetails]);

    useEffect(() => {
        fetchShopDetails();
    }, [fetchShopDetails]);

    if (!user) return null;

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
                                                    {toLocalePrice(item.price)}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<AddIcon />}
                                                    disabled={mySubOrder.confirmed || !item.isAvailable}
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
            <Wrapper item lg={3}>
                <Stack>
                    {mySubOrder.items.length > 0 && (
                        <Box border="0px solid gainsboro" bgcolor="#f7f7f7" my={0.5}>
                            <Box bgcolor="gainsboro" py={1.5}>
                                <Typography variant="h5" textAlign="center">
                                    {`Đặt hàng của ${user.name}`}
                                </Typography>
                            </Box>
                            {mySubOrder.items.map((item) => (
                                <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" px={1} pr={0}>
                                    <Typography variant="body1" fontSize={15} component="div">
                                        {item.name}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton color="primary" onClick={() => addItem(item)} disabled={mySubOrder.confirmed}>
                                            <AddCircleIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body1" fontSize={15} component="div">
                                            {item.quantity}
                                        </Typography>
                                        <IconButton color="primary" onClick={() => subItem(item)} disabled={mySubOrder.confirmed}>
                                            <RemoveCircleIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="h6" fontSize={15} component="div">
                                    Tổng
                                </Typography>
                                <Typography variant="h6" fontSize={15} component="div">
                                    {toLocalePrice(
                                        sum(mySubOrder.items, (x) => x.quantity * x.price),
                                        false
                                    )}
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                variant="filled"
                                label="Note"
                                disabled={mySubOrder.confirmed}
                                value={mySubOrder?.note}
                                onChange={(e) => {
                                    setMySubOrder({ ...mySubOrder, note: e.target.value });
                                }}
                            />
                            {mySubOrder.confirmed ? (
                                <Button fullWidth variant="contained" color="error" onClick={removeMySubOrder}>
                                    Đặt lại
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="info"
                                    onClick={submitMySubOrder}
                                    disabled={!mySubOrder.items.length}
                                >
                                    Xác nhận
                                </Button>
                            )}
                        </Box>
                    )}

                    <Box bgcolor="#f7f7f7" my={0.5}>
                        <Box bgcolor="gainsboro" py={1.5}>
                            <Typography variant="h5" textAlign="center">
                                Chi tiết
                            </Typography>
                        </Box>
                        {order.subOrders?.map((subOrder) => (
                            <Accordion key={subOrder.owner}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="h5">{subOrder.owner.name}</Typography>
                                        <Typography variant="subtitle1" ml={0.5} color="primary">
                                            {`${sum(subOrder.items, (x) => x.quantity)} phần - ${toLocalePrice(
                                                sum(subOrder.items, (x) => x.quantity * x.price)
                                            )}`}
                                        </Typography>
                                        {isHost() && (
                                            <IconButton color="error" onClick={() => removeTeamSubOrder(subOrder.owner.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ border: '1px solid gainsboro', borderTop: 'none' }}>
                                    {subOrder.items?.map((item) => (
                                        <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                            <Typography variant="body1" fontSize={15} component="div">
                                                {item.quantity} x {item.name}
                                            </Typography>
                                            <Typography variant="body1" fontSize={15} component="div">
                                                {toLocalePrice(item.quantity * item.price)}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Divider />
                                    <Divider />
                                    {!!subOrder?.note && (
                                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1} color="red">
                                            <Typography variant="body1" fontSize={15} component="div">
                                                Note
                                            </Typography>
                                            <Typography variant="body1" fontSize={15} component="div">
                                                {subOrder?.note}
                                            </Typography>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                    <Box bgcolor="#f7f7f7" borderRadius={0} my={0.5}>
                        <Box bgcolor="gainsboro" py={1.5}>
                            <Typography variant="h5" textAlign="center">
                                Sao kê
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="body1" fontSize={15} component="div">
                                Giảm giá
                            </Typography>
                            <Typography variant="body1" fontSize={15} component="div">
                                0
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="body1" fontSize={15} component="div">
                                Ship
                            </Typography>
                            <Typography variant="body1" fontSize={15} component="div">
                                0
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="h6" fontSize={15} component="div">
                                Tổng
                            </Typography>
                            <Typography variant="h6" fontSize={15} component="div">
                                {toLocalePrice(
                                    sum(order.subOrders, (subOrder) => sum(subOrder.items, (item) => item.price * item.quantity))
                                )}
                            </Typography>
                        </Box>
                        {isHost() && (
                            <Button fullWidth variant="contained" color="info">
                                Chốt đơn
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Wrapper>
        </Grid>
    );
};

export default TeamCart;
