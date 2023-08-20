import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'store/auth/actions';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const SimpleAuthProvider = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        window.location.href = 'https://tpick.neraton.cloud';
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <form >
                    <Paper sx={style}>
                        <Stack>
                            <Typography textAlign="center" variant="h4" fontSize={18} component="h1" color="red" mb={2}>
                                TPick đã có phiên bản mới!
                            </Typography>

                            <Typography textAlign="center" variant="h4" fontSize={16} component="h1" color="primary">
                                Nhanh hơn...
                            </Typography>
                            <Typography textAlign="center" variant="h4" fontSize={16} component="h1" color="primary">
                                Đẹp hơn...
                            </Typography>
                            <Typography textAlign="center" variant="h4" fontSize={16} component="h1" color="primary">
                                Bảo mật hơn...
                            </Typography>
                            <Typography textAlign="center" variant="h4" fontSize={16} component="h1" color="primary">
                                Hoàn thiện hơn...
                            </Typography>
                            <br />
                            <Button variant="contained" type="submit" onClick={onSubmit}>
                                Khám phá ngay
                            </Button>
                            <Button variant="contained"  color="error" onClick={handleClose}>
                                Bỏ qua
                            </Button>
                        </Stack>
                    </Paper>
                </form>
            </Modal>
        </div>
    );
};

export default SimpleAuthProvider;
