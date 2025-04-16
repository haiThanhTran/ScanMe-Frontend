import Box from '@mui/material/Box';
import ReactLoading from "react-loading";
import * as React from "react";
import {RingLoader} from "react-spinners";

const Loading = () => {
    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(210,198,198,0.5)',
                    zIndex: 1000,
                }}
            >
                {/*<CircularProgress size={40}/>*/}
                <ReactLoading type="cylon" color="white" height={100} width={100}/>
                {/*<RingLoader*/}
                {/*    color="#FFFFE0"*/}
                {/*    size={150}*/}
                {/*/>*/}
            </Box>
        </>
    )
}

export default Loading;