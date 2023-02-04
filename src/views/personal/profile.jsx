import { Grid, Button, TextField, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { setUser } from 'store/auth/actions';

const fields = [
    {
        id: 'name',
        label: 'Your name'
    },
    {
        id: 'momo',
        label: 'Your MoMo number',
        type: 'number'
    },
    {
        id: 'sheetId',
        label: 'Your google sheet id',
        needPremium: true
    }
];

const Profile = () => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const user = useSelector((x) => x.auth?.user);
    const { handleSubmit, control, setValue } = useForm();

    const onSubmit = (data) => {
        const inValid = Object.values(data).every((x) => !x);
        if (inValid) return;

        Object.keys(data)
            .filter((key) => !data[key])
            .forEach((key) => delete data[key]);

        dispatch(
            setUser({
                ...user,
                ...data
            })
        );
        setEditMode(false);
    };

    const ViewField = ({ id, label, type, needPremium }) => {
        if (needPremium && user?.premium !== true) return null;
        
        return (
            <Grid item xs={12} py={1}>
                <TextField fullWidth disabled type={type} label={label} value={user[id]} />
            </Grid>
        )
    };

    const EditField = ({ id, label, type, needPremium }) => {
        if (!control || !user || needPremium && user?.premium !== true) return null;

        return (
            <Grid item xs={12} py={1}>
                <TextField
                    fullWidth
                    onChange={(e) => setValue(id, e.target.value)}
                    autoComplete="off"
                    type={type}
                    label={label}
                    defaultValue={user[id]}
                />
            </Grid>
        );
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit}>
            <Paper>
                {!editMode && (
                    <Grid m={1} p={1}>
                        {fields.map((f) => (
                            <ViewField key={f.id} {...f} />
                        ))}
                        <Grid item xs={12} py={1}>
                            <Button variant="contained" onClick={() => setEditMode(true)}>
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                )}
                {editMode && (
                    <Grid m={1} p={1}>
                        {fields.map((f) => (
                            <EditField key={f.field} {...f} />
                        ))}
                        <Grid item xs={12} py={1}>
                            <Button onClick={handleSubmit(onSubmit)} variant="contained" type="submit">
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
