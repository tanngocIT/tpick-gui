import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'store/auth/actions';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

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

const AuthGuard = () => {
    const dispatch = useDispatch();
    const user = useSelector((x) => x.auth?.user);
    const [name, setName] = React.useState('');
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (user) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [user]);

    const handleClose = () => {
        if (user?.name) {
            setOpen(false);
        }
    };

    const handleClick = () => {
        if (!name) return;

        const user = {
            id: uuid(),
            name
        };
        dispatch(setUser(user));
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Paper sx={style}>
                    <Stack>
                        <TextField
                            variant="outlined"
                            label="Input your name"
                            placeholder="Input your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <Button variant="contained" onClick={handleClick}>
                            Submit
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    );
};

export default AuthGuard;
