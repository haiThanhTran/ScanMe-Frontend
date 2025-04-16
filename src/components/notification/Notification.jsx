import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {AlertTitle} from "@mui/material";

const Notification = ({
                          open,
                          message,
                          onClose,
                          autoHideDuration = 3000,
                          anchorOrigin = {vertical: 'top', horizontal: 'right'},
                          error = true
                      }) => {
    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
        >
            {error ? (<Alert variant="filled" severity="success" onClose={onClose}>
                <AlertTitle>Thành công!!!</AlertTitle>
                {message}
            </Alert>) : (<Alert variant="filled" severity="error" onClose={onClose}>
                <AlertTitle>Lỗi!!!</AlertTitle>
                {message}
            </Alert>)}
        </Snackbar>
    );
};

export default Notification;
