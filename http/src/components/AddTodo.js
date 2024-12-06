import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTodo.css'; // Import the CSS for styling

const validateTitle = (title) => {
  return title.trim() !== '' && /^[\p{L}\p{N}\s]+$/u.test(title);
};

const AddTodo = ({ fetchTodos, setError, error }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');

  const addTodo = () => {
    if (validateTitle(title)) {
      axios.post('http://FCJ-Lab-alb-133573696.ap-southeast-1.elb.amazonaws.com:3001/todos', { title, priority }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        console.log(response.data);
        setTitle('');
        setPriority('Low');
        setError(''); // Clear error message
        fetchTodos(); // Trigger refresh
      })
      .catch(error => console.log(error));
    } else {
      setError('Tên tác vụ không được để trống hoặc chứa ký tự không hợp lệ.');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="add-todo-container">
      <input 
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập vào tác vụ"
      />
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Thấp</option>
        <option value="Medium">Trung bình</option>
        <option value="High">Cao</option>
        <option value="Critical">Nghiêm trọng</option>
      </select>
      <button onClick={addTodo}>Thêm tác vụ</button>
    </div>
  );
};

export default AddTodo;
