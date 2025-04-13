import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

// Contexts
const TodoContext = createContext();
const VoteContext = createContext();

const TodoProvider = ({ children }) => {
  const [todos] = useState([
    { id: 1, title: "Belajar React", description: "Belajar dasar-dasar React", votes: 0 },
    { id: 2, title: "Buat Todo App", description: "Buat aplikasi Todo pakai React", votes: 0 },
  ]);

  return <TodoContext.Provider value={{ todos }}>{children}</TodoContext.Provider>;
};

const VoteProvider = ({ children }) => {
  const [votes, setVotes] = useState({});

  const vote = (id) => {
    setVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return <VoteContext.Provider value={{ votes, vote }}>{children}</VoteContext.Provider>;
};

// Components
const HomePage = () => {
  const { todos } = useContext(TodoContext);
  const { votes, vote } = useContext(VoteContext);
  const [selectedUser, setSelectedUser] = useState("user1");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Todo List</h1>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="mb-4 border p-2"
      >
        <option value="user1">User 1</option>
        <option value="user2">User 2</option>
      </select>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-4 border p-4 rounded shadow">
            <Link to={`/detail/${todo.id}`} className="text-lg font-medium">
              {todo.title}
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <span>Votes: {votes[todo.id] || 0}</span>
              <button
                onClick={() => vote(todo.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Vote
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DetailPage = () => {
  const { id } = useParams();
  const { todos } = useContext(TodoContext);
  const { votes } = useContext(VoteContext);
  const todo = todos.find((item) => item.id === parseInt(id));

  if (!todo) return <div>Todo not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{todo.title}</h1>
      <p>{todo.description}</p>
      <p className="mt-4">Votes: {votes[todo.id] || 0}</p>
      <Link to="/" className="text-blue-500 underline mt-4 block">
        Kembali ke Home
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <TodoProvider>
      <VoteProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Routes>
        </Router>
      </VoteProvider>
    </TodoProvider>
  );
};

export default App;
