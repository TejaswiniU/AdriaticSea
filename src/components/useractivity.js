import React from "react";
import {useState,useEffect} from 'react';
import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';


function UserActivity() {
	let navi = useNavigate();
	const location = useLocation();
    let user = location.state.userObject;
    let useractivityUrl = "http://127.0.0.1:8000/useractivity/"+(user.id)+"";
    const [user_activity, setUserActivityHistory] = useState([]);
    useEffect(() => {
        const getData = async () => {
          await fetch(useractivityUrl).then((response) => response.json())
          .then((data) => {
            setUserActivityHistory(data)
          });
        };
        getData();
      }, []);
      
    return (
		<div id='useractivity'>
            <span class="close" onClick={(e)=> 
				navi('/dashboard',{
            state:{
                authorized:true,
                userObject:user
            }
        }) }>+</span>
            <div id="activitytable">
          <table border="1px">
          <tr>
                <th>Activity</th>
                <th>Time</th>
         </tr>
         {user_activity &&
          user_activity.map((userActivity) => (
            <tr key={userActivity.user_id}>
            <td>
            {userActivity.activityname} 
            </td>
            <td>
            {userActivity.lastlogin}
            </td>
            </tr>
          ))}
         </table>
         </div>
        </div>
    );

    }
export default UserActivity;