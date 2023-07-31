import { useState, useEffect } from 'react';

const ListCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/menu/list/categories');
      const data = await response.json();
      const categoryArray = Object.values(data);
      console.log('categories', categoryArray);
      setCategories(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, setCategories };
};

export default ListCategories;
