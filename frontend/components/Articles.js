import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles(
  
   { articles,
    getArticles,
    deleteArticle,
    setCurrentArticleId,
    currentArticleId,
    // token
  }) {
  // ✨ where are my props? Destructure them here

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)
 
   if(!localStorage.getItem('token')){
      const navigate = useNavigate()
      navigate('/')
    }
  
  useEffect(() => {
    // ✨ grab the articles here, on first render only
    getArticles()
  },[])

  if(!articles.length) {
    return <p>No articles yet</p>
  }

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        articles.map((article) => (
          <div className="article" key={article.id}>
            <div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
              <p>Topic: {article.topic}</p>
            </div>
            <div>
              <button
                onClick={() => setCurrentArticleId(article.article_id)}
                //disabled={!currentArticleId}
                
              >
                Edit
              </button>
              <button onClick={() => deleteArticle(article.id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
