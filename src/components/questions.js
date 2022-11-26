import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

function Questions() {
	let navi = useNavigate();
	const location = useLocation();
    let user = location.state.userObject;
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
	let countriesUrl = "http://127.0.0.1:8000/countriespreferences/Remaining/"+(user.id)+"";
    let categoriesUrl = "http://127.0.0.1:8000/categoriespreferences/Remaining/"+(user.id)+"";

	useEffect(() => {
        const getData = async () => {
          await fetch(countriesUrl).then((response) => response.json())
          .then((data) => {
            setCountries(data)
          });
          await fetch(categoriesUrl).then((response) => response.json())
          .then((data) => {
            setCategories(data)
          });
        };
        getData();
      }, []);

	const questions = [
		{
			questionText: 'What country news interests you?',
		},
		{
			questionText: 'What category news interests you?',
		},
	];

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showCountries, setShowCountries] = useState(true);
	const [selectedCountry, setSelectedCountry] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState(0);

	const handleCategoriesClick = (idCategory) => {
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) 
		{
			setCurrentQuestion(nextQuestion);
		} 
		setSelectedCategory(idCategory);
		user.is_new = false
		let useractivityUrl= "http://127.0.0.1:8000/useractivity/";
        let activitydetail={'activityname':'','lastlogin':'','user_id':''}
		activitydetail.activityname="Change in country preferences"
        activitydetail.user_id= user.id
		
		useractivityUrl=useractivityUrl+activitydetail.user_id
		console.log(useractivityUrl)
		user.is_new = false
		let countriespreferencesUrl = "http://127.0.0.1:8000/countriespreferences/";
		let tmp_ctrypreference = {'user': user.id,'country': selectedCountry}
		console.log(tmp_ctrypreference);
		const cpRequestOptions = {
			method:'PUT',
			headers: { 
				'Accept': 'application/json',
			  	'Content-Type': 'application/json'
			},
			body: JSON.stringify(tmp_ctrypreference)
		};
        fetch(countriespreferencesUrl,cpRequestOptions)
		.catch(error => console.log("Error:", error))
		.then(result => result.text())
		.then((data) => {console.log(data)
			activitydetail.lastlogin= new Date().toISOString().slice(0, 19).replace('T', ' ')
			fetch(useractivityUrl,{
				method:'PUT',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body:JSON.stringify(activitydetail)
			  }).then(response =>  response.json().then(data => ({status: response.status, body: data})))
			  .then((data) => {
				console.log("status of request : "+data.status)
			  });
		});
		
		let categoriespreferencesUrl = "http://127.0.0.1:8000/categoriespreferences/";
		let tmp_ctgrypreference = {'user': user.id,'category': idCategory}
		console.log(tmp_ctgrypreference);
		const capRequestOptions = {
			method:'PUT',
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(tmp_ctgrypreference)
		}; 
		fetch(categoriespreferencesUrl,capRequestOptions)
		.catch(error => console.log("Error:", error))
		.then(result => result.text())
		.then((data) => {console.log(data)
			activitydetail.lastlogin= new Date().toISOString().slice(0, 19).replace('T', ' ')
		fetch(useractivityUrl,{
			method:'PUT',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body:JSON.stringify(activitydetail)
		  }).then(response =>  response.json().then(data => ({status: response.status, body: data})))
		  .then((data) => {
			console.log("status of request : "+data.status)
		  });
		});
	};

	const handleCountriesClick = (idCountry) => {
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} 
		setShowCountries(false);
		setSelectedCountry(idCountry);
		user.is_new = false
	};

	return (
		<div id='questionsdiv'>
		<div className='preferencesquestion'>
			<div>
				<span class="close" onClick={(e)=> 
				navi('/dashboard',{
            state:{
                authorized:true,
                userObject:user
            }
        }) }>+</span>
			</div>
			<div className='question-section'>
				<div className='question-count'>
					<span>Question {currentQuestion + 1}</span>/{questions.length}
				</div>
				<div className='question-text'>{questions[currentQuestion].questionText}</div>
			</div>
			{showCountries ? (
			<div className='answer-section' id='ansSecCtry'>
				{countries &&
				countries.map((countryOption) => (
					<button id={countryOption.id} onClick={() => handleCountriesClick(countryOption.id)}>{countryOption.countryName}</button>
				))}
			</div>
			) :
			(<div className='answer-section' id='ansSecCtg'>
				{categories &&
				categories.map((categoryOption) => (
					<button id={categoryOption.id} onClick={() => handleCategoriesClick(categoryOption.id)}>{categoryOption.name}</button>
				))}
			</div>)}
		</div>
		</div>
	);
}
export default Questions;