import "./App.css"; // Importa el archivo de estilos CSS para la aplicación
import React, {useState, useEffect} from "react"; // Importa React y los hooks useState y useEffect

const App = () => { // Define el componente funcional principal de la aplicación
  // State para almacenar la lista de tareas y el estado de edición de una tarea
  const [todos, setTodos] = useState([]); // Utiliza el hook useState para crear un estado 'todos' inicializado como un array vacío
  const [todoEditing, setTodoEditing] = useState(null); // Utiliza el hook useState para crear un estado 'todoEditing' inicializado como null
 
  // Efecto para cargar las tareas almacenadas en el localStorage al cargar la aplicación
  useEffect(() => { // Utiliza el hook useEffect para ejecutar código después de que el componente se monta en el DOM
    const json = localStorage.getItem("todos"); // Obtiene los datos de las tareas del localStorage
    const loadedTodos = JSON.parse(json); // Parsea los datos JSON a un array de tareas
    if (loadedTodos) { // Si hay tareas cargadas en el localStorage
      setTodos(loadedTodos); // Actualiza el estado 'todos' con las tareas cargadas
    }
  }, []); // El segundo argumento es un array vacío, por lo que el efecto se ejecuta solo una vez al montar el componente
  
  // Efecto para guardar las tareas en el localStorage cuando cambia la lista de tareas
  useEffect(() => { // Utiliza el hook useEffect para ejecutar código después de cada renderizado
    if(todos.length > 0) { // Verifica si hay tareas en la lista
        const json = JSON.stringify(todos); // Convierte el array de tareas a formato JSON
        localStorage.setItem("todos", json); // Almacena las tareas en el localStorage
    }
  }, [todos]); // El efecto se ejecuta cada vez que cambia el estado 'todos'

  // Función para manejar la presentación de un nuevo formulario de tarea
  function handleSubmit(e) { // Define una función para manejar el envío del formulario de agregar tarea
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    let todo = document.getElementById('todoAdd').value; // Obtiene el valor del campo de texto de la tarea
    const newTodo = { // Crea un objeto de nueva tarea
      id: new Date().getTime(), // Asigna un ID único utilizando la marca de tiempo actual
      text: todo.trim(), // Asigna el texto de la tarea, eliminando espacios en blanco iniciales y finales
      completed: false, // Inicializa la tarea como no completada
    };
    if (newTodo.text.length > 0 ) { // Verifica si el texto de la tarea no está vacío
        setTodos([...todos].concat(newTodo)); // Agrega la nueva tarea al estado 'todos'
    } else { // Si el texto de la tarea está vacío
        alert("Enter Valid Task"); // Muestra una alerta indicando que se debe ingresar una tarea válida
    }
    document.getElementById('todoAdd').value = ""; // Limpia el campo de texto del formulario después de agregar la tarea
  }
  
  // Función para eliminar una tarea
  function deleteTodo(id) { // Define una función para eliminar una tarea según su ID
    let updatedTodos = [...todos].filter((todo) => todo.id !== id); // Crea un nuevo array de tareas excluyendo la tarea con el ID dado
    setTodos(updatedTodos); // Actualiza el estado 'todos' con el nuevo array de tareas
  }

  // Función para cambiar el estado de completado de una tarea
  function toggleComplete(id) { // Define una función para cambiar el estado de completado de una tarea
    let updatedTodos = [...todos].map((todo) => { // Crea un nuevo array de tareas
      if (todo.id === id) { // Si el ID de la tarea coincide con el ID dado
        todo.completed = !todo.completed; // Cambia el estado de completado de la tarea
      }
      return todo; // Retorna la tarea modificada o sin cambios
    });
    setTodos(updatedTodos); // Actualiza el estado 'todos' con el nuevo array de tareas
  }
  
  // Función para enviar las ediciones de una tarea
  function submitEdits(newtodo) { // Define una función para enviar las ediciones de una tarea
    const updatedTodos = [...todos].map((todo) => { // Crea un nuevo array de tareas
      if (todo.id === newtodo.id) { // Si el ID de la tarea coincide con el ID de la tarea editada
        todo.text = document.getElementById(newtodo.id).value; // Actualiza el texto de la tarea con el valor del campo de entrada de edición
      }
      return todo; // Retorna la tarea modificada o sin cambios
    });
    setTodos(updatedTodos); // Actualiza el estado 'todos' con el nuevo array de tareas
    setTodoEditing(null); // Restablece el estado de edición de la tarea a null para salir del modo de edición
  }
  
  // Devuelve la interfaz de usuario de la aplicación
  return (
    <div id="todo-list">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}> {/* Formulario para agregar una nueva tarea */}
        <input
          type="text"
          id="todoAdd"
        />
        <button type="submit">Add Todo</button> {/* Botón para agregar la tarea */}
      </form>

      {todos.map((todo) => ( // Mapea cada tarea en el estado 'todos' y renderiza su interfaz de usuario
        <div key={todo.id} className="todo"> {/* Div para cada tarea */}
          <div className="todo-text"> {/* Contenedor del texto de la tarea */}
            {/* Checkbox para marcar la tarea como completada */}
            <input
              type="checkbox"
              id="completed"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            {/* Si está en modo de edición, muestra un campo de entrada, de lo contrario, muestra el texto */}
            {todo.id === todoEditing ?
              (<input
                type="text"
                id={todo.id}
                defaultValue={todo.text}
              />) :
              (<div>{todo.text}</div>)
            }
          </div>
          <div className="todo-actions"> {/* Contenedor de acciones de la tarea (editar y eliminar) */}
            {/* Si está en modo de edición, permite enviar las ediciones, de lo contrario, permite editar */}
            {todo.id === todoEditing ?
              (
                <button onClick={() => submitEdits(todo)}>Submit Edits</button>
              ) :
              (
                <button onClick={() => setTodoEditing(todo.id)}>Edit</button>
              )}

            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
     </div>
  </div>
))}
</div>
);
};
export default App;
