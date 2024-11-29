import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {

  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  console.log(currentArticleId)

  const navigate = useNavigate()

  const redirectToLogin = () => { 
    navigate('/')
  }
  const redirectToArticles = () => {
    navigate('/articles')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = async ({ username, password }) => {

    setMessage('')
    setSpinnerOn(true)
   
    try {
      const res = await axios.post(loginUrl, {
        username,
        password
      })
      console.log(res)
      // if(!res.ok) {
      //   throw new Error('Login failed')
      // }
      localStorage.setItem('token', res.data.token)
     // setToken(res.data.token)
      console.log(localStorage.getItem('token'))
      setMessage(res.data.message)
      getArticles()
      redirectToArticles()
    } catch(error) {
      console.error(error)
      setMessage('Login failed. Please try again.')
    } finally {
      setSpinnerOn(false)
    }
 }
  const getArticles = async () => {
  
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: `${token}`,
        },
      }); 

      // if (!response.ok) {
      //   if (response.status === 401) {
      //     setMessage('Unauthorized. Please login.');
      //     localStorage.removeItem('token');
      //     setToken(null);
      //     redirectToLogin();
      //   } else {
      //     throw new Error('Failed to fetch articles.');
      //   }
      // }
      console.log(response)
      const data = response.data.articles;
      setArticles(data);
      setMessage(response.data.message);
     
    } catch(error) {
      console.error(error)
      setMessage('Failed to fetch articles. Please try again.')
    } finally {
      setSpinnerOn(false)
    }
  }
 
  // useEffect(() => {
  //   if(token) {
  //     getArticles()
  //   }
  // },[token])

  const postArticle = async article => {
    console.log(article)
    setMessage('')
    setSpinnerOn(true)

    try {
      const response = await axios.post(articlesUrl, article, {
        
        headers: {
          Authorization: `${token}`,
        },
         
  
      });
  
      // if (!response.ok) {
      //   throw new Error('Failed to post article.');
      // }
  
      const newArticle = response.data.article
      setArticles([...articles, newArticle]);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Failed to post article. Please try again.');
    } finally {
      setSpinnerOn(false);
    }
  }

  const updateArticle = async ({ articleId, updatedArticleData }) => {

    setMessage('')
    setSpinnerOn(true)

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
   
    setMessage('')
    setSpinnerOn(true)

    try {
      const response = await fetch(`${articlesUrl}/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
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
          <Route path="/articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={ articles.find(a => a.article_id == currentArticleId)}
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
