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
import CopyIcon from '@mui/icons-material/CopyAll';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sum, toLocalePrice } from 'utils/pricing-tool';
import { toSlug } from 'utils/commom';
import foodPlaceholder from 'assets/images/food-placeholder.png';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import * as liveOrderActions from 'store/liveOrder/actions';
import * as hubActions from 'store/hub/actions';

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

const OrderCart = () => {
    const { orderId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((x) => x.auth?.user);
    const shop = useSelector((x) => x.liveOrder.shop);
    const order = useSelector((x) => x.liveOrder.order);
    const mySubOrder = useSelector((x) => x.liveOrder.mySubOrder);
    const lastRefreshed = useSelector((x) => x.liveOrder.lastRefreshed);
    const [filteredShopSections, setFilteredShopSections] = useState([]);

    const isHost = () => user.id === order.host?.id;

    const addItem = (item) => {
        dispatch(liveOrderActions.addItemToSubOrder(item));
    };

    const minusItem = (item) => {
        dispatch(liveOrderActions.minusItemFromSubOrder(item));
    };

    const submitMySubOrder = useCallback(async () => {
        dispatch(liveOrderActions.submitSubOrder(mySubOrder));
    }, [dispatch, mySubOrder]);

    const removeMySubOrder = useCallback(async () => {
        try {
            await confirm({
                title: `Bạn muốn đặt lại?`
            });
        } catch (error) {
            return;
        }

        dispatch(liveOrderActions.removeSubOrder(user.id));
    }, [dispatch, user?.id, confirm]);

    const removeTeamSubOrder = useCallback(
        async (ownerId) => {
            const subOrder = order.subOrders.find((x) => x.owner.id === ownerId);
            if (!subOrder) return;

            try {
                await confirm({
                    title: `Bạn muốn xóa đặt hàng của ${subOrder.owner.name}?`
                });
            } catch (error) {
                return;
            }

            dispatch(liveOrderActions.removeSubOrder(subOrder.owner.id));
            enqueueSnackbar(`Đã xóa đặt hàng của ${subOrder.owner.name}`, { variant: 'info' });
        },
        [order, dispatch, enqueueSnackbar, confirm]
    );

    const handleConfirmOrder = useCallback(async () => {
        if (order.subOrders.length === 0) return;

        try {
            await confirm({
                title: `Chốt đơn hàng?`
            });
        } catch (error) {
            return;
        }

        dispatch(liveOrderActions.confirmLiveOrder());
    }, [order, confirm, dispatch]);

    const handleSearchItems = (e) => {
        const keyword = toSlug(e.target.value?.trim()) || '';
        if (!keyword) {
            setFilteredShopSections(shop.sections);
            return;
        }

        const filteredSections = shop.sections
            .map((section) => {
                const filteredItems = section.items.filter((item) => toSlug(item.name).includes(keyword));
                return {
                    ...section,
                    items: filteredItems
                };
            })
            .filter((section) => section.items.length > 0);

        setFilteredShopSections(filteredSections);
    };

    useEffect(() => {
        if (!shop?.sections) return;

        setFilteredShopSections(shop.sections);
    }, [shop?.sections]);

    useEffect(() => {
        if (!orderId) return;
        if (order.isConfirm) {
            navigate(`/orders/${orderId}/details`);
            dispatch(liveOrderActions.resetLiveOrderSuccess());
        }
    }, [navigate, dispatch, orderId, order?.isConfirm]);

    useEffect(() => {
        if (!lastRefreshed) return;

        dispatch(liveOrderActions.getLiveOrder(orderId));
    }, [dispatch, orderId, lastRefreshed]);

    useEffect(() => {
        if (!user?.id) return;

        dispatch(liveOrderActions.getLiveOrder(orderId));
    }, [dispatch, orderId, user?.id]);

    useEffect(() => {
        if (!orderId) return () => {};

        const groupName = `order-${orderId}`;
        dispatch(hubActions.addToGroup(groupName));

        return () => {
            dispatch(hubActions.removeFromGroup(groupName));
        };
    }, [orderId, dispatch]);

    if (!user || !order?.id || !shop?.id) return null;

    return (
        <Grid container spacing={2}>
            <Wrapper item xs={12}>
                <Box display="flex" p={1}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Stack p={1} spacing={1}>
                                <Typography variant="h2" fontSize={20} component="div">
                                    {shop.name}
                                </Typography>
                                <Typography variant="body1" fontSize={18} component="div">
                                    {shop.address}
                                </Typography>
                            </Stack>
                            <Button
                                style={{ marginLeft: 10 }}
                                variant="contained"
                                color="primary"
                                startIcon={<CopyIcon />}
                                onClick={() => {
                                    navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_API}/orders/${orderId}/meta-page`);
                                    enqueueSnackbar(`Đã sao chép liên kết!`, { variant: 'info' });
                                }}
                            >
                                Mời bạn bè
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Wrapper>

            <Grid item xs={12} lg={9} container spacing={1}>
                <Wrapper item xs={12}>
                    <TextField id="search-box" label="Tìm kiếm..." variant="outlined" fullWidth onChange={handleSearchItems} />
                </Wrapper>
                {filteredShopSections?.map((section) => (
                    <Grid key={Math.random()} item container spacing={1} mb={2}>
                        <Wrapper item xs={12}>
                            <Typography textAlign="center" variant="subtitle1" fontSize={18} component="div">
                                {section.name}
                            </Typography>
                        </Wrapper>
                        {section.items?.map((item) => (
                            <Wrapper key={Math.random()} item xs={12} xl={6}>
                                <Grid container>
                                    <Grid item xs={12} sm={3} md={2} xl={3} display="flex" alignItems="center" justifyContent="center">
                                        <img
                                            style={{ width: '100%', maxWidth: '512px' }}
                                            src={item.imageUrl || foodPlaceholder}
                                            alt={item.name}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={9}
                                        md={10}
                                        xl={9}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-between"
                                        p={1}
                                    >
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
                                                    {`${item.isAvailable ? 'Thêm' : 'Hết hàng'}`}
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
            <Wrapper item xs={12} lg={3}>
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
                                        <IconButton color="primary" onClick={() => minusItem(item)} disabled={mySubOrder.confirmed}>
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
                                value={mySubOrder.note || ''}
                                onChange={(e) => {
                                    dispatch(liveOrderActions.setMySubOrderNote(e.target.value));
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
                        {order?.subOrders?.map((subOrder) => (
                            <Accordion key={subOrder.owner.id}>
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
                                Host
                            </Typography>
                            <Typography variant="body1" fontSize={15} component="div">
                                {order?.host?.name}
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
                            <Button
                                fullWidth
                                variant="contained"
                                color="info"
                                onClick={handleConfirmOrder}
                                disabled={order?.subOrders?.length === 0}
                            >
                                Chốt đơn
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Wrapper>
        </Grid>
    );
};

export default OrderCart;
