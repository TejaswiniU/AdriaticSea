import React from "react";
import { Navigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import CustomLink from "./CustomLink";
import './dashboard.css'
import './newslist.css'

const Dashboard = () => {
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
  const [trendNews, setTrendNews] = useState([])
  let newsUrl = "http://127.0.0.1:8000/news/";
  let navi = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const location = useLocation();
  let authorized = location.state.authorized;
  let user = location.state.userObject;
  // console.log(user);
  // console.log(user.id);
  // console.log("Is new user: " + user.is_new)
  let countriesUrl = "http://127.0.0.1:8000/countries/";
  let categoriesUrl = "http://127.0.0.1:8000/categories/";
  let countriesPreferencesUrl = "http://127.0.0.1:8000/countriespreferences/userId/" + (user.id) + "";
  let categoriesPreferencesUrl = "http://127.0.0.1:8000/categoriespreferences/userId/" + (user.id) + "";
  const [country_options, setCountries] = useState(['']);
  const [category_options, setCategories] = useState([""]);
  const [category_Preferences, setCategoryPreferences] = useState([]);
  const [country_Preferences, setCountryPreferences] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);

  /**
 * Search News Handlers
 */
  const conditionForSetClassActive = () => {
    if (document.getElementById("search-term-id").value == 0) {
      setClassActive("");
    } else {
      setClassActive("active");
    }
  }

  useEffect(() => {

    conditionForSetClassActive();

    const getData = async() => {
        await fetch(countriesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCountries(data)
          });

        await fetch(categoriesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCategories(data)
          });
        await fetch(countriesPreferencesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCountryPreferences(data)
          });
        await fetch(categoriesPreferencesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCategoryPreferences(data)
          });
          await fetch(newsUrl).then((response) => response.json())
          .then((data) => {
              console.log(data);
              setTrendNews(data)
          });
    }

    getData();
  },

    []);

  const handlepreferencesClick = (userId) => {
    var x = document.getElementById("editPrev");
    x.hidden = false
    setShowPreferences(true);
  };

  function handleuseractivityClick() {
    navi('/useractivity',
      {
          state:{
              authorized:true,
              userObject:user
          }
      }
      );
  };
  
  function handledeletectrypreferenceClick(countryPreferenceId) {
    let countriespreferencesUrl = "http://127.0.0.1:8000/countriespreferences/" + countryPreferenceId.toString();
    const cpRequestOptions = {
      method: 'DELETE'
    };
    fetch(countriespreferencesUrl, cpRequestOptions)
      .catch(error => console.log("Error:", error))
      .then(response => {
        console.log("Success:", response)
      });
  };

  function handledeletectgrypreferenceClick(categoryPreferenceId) {
    let categoriespreferencesUrl = "http://127.0.0.1:8000/categoriespreferences/" + categoryPreferenceId.toString();
    const cpRequestOptions = {
      method: 'DELETE'
    };
    fetch(categoriespreferencesUrl, cpRequestOptions)
      .catch(error => console.log("Error:", error))
      .then(response => {
        console.log("Success:", response)
      });
  };

  function handleaddpreferenceClick() {
    navi('/questions',
      {
        state: {
          authorized: true,
          userObject: user
        }
      }
    );
  };

  function hideDiv() {
    var x = document.getElementById("editPrev");
    x.hidden = true
  }

  function handleUpdateNewsDBClick() {
    let newsUrl = "http://127.0.0.1:8000/news/";
    let tmp_new = { 'country': "", 'trend': "", 'title': "", 'image': "", 'posted': "", 'posteddatetime': "", 'detailednews': "", 'description': "" }
    console.log(tmp_new);
    const newsRequestOptions = {
      method: 'PUT'
    };
    fetch(newsUrl, newsRequestOptions)
      .catch(error => console.log("Error:", error))
      .then(response => {
        console.log("Success:", response)
      });
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();

    const newsFormData = {
    };

    newsFormData.searchTerm = document.getElementById("search-term-id").value;

    newsFormData.country = document.getElementById("country-id").value;

    fetch(`http://localhost:8000/search/${newsFormData.searchTerm}/${newsFormData.country}`, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data) {
          setNoNewsFeeds("");
          setNewsFeeds(data);
        } else {
          setNoNewsFeeds({
            class: "classActive",
          });
          setNewsFeeds("");
        }
      });

    document.getElementById("search-term-id").value = "";

    conditionForSetClassActive();
  }

  const handleChangeSearchTerm = () => {
    conditionForSetClassActive();
  }

  const loopCountry = (countryOptions, countryPreferences) => {
    if (countryPreferences.countryname == countryOptions.countryName) {
      return <option key={countryOptions.id} value={countryOptions.id}>{countryOptions.countryName}</option>;
    }
  }


  return (
    <div>
      <nav className="nav">
        <Link to="/" className="site-title">
          Adriatic Sea
        </Link>
        {category_options &&
          category_options.map((categoryOption) => (
            <ul key={categoryOption.id}>
              <CustomLink to="/dashboard">
                {categoryOption.name}
              </CustomLink>
            </ul>
          ))}
      </nav>

      <div id="editPrev">
        {showPreferences ?
          <React.Fragment>
            <div>
              {/* <button class="editpref" onClick={() => handleaddpreferenceClick()}>Add Preferences</button> */}
              <span class="close1" onClick={() => hideDiv()}>+</span>
            </div>
            <div>
              <table border="1px">
                <tr>
                  <th>User</th>
                  <th>Country ID</th>
                  <th>Country Name</th>
                  <th>Eliminar</th>
                </tr>
                {country_Preferences &&
                  country_Preferences.map((countryPreference) => (
                    <tr key={countryPreference.id}>
                      <td>
                        {countryPreference.user.firstname} {countryPreference.user.lastname}
                      </td>
                      <td>
                        {countryPreference.country.id}
                      </td>
                      <td>
                        {countryPreference.country.countryName}
                      </td>
                      <td><button onClick={() => handledeletectrypreferenceClick(countryPreference.id)}>Eliminar</button></td>
                    </tr>
                  ))}
              </table>
            </div>
            <div className="gap"></div>
            <div>
              <table border="1px">
                <tr>
                  <th>User</th>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Eliminar</th>
                </tr>
                {category_Preferences &&
                  category_Preferences.map((categoryPreference) => (
                    <tr key={categoryPreference.id}>
                      <td>
                        {categoryPreference.user.firstname} {categoryPreference.user.lastname}
                      </td>
                      <td>
                        {categoryPreference.category.id}
                      </td>
                      <td>
                        {categoryPreference.category.name}
                      </td>
                      <td><button onClick={() => handledeletectgrypreferenceClick(categoryPreference.id)}>Eliminar</button></td>
                    </tr>
                  ))}
              </table>
            </div>
          </React.Fragment>
          : ('')}

      </div>
      <div className="side-bar-navigation">
        <img src={user.profilePicture} />
        <h3>{user.firstname} {user.lastname}</h3>
        {
          Object.keys(user).length !== 0 &&
          <button onClick={(e) => navi('/login')}> sign out</button>
        }
        {user.is_new &&
          navi('/questions',
            {
              state: {
                authorized: true,
                userObject: user
              }
            }
          )}

        {
          <div>
            {/* <button onClick={()=> handlepreferencesClick(user.id)}>Edit Preferences</button> */}
            <button onClick={(e) => handleaddpreferenceClick()}>Add Preferences</button>
            <button onClick={() => handlepreferencesClick(user.id)}>Edit Preferences</button>
            {/* <button onClick={() => handleUpdateNewsDBClick()}>Update News to DB</button> */}
            <button onClick={() => navi('/newslist')}>View latest news</button>
            <button onClick={() => handleuseractivityClick()}>View User Activity</button>
          </div>
        }
      </div>

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
  );

}



export default Dashboard;