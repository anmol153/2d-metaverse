import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { id } from '../redux/user'; 

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [us, setUs] = useState('');

  const handler = (e) => {
    e.preventDefault(); 
    if (us.trim() === '') return; 
    dispatch(id(us));
    navigate('/map');
  };

  return (
    <form onSubmit={handler} className="flex flex-col items-center mt-10 space-y-4">
      <input
        className="w-64 h-10 px-4 border rounded"
        placeholder="Enter your ID"
        value={us}
        onChange={(e) => setUs(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default Home;
