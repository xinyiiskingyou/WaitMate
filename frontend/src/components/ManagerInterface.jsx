import React,{ useState, useEffect } from 'react';
import '../app.css';
import {
  AppBar, 
  Toolbar, 
  Typography, 
  ThemeProvider, 
  createTheme,
  Drawer, 
  List,
  ListItem,
  ListItemText,
  Input,
  TextField,
  IconButton
} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import {Link} from 'react-router-dom';
import WaitMate from "../assets/WaitMate.png";
import AddButton from "../assets/Group 38.png";
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useCookies } from 'react-cookie';
const Manager = () => {
  const theme = createTheme({
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FBDDDD",
            },
            "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#FBDDDD",
              },
          },
        },
      },
    },
  });

  const buttonStyle = {
    width: '200px',
    height: '100px',
    fontSize: '18px',
    border: "5px solid #FFA0A0",
    color: "black"
  };
  const headingStyle = {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px'
  };

  const [editing, setEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies(['token']);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleNewButtonClick = () => {
    setEditing(true);
  };

  const handleCategoryTextChange = (e) => {
    setCategoryText(e.target.value);
  };

  const handleCategoryDone = () => {
    setCategoryText('');
    setEditing(false);
  };
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const styles = {
    margin: '5%',
    width: '80%',
    borderColor: isFocused ? 'pink' : '',
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/menu/list/categories');
      const data = await response.json();
      const categoryArray = Object.values(data);
      console.log(categoryArray);
      setCategories(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleSaveCategory = () => {
    
    if (categoryText.trim() !== '') {
      const payload = { name: categoryText.trim() };
      fetch('http://localhost:8000/menu/category/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to save category');
          }
        })
        .then(() => {
          // Handle the response data if necessary
          setCategories([...categories, categoryText.trim()]);
          handleCategoryDone();
        })
        .catch(error => {
          console.error(error);
          alert('Failed to add category. Please try again.');
          handleCategoryDone();
        });
    } else {
      alert('Failed to add category. Please try again.');
      handleCategoryDone();
    }
  };
  return (
    <ThemeProvider theme={theme}>
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
          <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "50px" }}>
              <Button style={{color:"black"}} component={Link} to="/button1">
                Menu
              </Button>
              <Button style={{color:"black"}} component={Link} to="/button2">
                Meme
              </Button>
              <Button style={{color:"black"}} component={Link} to="/button3">
                Coupon
              </Button>
              <Button style={{color:"black"}} component={Link} to="/button4">
                Management
              </Button>
            </div>
          </div>

        </Toolbar>
      </AppBar>
  
        <div style={{display: "flex", alignItems: "center"}}>
        <Button style={{
          height: "50%", 
          background: "white", 
          marginLeft: "-10px", 
          marginTop: "100px", 
          padding: "100px 0",
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px'
        }} onClick={toggleSidebar}>
          <Typography className='sideways-text' color={"black"}>Menu Category</Typography>
        </Button>


        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{ style: { 
            marginTop: "180px",
            width: '250px', 
            height: "600px", 
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px'
          } }}
        >
          <div style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center"
          }}>
          <Typography 
            variant='h5'
            style={{margin: "20px"}}>
            Menu Category
          </Typography>
          </div>

          {editing ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              id="category"
              label="Category"
              value={categoryText}
              onChange={handleCategoryTextChange}
              size='small'
              variant='outlined'
              color='primary'
              style= {{margin: '5%', width: '80%'}}
              fullWidth
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={handleSaveCategory} 
                variant="contained" 
                style={{background: "#81c784", marginRight: "10px"}}
              >
                Save
              </Button>
              <Button 
                onClick={handleCategoryDone} 
                variant="contained" 
                style={{background: "#ffc570"}}
              >
                Cancel
              </Button>
            </div>
          </Box>
        ) : (
          <Button
            variant='contained'
            style={{backgroundColor: "#FBDDDD", marginRight: "20px", marginLeft: "20px"}}
            onClick={handleNewButtonClick} 
          >
          <Typography 
            color="black"
            style={{marginTop: "5px", marginBottom: "5px"}}>
            + Add Category
          </Typography>
          </Button>
        )}

          <List>
          { Object.entries(categories).map(([index, category]) => (
          <ListItem button onClick={toggleSubMenu} key={index} variant="outlined" style={{
            borderRadius: "20px",
            backgroundColor: "#FBDDDD",
            marginBottom: "10px",
            marginLeft: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "85%"
          }}
          >
            <ListItemText primary={category.toUpperCase()} />
          </ListItem>
        ))}
          </List>
        </Drawer>
        <div style={{position: "relative",marginLeft: "120px",marginTop: "60px",backgroundColor: "white", width: "80%", display: "flex", height: "700px"}}>
          <Button style={{position: "position", right: "-1000px", bottom: "-550px", height: "100px", padding: "0", borderRadius: "50%"}}>
            <img src={AddButton}/>
          </Button>
        </div>
        </div>

    </div>
    </ThemeProvider>
  );
};

export default Manager;