import React, { useState, useEffect } from 'react'
import './newslist.css'

function Newslist() {
    const [trendNews, setTrendNews] = useState([])
    let newsUrl = "http://127.0.0.1:8000/news/";


    useEffect(() => {
        const getTrendNews = async () => {
            await fetch(newsUrl).then((response) => response.json())
            .then((data) => {
                console.log(data);
                setTrendNews(data)
            });
        }

        getTrendNews()
    }, [])
    return (
        <div>
            {trendNews && trendNews.map((oTrendNew) => {
                return(
                    <div className="news-app">
                        <div className='news-item'>
                            {/* <img className='news-img' src={oTrendNew.image} alt={oTrendNew.image} /> */}
                            <h3><a href={oTrendNew.detailednews}>{oTrendNew.title}</a></h3>
                            <p>{oTrendNew.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Newslist