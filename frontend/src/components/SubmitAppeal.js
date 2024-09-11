import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SubmitAppeal = () => {
  const [uin, setUin] = useState('');
  const [classId, setClassId] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const history = useHistory(); // Get the history instance

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/appeal/new', { uin, classId, appealReason });
      alert('Appeal submitted successfully');
      history.push('/appeals-list');
    } catch (error) {
      console.error('Error submitting appeal:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(`Error submitting appeal: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>UIN:</label>
        <input type="text" value={uin} onChange={(e) => setUin(e.target.value)} required />
      </div>
      <div>
        <label>Class ID:</label>
        <input type="text" value={classId} onChange={(e) => setClassId(e.target.value)} required />
      </div>
      <div>
        <label>Appeal Reason:</label>
        <textarea value={appealReason} onChange={(e) => setAppealReason(e.target.value)} required />
      </div>
      <button type="submit">Submit Appeal</button>
    </form>
  );
};

export default SubmitAppeal;