import { useState, useEffect } from "react";

const ViewMemes = () => {
  const [memes, setMemes] = useState([]);

  const fetchMemes = async () => {
    try {
      const response = await fetch('http://localhost:8000/meme/listall', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      console.log(data);
      let memeList = [];
      for (var i of data) {
        if (i[3]) {
          memeList.push({ memeID: i[0], filename: i[1], count: i[2], img_url: i[3] });
        }
      }
      console.log(memeList);
      setMemes(memeList);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  }

  useEffect(() => {
    fetchMemes();
  }, [memes])

  return { memes }
}

export default ViewMemes;