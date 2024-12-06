import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(''); // Manage error state

  const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };

  const fetchTodos = () => {
    axios.get('http://FCJ-Lab-alb-133573696.ap-southeast-1.elb.amazonaws.com:3001/todos')
      .then(response => {
        const sortedTodos = response.data.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed - b.completed;
          }
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTodos(sortedTodos);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleComplete = (id) => {
    const todo = todos.find(todo => todo.id === id);
    axios.patch(`http://FCJ-Lab-alb-133573696.ap-southeast-1.elb.amazonaws.com:3001/todos/${id}`, { completed: !todo.completed })
      .then(response => {
        fetchTodos(); // Trigger refresh
      })
      .catch(error => console.log(error));
  };

  const updateTodo = (id, title, priority) => {
    axios.put(`http://FCJ-Lab-alb-133573696.ap-southeast-1.elb.amazonaws.com:3001/todos/${id}`, { title, priority })
      .then(response => {
        fetchTodos(); // Trigger refresh
      })
      .catch(error => console.log(error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://FCJ-Lab-alb-133573696.ap-southeast-1.elb.amazonaws.com:3001/todos/${id}`)
      .then(response => {
        fetchTodos(); // Trigger refresh
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Danh sách tác vụ</h2>
      <AddTodo fetchTodos={fetchTodos} setError={setError} error={error} />
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleComplete={toggleComplete} 
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          setError={setError}
          error={error}
        />
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TodoList;
