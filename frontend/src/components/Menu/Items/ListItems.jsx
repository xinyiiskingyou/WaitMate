import { useState } from 'react';

const ListItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenuItems = async (index) => {
    index = parseInt(index, 10) + 1;
    console.log(index);

    try {
      const response = await fetch('http://localhost:8000/menu/list/items/' + index);
      const data = await response.json();
      const itemArray = Object.values(data);
      console.log('here1', itemArray)

      if (itemArray.length === 1) {
        if (itemArray[0].name !== null) {
          setMenuItems(itemArray);
        }
      } else {
        setMenuItems(itemArray);
      }
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  };

  return { menuItems, setMenuItems, fetchMenuItems };
}

export default ListItems;