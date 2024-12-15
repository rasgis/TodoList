import React from 'react';
import ReactDOM from 'react-dom/client';
import { TodoList } from './Components/TodoPlaceholder/TodoList';
import { TodoListServer } from './Components/TodoServer/TodoListServer';
import {TodoListFirebase} from './Components/TodoFire/TodoListFirebase'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<div className="container">
			<TodoList />
			<TodoListServer />
			<TodoListFirebase />
		</div>
	</React.StrictMode>,
);
