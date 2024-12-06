require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const sequelize = require('./config/database');
const Todo = require('./models/todo');
const app = express();

app.use(cors());
app.use(express.json());


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.findAll();
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req, res) => {
    try {
        console.log('Request payload:', req.body);
        const { title, priority } = req.body;
        const todo = await Todo.create({ title, priority });
        console.log('Todo created:', todo);
        res.status(201).json(todo);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

app.patch('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const todo = await Todo.findByPk(id);
        if (todo) {
            todo.completed = completed;
            await todo.save();
            res.status(200).json(todo);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to update a task
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, priority } = req.body;

    const priorityTranslations = {
        'Thấp': 'Low',
        'Trung bình': 'Medium',
        'Cao': 'High',
        'Nghiêm trọng': 'Critical'
    };

    const translatedPriority = priorityTranslations[priority] || priority;

    console.log(`Updating task ID ${id} with title: ${title} and priority: ${translatedPriority}`);

    try {
        const todo = await Todo.findByPk(id);
        if (todo) {
            todo.title = title;
            todo.priority = translatedPriority;
            await todo.save();
            res.status(200).json(todo);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        console.error(`Error updating task: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
});

// Route to delete a task
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findByPk(id);
        if (todo) {
            await todo.destroy();
            res.status(200).json({ message: 'Todo deleted' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the TODO app');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
