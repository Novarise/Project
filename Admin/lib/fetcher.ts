import axios from 'axios';

const fetcher = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export default fetcher;
