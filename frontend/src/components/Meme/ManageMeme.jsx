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
import ViewVoteCount from "./ViewVoteCount";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Manager from "../UserInterface/ManagerInterface";

const actions = [
    { icon: <AddAPhotoIcon />, name: 'Upload Meme', content: "Upload Meme" },
    { icon: <ConfirmationNumberIcon />, name: 'Check vote count', content: "Vote Count" },
  ];
const ManageMeme = () => {
    const [cookies] = useCookies(['token']);
    const [showUploadMeme, setShowUploadMeme] = useState(false);
    const [showVoteCount, setShowVoteCount] = useState(false);

    const [memes, setMemes] = useState([]);
    const [email, setEmail] = useState([]);
    const handleUploadMemeClose = () => {
        setShowUploadMeme(false);
      };

    const handleVoteCount = () => {
        setShowVoteCount(false);
    };
    const handleClick = (content) => {
      if (content === 'Upload Meme') {
        setShowUploadMeme(true);
      } else if (content === "Vote Count") {
        setShowVoteCount(true);
        fetchMemesCount();
      }
    };

    useEffect(() => {
        fetchMemes();
    }, []);

    const fetchMemes = async () => {
        try {
        const response = await fetch('http://localhost:8000/meme/listall');
        const data = await response.json();
        const memesArray = Object.values(data);
        console.log('here1', memesArray)
        const transformedMemes = memesArray.map((meme, index) => ({
            index: index,
            image: meme[3], // Assuming the image is the first element in each array, adjust this based on your actual data structure
            count: meme[2], // Assuming the count is the third element in each array, adjust this based on your actual data structure
          }));
      
          console.log('transformedMemes:', transformedMemes);
          setMemes(transformedMemes);
        } catch (error) {
        console.error('Error fetching Items:', error);
        }
    };

    const fetchMemesCount = async () => {
        try {
        const response = await fetch('http://localhost:8000/meme/listall/emails', {
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${cookies.token}`
            },
          });
        const data = await response.json();
        const memesArray = Object.values(data);
        console.log('email', memesArray)
        const transformedMemes = memesArray.map((meme, index) => ({
            index: index,
            image: meme[3],
            count: meme[2],
          }));
      
          console.log('transformedMemes:', transformedMemes);
          setEmail(transformedMemes);
        } catch (error) {
        console.error('Error fetching Items:', error);
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
        {/* sx={{ width: "60vw", height: "80vh"}}  */}
        <ImageList cols={3} rowHeight={250} gap={10} sx={{ display: 'grid' }}>
        {memes.map((item) => (
            <ImageListItem key={item.index} >
            <Paper elevation={3} style={{border: "2px #FFA0A0 solid", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}}>
            <div style={{height: "200px", width: "200px"}}>
            <img
                src={`${item.image}?w=200&h=200&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />     
            </div>
       
               

            <div style={{padding: "10px"}}>
                {item.count} Likes
            </div>
            </Paper> 
            
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

      {showUploadMeme && <UploadMeme onClose={handleUploadMemeClose}/>}
      {showVoteCount && <ViewVoteCount onClose={handleVoteCount}/>}
        </Box>
    </Container>
  );
};

export default ManageMeme;