import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputDueDate, setInputDueDate] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();
  const [errorMessage, setErrorMessage] = useState(""); 

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
    setInputValue(todo.name);
    setInputDescription(todo.description);
    setInputDueDate(todo.dueDate.split('T')[0]);
  }

  async function handleWithNewButton() {
    setInputVisibility(!inputVisibility);
    setErrorMessage(""); 
  }

  async function getTodos(status) {
    let url = "http://localhost:3333/todos";
    
    if (status !== undefined) {
      url += `?status=${status}`;
    }

    const response = await axios.get(url);
    setTodos(response.data);
  }

  async function deleteTodo(todo) {
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();    
  }

  async function createTodo() {
   
    if (!inputValue || !inputDescription || !inputDueDate) {
      setErrorMessage("Por favor, preencha todos os campos."); 
      return; 
    }

    try {
      await axios.post("http://localhost:3333/todos", {
        name: inputValue,
        description: inputDescription,
        dueDate: inputDueDate,
      });
      getTodos();
      setInputVisibility(false);  
      setInputValue("");
      setInputDescription("");
      setInputDueDate("");
      setErrorMessage(""); 
    } catch (error) {
      setErrorMessage("Erro ao criar a tarefa. Tente novamente."); 
    }
  }

  async function editTodo() {
  
    if (!inputValue || !inputDescription || !inputDueDate) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await axios.put("http://localhost:3333/todos", {
        id: selectedTodo.id,
        name: inputValue,
        description: inputDescription,
        dueDate: inputDueDate,
      });    
      setSelectedTodo();
      setInputVisibility(false);
      setInputValue("");
      setInputDescription("");
      setInputDueDate("");
      getTodos();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Erro ao editar a tarefa. Tente novamente.");
    }
  }

  async function modifyStatusTodo(todo, statusValue) {
    const updatedStatus = statusValue === "Concluída";

    await axios.put("http://localhost:3333/todos", {
      id: todo.id,
      status: updatedStatus,
    });
    getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  const Todos = ({ todos }) => {
    return (
      <div className="todos">
        <table className="todo-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Data de vencimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.id}>
                <td>
                  <select 
                    value={todo.status ? "Concluída" : "Não Concluída"}
                    onChange={(event) => modifyStatusTodo(todo, event.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Concluída">Concluída</option>
                    <option value="Não Concluída">Não Concluída</option>
                  </select>
                </td>
                <td>{todo.name}</td>
                <td>{todo.description}</td>
                <td>{new Date(todo.dueDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleWithEditButtonClick(todo)}>
                    <AiOutlineEdit size="20" color="#64697b" />
                  </button>
                  <button onClick={() => deleteTodo(todo)}>
                    <AiOutlineDelete size="20" color="#64697b" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="container">
        <div className='header'>
          <h1>Lista de tarefas</h1>
        </div>

        <div className="filters">
          <button onClick={() => getTodos()}>Todas</button>
          <button onClick={() => getTodos(true)}>Concluidas</button>
          <button onClick={() => getTodos(false)}>Pendentes</button>
        </div>

        <Todos todos={todos}></Todos>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input 
          value={inputValue} 
          style={{ display: inputVisibility ? "block" : "none" }}
          onChange={(event) => setInputValue(event.target.value)}
          className="inputName"
          placeholder="Nome da tarefa"
        />
        <input 
          value={inputDescription} 
          style={{ display: inputVisibility ? "block" : "none" }}
          onChange={(event) => setInputDescription(event.target.value)}
          className="inputDescription"
          placeholder="Descriçao"
        />
        <input 
          type="date"
          value={inputDueDate} 
          style={{ display: inputVisibility ? "block" : "none" }}
          onChange={(event) => setInputDueDate(event.target.value)}
          className="inputDueDate"
        />
        <button 
          onClick={inputVisibility ? selectedTodo ? editTodo : createTodo : handleWithNewButton} 
          className='newTaskButton'>
          {inputVisibility ? "Confirm" : "+ Nova tarefa"}
        </button>
      </header>
    </div>
  );
}

export default App;