/* Global Variables */

//const { response } = require("express");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const baseURL = 'https://api.openweathermap.org/data/2.5/forecast?zip=';
const apiKey = '&appid=c445adb52efc8578ac50039e5a9e07ec&units=metric';

document.getElementById('generate').addEventListener('click', getUserCredentials);

function getUserCredentials(e) {
  const userZip = document.getElementById('zip').value;
  const userfav = document.getElementById('feelings').value;

  getUserTemp(baseURL, userZip, apiKey)
    .then((data) => {
      const day = data.list[0].dt_txt.slice(0, 10); // Remove [e] index since it's not part of the weather data object
      postData('/add', { temp: data.list[0].main.temp, date: day, userRes: userfav });
      console.log(`temp:${data.list[0].main.temp}`);
      console.log(`date:${day}`);
      console.log(`userFeeling:${userfav}`);
      updateUI();
    })
    .catch((error) => {
      console.log('Error fetching weather data:', error);
    });
}

const getUserTemp = async (baseURL, userZip, apiKey) => {
  const res = await fetch(`${baseURL}${userZip}${apiKey}`);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log('Error fetching weather data:', error); // Updated the error message
  }
};

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    //body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json', // Added the content-type header
    },
    body: JSON.stringify(data),
  });
 // return response.json(); // Corrected the return statemen

};

const updateUI = async () => {
  const res = await fetch('/get');
  try {
    const userData = await res.json();
    document.getElementById('temp').innerHTML = `Your Temperature: ${userData.temp} Celsius`;
    document.getElementById('date').innerHTML = `Your Date: ${userData.date}`; // Corrected the variable name "SuserData" to "userData"
    document.getElementById('content').innerHTML = `I feel: ${userData.userRes}`; // Corrected the variable name "StuserData" to "userData"
  } catch (error) {
    console.log('Error updating UI:', error); // Updated the error message
  }
};
