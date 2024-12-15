import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TodoList.module.css';

export const TodoList = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		axios
			.get('https://jsonplaceholder.typicode.com/todos')
			.then((response) => setTodos(response.data.slice(0, 10)))
			.catch((error) => console.error(error));
	}, []);

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Список дел Placeholder</h1>
			<ul className={styles.list}>
				{todos.map((todo) => (
					<li
						key={todo.id}
						className={styles.listItem}
					>
						<div className={styles.todoContent}>
							<span className={styles.todoText}>
								{todo.title}
							</span>
							<span
								className={`${styles.status} ${
									todo.completed
										? styles.completed
										: styles.pending
								}`}
							>
								{todo.completed
									? 'Выполнено!'
									: 'В работе...'}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
