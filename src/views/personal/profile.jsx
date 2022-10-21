import { Grid, Button, TextField, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { patchUserMetadata } from 'services/auth0.service';
import { useState } from 'react';

const Profile = () => {
    const [editMode, setEditMode] = useState(false);
    const user = useSelector((x) => x.auth?.user);
    const { handleSubmit, control, formState } = useForm();

    const onSubmit = (data) => {
        const inValid = Object.values(data).every((x) => !x);
        if (inValid) return;

        patchUserMetadata(user.sub, data, () => {
            window.location.reload();
        });
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
                                        type="number"
                                        label="Your MoMo phone"
                                        defaultValue={user?.momo}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} py={1}>
                            <Button disabled={!formState.isDirty} onClick={handleSubmit(onSubmit)} variant="contained">
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
