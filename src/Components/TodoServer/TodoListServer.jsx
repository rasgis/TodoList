import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import styles from './TodoListServer.module.css';

const API_URL = 'http://localhost:3001/todos';

export const TodoListServer = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [isSorted, setIsSorted] = useState(false);
	const [filteredTodos, setFilteredTodos] = useState([]);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		const response = await axios.get(API_URL);
		setTodos(response.data);
	};

	const addTodo = async () => {
		if (!newTodo.trim()) return;
		const newTask = { title: newTodo, completed: false };
		try {
			const response = await axios.post(API_URL, newTask);
			console.log('Добавлено:', response.data); 
			setTodos([...todos, response.data]);
			setNewTodo('');
		} catch (error) {
			console.error('Ошибка при добавлении задачи:', error);
		}
	};

	const deleteTodo = async (id) => {
		await axios.delete(`${API_URL}/${id}`);
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const updateTodo = async (id, updatedTitle) => {
		const response = await axios.patch(`${API_URL}/${id}`, {
			title: updatedTitle,
		});
		setTodos(
			todos.map((todo) =>
				todo.id === id ? response.data : todo,
			),
		);
	};

	const handleSearch = useCallback(
		debounce((term) => {
			const filtered = todos.filter((todo) =>
				todo.title.toLowerCase().includes(term.toLowerCase()),
			);
			setFilteredTodos(filtered);
		}, 300),
		[todos],
	);

	useEffect(() => {
		handleSearch(searchTerm);
	}, [searchTerm, handleSearch]);

	const toggleSort = () => {
		setIsSorted(!isSorted);
	};

	const sortedTodos = isSorted
		? [...filteredTodos].sort((a, b) =>
				a.title.localeCompare(b.title),
			)
		: filteredTodos;

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Список дел JSON-Server</h1>
			<div className={styles.controls}>
				<input
					type="text"
					placeholder="Найти задачу..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={styles.input}
				/>
				<button
					onClick={toggleSort}
					className={styles.button}
				>
					{isSorted
						? 'По времени добавления'
						: 'Сортировка по алфавиту'}
				</button>
			</div>
			<div className={styles.controls}>
				<input
					type="text"
					placeholder="Добавьте новую задачу..."
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					className={styles.input}
				/>
				<button
					onClick={addTodo}
					className={styles.button}
				>
					Добавить
				</button>
			</div>
			<ul className={styles.list}>
				{sortedTodos.map((todo) => (
					<li
						key={todo.id}
						className={styles.listItem}
					>
						<input
							type="text"
							value={todo.title}
							onChange={(e) =>
								updateTodo(todo.id, e.target.value)
							}
							className={styles.todoText}
						/>
						<button
							onClick={() => deleteTodo(todo.id)}
							className={styles.deleteButton}
						>
							Удалить
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
