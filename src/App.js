import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql';
import { listTodos } from './graphql/queries';
import { createTodo, deleteTodo } from './graphql/mutations';

Amplify.configure(awsExports);

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await GraphQLAPI.graphql(graphqlOperation(listTodos));
    setTodos(apiData.data.listTodos.items);
  }

  async function addTodo() {
    if (!form.name) return;
    const newTodo = { ...form, completed: false };
    await GraphQLAPI.graphql(graphqlOperation(createTodo, { input: newTodo }));
    setForm({ name: '', description: '' });
    fetchTodos();
  }

  async function removeTodo(id) {
    await GraphQLAPI.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    fetchTodos();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My ToDo App</h1>
      <input
        placeholder="Todo name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button onClick={addTodo}>Add Todo</button>

      {todos.map((todo) => (
        <div key={todo.id} style={{ marginTop: 10 }}>
          <strong>{todo.name}</strong>
          <p>{todo.description}</p>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
