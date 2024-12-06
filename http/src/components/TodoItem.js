import React, { useState, useEffect } from 'react';
import './TodoItem.css';

const validateTitle = (title) => {
  return title.trim() !== '' && /^[\p{L}\p{N}\s]+$/u.test(title);
};

const TodoItem = ({ todo, toggleComplete, updateTodo, deleteTodo, setError, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState(todo.priority);

  const priorityColors = {
    Thấp: 'green',
    'Trung bình': 'blue',
    Cao: 'orange',
    'Nghiêm trọng': 'red'
  };

  const priorityTranslations = {
    Low: 'Thấp',
    Medium: 'Trung bình',
    High: 'Cao',
    Critical: 'Nghiêm trọng'
  };

  const handleSave = () => {
    if (validateTitle(title)) {
      console.log(`Saving task with priority: ${priority}`); // Debugging line
      updateTodo(todo.id, title, priority);
      setError(''); // Clear error message
      setIsEditing(false);
    } else {
      setError('Tên tác vụ không được để trống hoặc chứa ký tự không hợp lệ.');
    }
  };

  const handleDiscard = () => {
    setTitle(todo.title);
    setPriority(todo.priority);
    setError(''); // Clear error message
    setIsEditing(false);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    setPriority(todo.priority); // Ensure priority updates correctly
  }, [todo.priority]);

  return (
    <div className="todo-item-container">
      <div className="todo-item">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleComplete(todo.id)} 
        />
        <div className="priority-container">
          <span 
            className="todo-priority" 
            style={{ color: priorityColors[priorityTranslations[todo.priority]] }}
          >
            {priorityTranslations[todo.priority]}
          </span>
        </div>
        {isEditing ? (
          <>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
              <option value="Nghiêm trọng">Nghiêm trọng</option>
            </select>
            <button className="save-button" onClick={handleSave}>Lưu</button>
            <button className="discard-button" onClick={handleDiscard}>Hoàn lại</button>
          </>
        ) : (
          <>
            <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </span>
            <button className="edit-button" onClick={() => setIsEditing(true)}>Sửa</button>
          </>
        )}
        <button className="delete-button" onClick={() => deleteTodo(todo.id)}>Xóa</button>
      </div>
    </div>
  );
};

export default TodoItem;
