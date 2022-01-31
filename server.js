require(`dotenv`).config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const moviesData = require('./movie.data/data.json');


app.get('/',movies);
app.get('/favorite',fav);
app.get(`/trending`,trend);
app.get(`/search`,sear);
app.get('*',notfound)


function Movie(title,poster_path,overview){
    this.title = title;
 
    this.poster_path = poster_path;
    this.overview = overview;
  
}

function Page(id,title,release_date,poster_path,overview){

this.id=id;
this.title=title
this.release_date=release_date;
this.poster_path = poster_path;
this.overview = overview;
}
function movies(req,res){
    let moviess =[];
   let movie = new Movie ( moviesData.title,moviesData.poster_path,moviesData.overview);
      moviess.push(movie)
    
   
    return res.status(200).json(moviess)
}


function fav(req,res){
    return res.status(200).send('Welcome to Favorite Page')
}
let numberofMovies=6;
let userSearch="The House"
let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
let searchUrl=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&number${numberofMovies}&query=${userSearch}&page=2`

function trend (req,res){
   
    axios.get(trendingUrl)
     .then((url)=>{
         let result =url.data.results.map(page=>{
             return   new Page (page.id,page.title,page.release_date,page.poster_path,page.overview);
         })
         res.status(200).json(result);
    }).catch((err)=>{

    })
}
function sear(req,res){
axios.get(searchUrl)
.then((searUrl)=>{
let result1=searUrl.data.results.map(page=>{
return new Page (page.id,page.title,page.release_date,page.poster_path,page.overview);

})
res.status(200).json(result1);
}).catch((err)=>{

})

}







function notfound(req,res){
    return res.status(404).send('sorry, I cant help you')
}

app.listen(3000, ()=>{

    console.log('listening to port 3000')
})