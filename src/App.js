import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { generateClient } from 'aws-amplify/api'; // ✅ 新しいAPI
import { listTodos } from './graphql/queries';
import { createTodo, deleteTodo } from './graphql/mutations';

// ✅ Amplifyの初期化（1回のみ）
Amplify.configure(awsExports);

// ✅ クライアントの生成（再生成されないように外に出す）
const client = generateClient();

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  // 初回のみ実行
  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ データ取得
  async function fetchTodos() {
    try {
      const result = await client.graphql({ query: listTodos });
      setTodos(result.data.listTodos.items);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  // ✅ データ追加
  async function addTodo() {
    if (!form.name) return;
    const newTodo = { ...form, completed: false };
    try {
      await client.graphql({ query: createTodo, variables: { input: newTodo } });
      setForm({ name: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Add error:', error);
    }
  }

  // ✅ データ削除
  async function removeTodo(id) {
    try {
      await client.graphql({ query: deleteTodo, variables: { input: { id } } });
      fetchTodos();
    } catch (error) {
      console.error('Delete error:', error);
    }
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