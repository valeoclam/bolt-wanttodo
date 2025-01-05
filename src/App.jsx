import React, { useState, useEffect } from 'react';
    import { supabase } from './supabaseClient';
    import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
    import Auth from './Auth';
    import TodoList from './TodoList';

    function App() {
      const [session, setSession] = useState(null);
      const navigate = useNavigate();

      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
      }, []);

      useEffect(() => {
        if (session) {
          navigate('/todos');
        } else {
          navigate('/auth');
        }
      }, [session, navigate]);

      return (
        <div className="container">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/todos" element={<TodoList session={session} />} />
          </Routes>
        </div>
      );
    }

    export default App;
