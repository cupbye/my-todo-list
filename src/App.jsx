import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addDays,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  eachDayOfInterval
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [todosByDate, setTodosByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentTodos = todos.filter(t => t.date === dateKey);
  const pendingTodos = currentTodos.filter(t => !t.completed);
  const completedTodos = currentTodos.filter(t => t.completed);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Real-time synchronization for ALL todos (to show dots correctly)
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = [];
      const stats = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const todo = { id: doc.id, ...data };
        todosData.push(todo);

        // Build stats for dots
        if (!stats[data.date]) {
          stats[data.date] = [];
        }
        stats[data.date].push(todo);
      });

      setTodos(todosData);
      setTodosByDate(stats);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    try {
      await addDoc(collection(db, "todos"), {
        text: inputValue,
        completed: false,
        date: dateKey,
        createdAt: serverTimestamp()
      });
      setInputValue('');
    } catch (error) {
      console.error("Error adding todo: ", error);
      alert("데이터 저장 중 오류가 발생했습니다. 파이어베이스 설정을 확인해 주세요.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        completed: !completed
      });
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  // Monthly calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const getTodoStats = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    const dayTodos = todosByDate[key] || [];
    if (dayTodos.length === 0) return null;

    return {
      count: dayTodos.length,
      allCompleted: dayTodos.every(t => t.completed)
    };
  };

  return (
    <div className="app-container">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <h1>Todo List</h1>

      <div className="calendar-card">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <span className="current-month-text">{format(currentMonth, 'yyyy년 MM월', { locale: ko })}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-grid">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="weekday-label">{day}</div>
          ))}

          {calendarDays.map(day => {
            const stats = getTodoStats(day);
            return (
              <div
                key={day.toISOString()}
                className={`calendar-day
                  ${isSameDay(day, selectedDate) ? 'selected' : ''}
                  ${!isSameMonth(day, monthStart) ? 'outside' : ''}
                `}
                onClick={() => {
                  setSelectedDate(day);
                  if (!isSameMonth(day, monthStart)) setCurrentMonth(day);
                }}
              >
                <span className="day-number-text">{format(day, 'd')}</span>
                {stats && (
                  <div className={`dot-indicator
                    ${stats.count > 5 ? 'urgent' : ''}
                    ${stats.allCompleted ? 'done' : ''}
                  `}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="date-display">
        {format(selectedDate, 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
      </div>

      <form onSubmit={addTodo} className="input-group">
        <input
          type="text"
          placeholder="할 일을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="add-btn" aria-label="Add todo">
          <Plus size={24} />
        </button>
      </form>

      <div className="todo-sections">
        <div className="todo-section">
          <h3>할 일 <span>{pendingTodos.length}</span></h3>
          <ul className="todo-list">
            {pendingTodos.length > 0 ? (
              pendingTodos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <span
                    className="todo-text"
                    onClick={() => toggleComplete(todo.id, todo.completed)}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    aria-label="Delete todo"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))
            ) : (
              <div className="empty-state">
                <CheckCircle2 size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
                <p>할 일이 없습니다.</p>
              </div>
            )}
          </ul>
        </div>

        {completedTodos.length > 0 && (
          <div className="todo-section completed-section">
            <h3>완료됨 <span>{completedTodos.length}</span></h3>
            <ul className="todo-list">
              {completedTodos.map(todo => (
                <li key={todo.id} className="todo-item completed">
                  <span
                    className="todo-text"
                    onClick={() => toggleComplete(todo.id, todo.completed)}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    aria-label="Delete todo"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
