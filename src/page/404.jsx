import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    return (
        <Container maxWidth="md" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',

        }}>
            <ErrorOutlineIcon sx={{ fontSize: 100, color: '#f44336' }} /> {/* Icon màu đỏ */}
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#333' }}>
                404 - Trang không tìm thấy
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: '#666', marginBottom: 2 }}>
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Quay về trang chủ
            </Button>
        </Container>
    );
};

export default NotFoundPage;