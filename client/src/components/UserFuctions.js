 
import axios from 'axios'

// const base_url=process.env.base_url || 'http://localhost:5005' || ""
const base_url= process.env.NODE_ENV ==="production" ? process.env.base_url :"http://localhost:5005"

export const logUserOut = token =>{
  setTimeout(()=> localStorage.removeItem('usertoken'), 3600000*212)//212H
}

export const register = (newUser) => {
  console.log('reg called')

    return axios
      .post(base_url+'/users/register', {
        fn: newUser.fn,
        ln: newUser.ln,
        email: newUser.email,
        pwd: newUser.pwd
      })
      .then(response => {
        console.log(response.data)
        return response.data
      })
      .catch(err=>{
        return {'status':'fail'}
      })
  }

export const login = user => {
  console.log('login called')
    return axios
      .post(base_url+'/users/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        localStorage.setItem('usertoken', response.data.token)
        logUserOut()
        return response.data
      })
      .catch(err => {
        console.log(err)
        return {'status':'fail'}
      })
  }

