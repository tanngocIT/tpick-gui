import { Grid, Button, TextField, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { setUser } from 'store/auth/actions';

const Profile = () => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const user = useSelector((x) => x.auth?.user);
    const { handleSubmit, control, formState } = useForm();

    const onSubmit = (data) => {
        const inValid = Object.values(data).every((x) => !x);
        if (inValid) return;

        Object.keys(data)
            .filter((key) => !data[key])
            .forEach((key) => delete data[key]);

        dispatch(
            setUser({
                ...user,
                ...data,
            })
        );
        setEditMode(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Paper>
                {!editMode && (
                    <Grid m={1} p={1}>
                        <Grid item xs={12} py={1}>
                            <TextField fullWidth disabled label="Your name" value={user?.name} />
                        </Grid>
                        <Grid item xs={12} md={6} py={1}>
                            <TextField type="number" fullWidth disabled label="Your MoMo phone" value={user?.momo} />
                        </Grid>
                        <Grid item xs={12} py={1}>
                            <Button variant="contained" onClick={() => setEditMode(true)}>
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                )}
                {editMode && (
                    <Grid m={1} p={1}>
                        <Grid item xs={12} py={1}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        fullWidth
                                        onChange={onChange}
                                        autoComplete="off"
                                        value={value}
                                        label="Your name"
                                        defaultValue={user?.name}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} py={1}>
                            <Controller
                                name="momo"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        fullWidth
                                        autoComplete="off"
                                        onChange={onChange}
                                        value={value}
                                        label="Your MoMo phone"
                                        defaultValue={user?.momo}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} py={1}>
                            <Button disabled={!formState.isDirty} onClick={handleSubmit(onSubmit)} variant="contained" type="submit">
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </form>
    );
};

export default Profile;
