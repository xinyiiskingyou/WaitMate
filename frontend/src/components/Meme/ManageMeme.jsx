import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { 
  Drawer, 
  Box,
  Typography,
  Button,
  TextField,
  ButtonGroup,
  Container,
  Paper,
  ImageList,
  ImageListItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  IconButton
} from "@mui/material";
import UploadMeme from "./UploadMeme";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Manager from '../Staff/ManagerInterface'

const actions = [
    { icon: <AddAPhotoIcon />, name: 'Upload Meme', content: "Upload Meme" },
    { icon: <ConfirmationNumberIcon />, name: 'Check vote count', content: "action 2" },
  ];
const ManageMeme = () => {

    const [showUploadMeme, setShowUploadMeme] = useState(false);
  
    const handleClick = (content) => {
      if (content === 'Upload Meme') {
        setShowUploadMeme(true);
      }
    };

  
  return (
    <Container maxWidth="100%">
        <Manager/>
        <Paper elevation={3} sx={{
              padding: "20px",
              borderRadius: "8px",
              width: "70vw", 
              height: "80vh", 
              marginTop: "10vh",
              marginLeft: "10vw",
            }}>
        <Box display="flex" justifyContent="center">
        <ImageList sx={{ width: "60vw", height: "80vh"}} cols={3} rowHeight={120} gap={8}>
        {itemData.map((item) => (
            <ImageListItem key={item.img}>
            <img
                src={`${item.img}?w=120&h=120&fit=crop&auto=format`}
                srcSet={`${item.img}?w=120&h=120&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
            />
            </ImageListItem>
        ))}
        </ImageList>
        </Box>
        </Paper>
        <Box sx={{transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
            ariaLabel="SpeedDial"
            sx={{ position: 'absolute', bottom: "3vh", right: "8vw" }}
            FabProps={{ size: "medium", style: { backgroundColor: "#FBDDDD" } }}
            icon={<SpeedDialIcon style={{color: "#000000"}}/>}
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {handleClick(action.content)}}
            />
            ))}
        </SpeedDial>

      {showUploadMeme && <UploadMeme />}
        </Box>
    </Container>
  );
};

export default ManageMeme;

const itemData = [
    {
      img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
      title: 'Breakfast',
    },
    {
        img: 'https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/canvas/2021/10/30/85f2cb5f-44f8-4f2f-a813-63e657e11acc_5065cac7.jpg?itok=gY-K9HdU&v=1635566576',
        title: 'Dinner',
    },
    {
    img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
    title: 'Breakfast',
    },
    {
        img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
        title: 'Breakfast',
      },
      {
          img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
          title: 'Breakfast',
      },
      {
      img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
      title: 'Breakfast',
      },
      {
        img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
        title: 'Breakfast',
      },
      {
          img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
          title: 'Breakfast',
      },
      {
      img: 'https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg',
      title: 'Breakfast',
      },
  ];