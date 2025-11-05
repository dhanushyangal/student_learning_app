import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiPlusCircle } from 'react-icons/fi'
import API from '../api'

export default function TodoForm(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(()=>{
    if(id){
      setLoading(true)
      API.get(`/todos/${id}`).then(res=>{
        setTitle(res.data.title)
        setDescription(res.data.description || '')
      }).catch(()=> alert('Failed to load')).finally(()=> setLoading(false))
    }
  }, [id])

  async function submit(e){
    e.preventDefault()
    if(!title.trim()) return alert('Title required')
    try{
      if(id){
        await API.put(`/todos/${id}`, { title, description })
      } else {
        await API.post('/todos', { title, description })
      }
      navigate('/')
    }catch(e){
      alert('Save failed')
    }
  }

  if(loading) return <p>Loading...</p>

  return (
    <div>
      <h2><span className="form-icon"><FiPlusCircle /></span>{id ? 'Edit' : 'New'} Todo</h2>
      <form onSubmit={submit} className="form">
        <label>Title
          <input value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
        <label>Description
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
        </label>
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={()=>navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
