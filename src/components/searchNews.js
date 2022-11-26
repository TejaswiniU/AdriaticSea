import React, { useState, useEffect } from 'react'

function searchNews() {
   /**
   * Search News State
   */
  const [classActive, setClassActive] = useState("");

  /**
   * Please Note, let this state be used as the general state for display news
   * It can be used to fetching and searching news 
   */
  const [newsFeeds, setNewsFeeds] = useState("");
  const [noNewsFeeds, setNoNewsFeeds] = useState("");
    return (
        <div>
             <div className="search-bar-navigation">
        <form onSubmit={handleSubmitForm} className="search-bar-form" method="post">
          <div className="search-term-div">
            <input onChange={handleChangeSearchTerm} id="search-term-id" type="search" placeholder="search news" name="searchTerm" />
            <label onClick={handleSubmitForm} htmlFor="search-term" className="fa fa-search"></label>
          </div>

          <div className={"search-country-div " + classActive}>
            <select id="country-id" name="country">
              {country_options.map((countryOptions) => {
                return country_Preferences.map((countryPreferences) => {
                  return loopCountry(countryOptions, countryPreferences);
                });
              })}
            </select>
          </div>
        </form>
      </div>
      <div className="news-feed-container">
        {newsFeeds && newsFeeds.map((newsFeed) => {
          // console.log(newsFeed);
          return <div key={Math.random()} className="news-feed-box">
            <div className="image-box">
              <img src="https://picsum.photos/1000/800" />
              <div className="news-title">
                <a href={newsFeed.detailednews}>{newsFeed.title}</a>
              </div>
            </div>

            <div className="news-content">
              <div className="news-content-heading">
                <div>
                  <h2>Trend Topic:</h2>
                  <p>{newsFeed.trend}</p>
                </div>
                <div>
                  <h3><i className="fa fa-clock-rotate-left"></i></h3>
                  <p>{newsFeed.posteddatetime}</p>
                </div>
              </div>

              <div className="news-content-description">
                <p>{newsFeed.description}</p>
              </div>

              <div className="news-icons">
                <div><i className="fa fa-save"></i> save</div>
                <div><i className="fa fa-share"></i> share</div>
              </div>

              <div className="news-content-btn">
                <a href={newsFeed.detailednews} target="_blank" className="btn">Read Now</a>
              </div>
            </div>
          </div>;
        })
        } {noNewsFeeds && (<div className='news-feed-box no-record'><h3>No Record For This Search was found</h3></div>)}
      </div>
        </div>
    )
}

export default searchNews
