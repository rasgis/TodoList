import React, { useEffect, useState } from 'react';
import { database } from '../../../firebaseConfig';
import {
	ref,
	set,
	push,
	get,
	update,
	remove,
} from 'firebase/database';
import debounce from 'lodash.debounce';
import styles from './TodoListFireBase.module.css';

export const TodoListFirebase = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [isSorted, setIsSorted] = useState(false);
	const [filteredTodos, setFilteredTodos] = useState([]);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		const todosRef = ref(database, 'todos');
		const snapshot = await get(todosRef);

		if (snapshot.exists()) {
			const data = snapshot.val();
			const todosArray = Object.keys(data).map((key) => ({
				id: key,
				...data[key],
			}));
			setTodos(todosArray);
		}
	};

	const addTodo = async () => {
		if (!newTodo.trim()) return;

		const todosRef = ref(database, 'todos');
		const newTodoRef = push(todosRef);

		await set(newTodoRef, { title: newTodo, completed: false });

		setTodos((prevTodos) => [
			...prevTodos,
			{ id: newTodoRef.key, title: newTodo, completed: false },
		]);
		setNewTodo('');
	};

	const deleteTodo = async (id) => {
		const todoRef = ref(database, `todos/${id}`);
		await remove(todoRef);
		setTodos((prevTodos) =>
			prevTodos.filter((todo) => todo.id !== id),
		);
	};

	const updateTodo = async (id, updatedTitle) => {
		const todoRef = ref(database, `todos/${id}`);
		await update(todoRef, { title: updatedTitle });
	};

	const handleSearch = debounce((term) => {
		setSearchTerm(term);
	}, 300);

	useEffect(() => {
		let filtered = [...todos];

		if (searchTerm) {
			filtered = filtered.filter((todo) =>
				todo.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (isSorted) {
			filtered.sort((a, b) => a.title.localeCompare(b.title));
		}

		setFilteredTodos(filtered);
	}, [todos, searchTerm, isSorted]);

	const toggleSort = async () => {
		setIsSorted((prev) => !prev);
	};

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Список дел Firebase</h1>
			<div className={styles.controls}>
				<input
					type="text"
					placeholder="Найти задачу..."
					value={searchTerm}
					onChange={(e) => handleSearch(e.target.value)}
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
				{filteredTodos.map((todo) => (
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
