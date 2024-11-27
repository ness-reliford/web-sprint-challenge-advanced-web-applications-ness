import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/LoginForm')
  }
  const redirectToArticles = () => {
    navigate('/Articles')
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    localStorage.removeItem('token')
    setToken(null)
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!')
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin()
  }

  const login = async ({ username, password }) => {
    
    setMessage('')
    setSpinnerOn(true)
   
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      if(!response.ok) {
        throw new Error('Login failed')
      }
      const data = await response.json()
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setMessage('Login successful!')
      redirectToArticles()
      getArticles()
    } catch (error){
      console.error(error)
      setMessage('Login failed. Please try again.')
      
    } finally {
      setSpinnerOn(false)
    }
    
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    try {
      const response = await fetch(articlesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      if (!response.ok) {
        if (response.status === 401) {
          setMessage('Unauthorized. Please login.');
          localStorage.removeItem('token');
          setToken(null);
          redirectToLogin();
        } else {
          throw new Error('Failed to fetch articles.');
        }
      }
  
      const data = await response.json();
      setArticles(data);
      setMessage('Articles fetched successfully.');
     
    } catch(error) {
      console.error(error)
      setMessage('Failed to fetch articles. Please try again.')
    } finally {
      setSpinnerOn(false)
    }
  }

  useEffect(() => {
    if(token) {
      getArticles()
    }
  },[token])

  const postArticle = async article => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    try {
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),   
  
      });
  
      if (!response.ok) {
        throw new Error('Failed to post article.');
      }
  
      const newArticle = await response.json();
      setArticles([...articles, newArticle]);
      setMessage('Article posted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to post article. Please try again.');
    } finally {
      setSpinnerOn(false);
    }
  }

  const updateArticle = async ({ articleId, updatedArticleData }) => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    // You got this!
    try {
      const response = await fetch(`${articlesUrl}/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedArticleData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update article.');
      }
  
      const updatedArticle = await response.json();
      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
      setMessage('Article updated successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to update article. Please try again.');
    } finally {
      setSpinnerOn(false);
    }
  }

  const deleteArticle = async articleId => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)

    try {
      const response = await fetch(`${articlesUrl}/${articleId}`, {
        method: 'DELETE',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete article.');
      }
  
      const updatedArticle = await response.json();
      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
      setMessage('Article deleted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete article. Please try again.');
    } finally {
      setSpinnerOn(false);
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
              />
              <Articles 
              articles={articles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
              getArticles={getArticles}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
