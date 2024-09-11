import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppealsList = () => {
  const [appeals, setAppeals] = useState([]);

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appeal');
        setAppeals(response.data);
      } catch (error) {
        console.error('Error fetching appeals:', error);
        const errorMessage = error.response?.data?.message || 'An error occurred';
        alert(`Error fetching appeals: ${errorMessage}`);
      }
    };

    fetchAppeals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/appeal/${id}`);
      setAppeals(appeals.map(appeal => appeal._id === id ? { ...appeal, appealStatus: 'approved' } : appeal));
    } catch (error) {
      console.error('Error approving appeal:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(`Error approving appeal: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h1>Appeals List</h1>
      <ul>
        {appeals.map((appeal) => (
          <li key={appeal._id}>
            <p>UIN: {appeal.uin}</p>
            <p>Class ID: {appeal.classId}</p>
            <p>Appeal Reason: {appeal.appealReason}</p>
            <p>Status: {appeal.appealStatus}</p>
            {appeal.appealStatus === 'pending' && (
              <button onClick={() => handleApprove(appeal._id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppealsList;