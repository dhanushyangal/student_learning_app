import React, { useEffect, useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function TodoList(){
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchTodos(){
    try{
      const res = await API.get('/todos')
      setTodos(res.data)
    }catch(e){
      alert('Failed to load todos')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchTodos() }, [])

  async function remove(id){
    if(!confirm('Delete this todo?')) return;
    try{
      await API.delete(`/todos/${id}`)
      setTodos(todos.filter(t=>t.id !== id))
    }catch(e){
      alert('Failed to delete')
    }
  }

  if(loading) return <p>Loading...</p>

  return (
    <div>
      <h2>Todos</h2>
      {todos.length === 0 ? <p>No todos yet.</p> : (
        <ul className="todo-list">
          {todos.map(t=>(
            <li key={t.id}>
              <div>
                <strong>{t.title}</strong>
                <p>{t.description}</p>
              </div>
              <div className="actions">
                <Link to={`/edit/${t.id}`} className="btn icon"><FiEdit2 /></Link>
                <button onClick={()=>remove(t.id)} className="btn icon danger"><FiTrash2 /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
