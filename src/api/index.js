import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function fetchTasks() {

  // let myFirstPromise = new Promise((resolve, reject) => {
  //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
  //   // In this example, we use setTimeout(...) to simulate async code. 
  //   // In reality, you will probably be using something like XHR or an HTML5 API.
  //   setTimeout( function() {
  //     resolve(
  //       [{
  //         "id": 2,
  //         "title": "Peace on Earth",
  //         "description": "No big deal.",
  //         "status": "Unstarted",
  //         //"filter": "",
  //         "timer": 0 
  //         }])  // Yay! Everything went well!
  //   }, 250) 
  // }) 
  // return  myFirstPromise.then((tasks) => tasks);
  return client.get('/tasks');
}

export function createTask(params) {
  return client.post('/tasks', { ...params, timer: 0 });
}

export function editTask(id, params) {
  return client.put(`/tasks/${id}`, params);
}
