import {
    Grid,
    Box,
    Stack,
    Typography,
    Divider,
    Button,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RevertIcon from '@mui/icons-material/RestartAlt';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sum, toLocalePrice } from 'utils/pricing-tool';
import * as liveOrderActions from 'store/liveOrder/actions';
import QRCode from 'qrcode';
import { useConfirm } from 'material-ui-confirm';

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

const OrderDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { orderId } = useParams();
    const user = useSelector((x) => x.auth?.user);
    const shop = useSelector((x) => x.liveOrder.shop);
    const order = useSelector((x) => x.liveOrder.order);
    const momo = order?.host?.momo;
    const groupItemMap = order?.subOrders
        .map((subOrder) => subOrder.items.map((item) => ({ ...item, note: subOrder.note })))
        .flatMap((items) => items)
        .reduce((acc, item) => {
            const name = item.name?.trim();
            const note = item.note?.trim().toLowerCase();
            const key = `${name}_${note}`;

            if (acc[key]) {
                acc[key].quantity += item.quantity;
            } else {
                acc[key] = {
                    name,
                    note,
                    price: item.price,
                    quantity: item.quantity
                };
            }

            return acc;
        }, {});
    const groupItems = Object.values(groupItemMap)?.sort((a, b) => a.name.localeCompare(b.name));
    const lastRefreshed = useSelector((x) => x.liveOrder.lastRefreshed);

    const isHost = useCallback(() => user?.id && user?.id === order.host?.id, [user?.id, order.host?.id]);

    const handleRevertOrder = useCallback(async () => {
        if (!isHost()) return;
        if (order.subOrders.length === 0) return;

        try {
            await confirm({
                title: `Chỉnh sửa đơn hàng?`
            });
        } catch (error) {
            return;
        }

        dispatch(liveOrderActions.revertLiveOrder());
    }, [order, confirm, isHost, dispatch]);

    useEffect(() => {
        if (!user?.id) return;

        dispatch(liveOrderActions.getLiveOrder(orderId));
    }, [dispatch, user?.id, orderId]);

    useEffect(() => {
        if (!orderId) return;
        if (order.isConfirm === false) {
            navigate(`/orders/${orderId}/cart`);
            dispatch(liveOrderActions.resetLiveOrderSuccess());
        }
    }, [navigate, dispatch, orderId, order?.isConfirm]);

    useEffect(() => {
        if (!lastRefreshed) return;

        dispatch(liveOrderActions.getLiveOrder(orderId));
    }, [dispatch, orderId, lastRefreshed]);

    useEffect(() => {
        if (!momo) return;

        const momoQrConfig = `2|99|${momo}|NAME|MAIL|0|0|0||transfer_myqr`;

        QRCode.toCanvas(document.getElementById('momo'), momoQrConfig, { width: 205, margin: 1 });
    }, [momo]);

    if (!user) return null;

    return (
        order && (
            <Grid container spacing={1}>
                {isHost() && (
                    <Wrapper item xs={12}>
                        <Button fullWidth variant="contained" color="error" startIcon={<RevertIcon />} onClick={handleRevertOrder}>
                            Chỉnh sửa đơn
                        </Button>
                    </Wrapper>
                )}
                <Wrapper item xs={12} lg={momo ? 9 : 12} xl={momo ? 10 : 12}>
                    <Stack fontSize={15}>
                        <Box item lg={6} bgcolor="#f7f7f7" borderRadius={0} my={0.5}>
                            <Box bgcolor="gainsboro" py={1.5}>
                                <Typography variant="h5" textAlign="center">
                                    Sao kê
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="body1" component="div">
                                    Shop
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {shop?.name}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="body1" component="div">
                                    Địa chỉ
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {shop?.address}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="body1" component="div">
                                    Host
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {order?.host?.name}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="body1" component="div">
                                    Số phần
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {sum(groupItems, (x) => x.quantity)}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="body1" component="div" color="primary" fontWeight="bold">
                                    Tổng
                                </Typography>
                                <Typography variant="body1" component="div" color="primary" fontWeight="bold">
                                    {toLocalePrice(
                                        sum(order.subOrders, (subOrder) => sum(subOrder.items, (item) => item.price * item.quantity))
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Wrapper>
                {momo && (
                    <Wrapper item xs={12} lg={3} xl={2}>
                        <Box textAlign="center">
                            <Typography variant="h5" textAlign="center">
                                {order?.host?.name} MoMo
                            </Typography>
                            <canvas id="momo" />
                        </Box>
                    </Wrapper>
                )}
                <Wrapper item xs={12} lg={6}>
                    <Stack fontSize={15}>
                        <Box my={0.5}>
                            <Box bgcolor="gainsboro" py={1.5}>
                                <Typography variant="h5" textAlign="center">
                                    Theo phần
                                </Typography>
                            </Box>
                            {groupItems.map((groupItem) => (
                                <Box
                                    key={`${groupItem.name}${groupItem.note}`}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    border="1px solid gainsboro"
                                    p={1}
                                >
                                    <Stack direction="row" display="flex" alignItems="center">
                                        <Typography variant="body" ml={0.5}>
                                            {`${groupItem.quantity} x ${groupItem.name}`}
                                        </Typography>
                                        {groupItem.note && (
                                            <Typography variant="body" ml={0.5} color="error">
                                                {`(${groupItem.note})`}
                                            </Typography>
                                        )}
                                    </Stack>
                                    <Typography variant="body" ml={0.5} color="primary">
                                        {`${toLocalePrice(groupItem.price * groupItem.quantity)}`}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Stack>
                </Wrapper>
                <Wrapper item xs={12} lg={6}>
                    <Stack>
                        <Box bgcolor="#f7f7f7" my={0.5}>
                            <Box bgcolor="gainsboro" py={1.5}>
                                <Typography variant="h5" textAlign="center">
                                    Theo người
                                </Typography>
                            </Box>
                            {order.subOrders?.map((subOrder) => (
                                <Accordion key={subOrder.owner.id}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="h5">{subOrder.owner.name}</Typography>
                                            <Typography variant="subtitle1" ml={0.5} color="primary">
                                                {`(${sum(subOrder.items, (x) => x.quantity)}P - ${toLocalePrice(
                                                    sum(subOrder.items, (x) => x.quantity * x.price)
                                                )})`}
                                            </Typography>
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
                    </Stack>
                </Wrapper>
            </Grid>
        )
    );
};

export default OrderDetails;
