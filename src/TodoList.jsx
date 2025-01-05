import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';

    function TodoList({ session }) {
      const [todos, setTodos] = useState([]);
      const [newTodo, setNewTodo] = useState('');
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetchTodos();
      }, []);

      const fetchTodos = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setTodos(data);
        } catch (error) {
          console.error('Error fetching todos:', error);
        } finally {
          setLoading(false);
        }
      };

      const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
          const { data, error } = await supabase.from('todos').insert([
            {
              task: newTodo,
              user_id: session.user.id,
            },
          ]);
          if (error) throw error;
          setTodos([...todos, ...data]);
          setNewTodo('');
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      };

      const deleteTodo = async (id) => {
        try {
          const { error } = await supabase.from('todos').delete().eq('id', id);
          if (error) throw error;
          setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
          console.error('Error deleting todo:', error);
        }
      };

      const handleSignOut = async () => {
        await supabase.auth.signOut();
      };

      if (loading) {
        return <p>Loading todos...</p>;
      }

      return (
        <div>
          <h1>Todo List</h1>
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo}>Add Todo</button>
          <div className="todo-list">
            {todos.map((todo) => (
              <div key={todo.id} className="todo-item">
                <span>{todo.task}</span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            ))}
          </div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      );
    }

    export default TodoList;
