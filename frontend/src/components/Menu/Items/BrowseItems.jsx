import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid, TextField } from "@mui/material"; 
import AddOrder from '../../Orders/AddOrder'
import veg from '../../../assets/vegan.png'

const BrowseItems = ({
  itemName, 
  itemPrice, 
  itemDescription, 
  itemIngredient, 
  itemVegetarian, 
  tableID
}) => {

  const [amount, setAmount] = useState(null);

  const handleSubmitAmount = event => {
    console.log(itemName)
    setAmount(event.target.value);
  }

  return (
    <Card sx={{ border: '5px solid #FFA0A0', maxHeight: '34vh', borderRadius: 8 }}>
      <CardContent>
        <Box>
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', textAlign: "center" }}>
            {itemName.toUpperCase()}
            {itemVegetarian===1 ? (
              <img 
                src={veg} 
                alt="Icon" 
                style={{
                  width: '2.6vw',
                  height: '5vh',
                  marginLeft: '10px',
                  verticalAlign: 'middle',
                }}/>
            ): null }
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Price: ${itemPrice}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Descriptions: {itemDescription}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Ingredients: {itemIngredient}
          </Typography>

          <Typography variant="subtitle1">
            <form onSubmit={(e) => {
              e.preventDefault(); 
              e.target.reset();
            }}>
              <Grid container alignItems="center" direction="column" justifyContent="center" columnSpacing={1}>
                <Grid item>
                  <TextField 
                    type="number" 
                    size="small"
                    id="outlined-size-small"
                    label="Enter quantity" 
                    onChange={handleSubmitAmount} 
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                <AddOrder tableID={tableID} itemName={itemName} amount={amount} setAmount={setAmount} />
              </Grid>
            </form>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BrowseItems;