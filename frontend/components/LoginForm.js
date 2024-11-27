import React, { useState } from 'react'
import PT from 'prop-types'


export default function LoginForm({ login }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // ✨ where are my props? Destructure them here

  const onChange = evt => {
    const { id, value } = evt.target
    if(id === 'username'){
      setUsername(value)
    } else if (id === 'password'){
      setPassword(value)
    }
  }

  const onSubmit = evt => {
    evt.preventDefault()
    login({ username, password })
  }

  const isDisabled = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    return trimmedUsername.length < 3 || trimmedPassword.length < 8;
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
