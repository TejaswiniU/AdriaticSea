import React from "react";
import {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import './login.css'
import {useNavigate} from 'react-router-dom';
import gif from "../../src/images/gif.gif";


function Login(){
    let history = useNavigate();
    const [user, setUser] = useState({});
    async function handleCallbackResponse(response){
      var userObject = jwt_decode(response.credential);
      console.log(userObject)
      if(userObject.email_verified === true){
        setUser(userObject);
        document.getElementById("signInDiv").hidden = true;
        document.getElementById("signInDiv").style = "none";
        document.getElementById("ad_sea_logo").hidden = true;
        let userUrl = "http://127.0.0.1:8000/users/";
        let useractivityUrl =  "http://127.0.0.1:8000/useractivity/";
        //fetch()//put call =>(pass user data sa json(like fname,picture))
        let temp_data = {'firstname':userObject.given_name,'lastname':userObject.family_name,'emailId':userObject.email,'profilePicture':userObject.picture}
        let activitydetail={'activityname':'','lastlogin':'','user_id':''}
        await fetch(userUrl,{
          method:'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(temp_data)
        }).then(response =>  response.json().then(data => ({status: response.status, body: data})))
        .then((data) => {
          temp_data.id = data.body.id;
          console.log("status of request : "+data.status)
          if(data.status == "400"){
            temp_data.is_new = false
          }
          else{
            temp_data.is_new = true
          }
          console.log("entro al response")
          console.log(temp_data);
          activitydetail.activityname="login"
          activitydetail.user_id=temp_data.id
          activitydetail.lastlogin= new Date().toISOString().slice(0, 19).replace('T', ' ')
          console.log(activitydetail)
        });
        useractivityUrl=useractivityUrl+activitydetail.user_id
        await fetch(useractivityUrl,{
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

        history('/dashboard',
        {
            state:{
                authorized:true,
                userObject:temp_data
            }
        }
        );
      }
      else{
        console.log("paso 3")
        document.getElementById("message").innerHTML = "Please verify your Gmail before sign-in"
        signOut();
    }
    }
    function signOut(event){
      console.log("signout is called");
      setUser({});
      document.getElementById("signInDiv").hidden = false;
      document.getElementById("signInDiv").style.display = 'flex';
      document.getElementById("signInDiv").style.justifyContent = 'center';
      document.getElementById("ad_sea_logo").hidden = false;
    }
    useEffect(()=>{
      const google=window.google
      google.accounts.id.initialize({
        client_id:'219340936401-l08f78q7eto8v84k3bume78rfadsj7sh.apps.googleusercontent.com',
        callback:handleCallbackResponse
      });
      google.accounts.id.renderButton(
        document.getElementById('signInDiv'),{theme:'outline',size:'large',position: 'absolute',
        top: '50%',
        left: '50%',
        margin_top: '-50px',
        margin_left: '-50px',
        width: '100px',
        height: '100px'}
      );
      google.accounts.id.prompt();
    },[]);
    return(
        <div className="App">
     <div className="App" style={{ backgroundImage:`url(${gif})`,backgroundRepeat:"no-repeat",backgroundSize: 'cover'}}>
     <img id='ad_sea_logo' src={require(`../ad1.png`)} alt="Adriatic Sea Logo"/>
      <div id='signInDiv' style={{
        display: 'flex',
        justifyContent: 'center'
      }}
      >
      </div>
      </div>
      <h3 id="message"> </h3>
      {
        Object.keys(user).length !== 0 &&
        <button onClick={(e)=> signOut(e)}> sign out</button> 
      }
      
       { user &&
        <div>
            <img src={user.picture}></img>
            <h3>{user.name}</h3>
          </div>

       }
    </div>
    );
}
export default Login;