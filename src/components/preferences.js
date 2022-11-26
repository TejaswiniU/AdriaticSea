import React from "react";
import {Navigate} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {Multiselect} from 'multiselect-react-dropdown'

function Preferences(){
   
    let countriesUrl = "http://127.0.0.1:8000/countries/";
    let categoriesUrl = "http://127.0.0.1:8000/categories/";

    const [options, setOptions] = useState([""]);
    const [category_options, setCategories] = useState([""]);

    useEffect(() => {
        const getData = async () => {
          await fetch(countriesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setOptions(data)
          });
          await fetch(categoriesUrl).then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCategories(data)
          });
        };
        getData();
      }, []);

    return (
        <div>
            <h1 style={{
                display: 'flex',
                justifyContent: 'center'
            }} >Preferences Configuration</h1> 
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <h3 style={{color:"blue",justifycontent:"center"}}>Choose locations</h3>
              <Multiselect 
              options={options} 
              displayValue="countryName" 
              selectionLimit={4} 
              onSelect={(event)=>{}}
              />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
              <h3 style={{color:"blue"}}>Choose Categories</h3>
              <Multiselect 
              options={category_options} 
              displayValue="name" 
              selectionLimit={4}/>
            </div>
        </div>
    );
}
export default Preferences;