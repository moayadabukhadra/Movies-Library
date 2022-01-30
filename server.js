const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const moviesData = require('./movie.data/data.json');

app.get('/',movies);
app.get('/favorite',fav);
app.get('*',notfound)

function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
  
}

function movies(req,res){
    let moviess =[];
   let movie = new Movie ( moviesData.title,moviesData.poster_path,moviesData.overview);
      moviess.push(movie)
    
   
    return res.status(200).json(moviess)
}
app.listen(3000, ()=>{

    console.log('listening to port 3000')
})

function fav(req,res){
    return res.status(200).send('Welcome to Favorite Page')
}

function notfound(req,res){
    return res.status(404).send('sorry, I cant help you')
}

