`use strict`;

require(`dotenv`).config();
const express = require('express');

const cors = require('cors');
const axios = require('axios');
const app = express();
const pg = require('pg');
app.use(cors());
app.use(cors());
app.use(express.json());

const client = new pg.Client(process.env.DATABASE_URL);
const moviesData = require('./movie.data/data.json');


app.get('/',movies);
app.get('/favorite',fav);
app.get(`/trending`,trend);
app.get(`/search`,sear);
app.post(`/addMovie`,addMovie);
app.get(`/getMovies`,getMovies);
app.get(`/review`,review);
app.get(`/credits`,credits);
app.put(`/ubdate/:id`,ubdateMovie)
app.get(`/getMovie/:id`,getMovieId)
app.delete(`/deleteMovie/:id`,deleteMovie)
app.get('*',notfound);
app.use(errorHandler);



function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
  
}


function Review(title,vote_average,vote_count){
    this.title = title;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
  
}

function Page(id,title,release_date,poster_path,overview){

this.id=id;
this.title=title
this.release_date=release_date;
this.poster_path = poster_path;
this.overview = overview;
}

function Credits(title,backdrop_path,original_language,release_date){
    this.title = title;
    this.backdrop_path = backdrop_path;
    this.original_language = original_language;
 this.release_date=release_date; 
}
function movies(req,res){
    let moviess =[];
   let movie = new Movie ( moviesData.title,moviesData.poster_path,moviesData.overview);
      moviess.push(movie)
    
   
    return res.status(200).json(moviess)
}

function review(req,res){
   axios.get(trendingUrl)
   .then((url)=>{
       let result =url.data.results.map(page=>{
           return   new Review (page.title,page.vote_average,page.vote_count);
       })
       res.status(200).json(result);
  }).catch((error)=>{
      errorHandler (error,req,res)
  })
    
   
    
}
function credits(req,res){
    axios.get(trendingUrl)
    .then((url)=>{
        let result =url.data.results.map(page=>{
            return   new Credits (page.title,page.backdrop_path,page.original_language,page.release_date);
        })
        res.status(200).json(result);
   }).catch((error)=>{
       errorHandler (error,req,res)
   })
     
    
     
 }


function fav(req,res){
    return res.status(200).send('Welcome to Favorite Page')
}


let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`

function trend (req,res){
   
    axios.get(trendingUrl)
     .then((url)=>{
         let result =url.data.results.map(page=>{
             return   new Page (page.id,page.title,page.release_date,page.poster_path,page.overview);
         })
         res.status(200).json(result);
    }).catch((error)=>{
        errorHandler (error,req,res)
    })
}

function getMovies(req,res){
    let sql = `SELECT * FROM newMovie;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function sear(req,res){
    let numberofMovies=6;
    let userSearch = "the house"
    let searchUrl=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&number${numberofMovies}&query=${userSearch}&page=2`

axios.get(searchUrl)
.then((searUrl)=>{
let result1=searUrl.data.results.map(page=>{
return new Page (page.id,page.title,page.release_date,page.poster_path,page.overview);

})

res.status(200).json(result1);
}).catch((error)=>{
    errorHandler (error,req,res)
})

}

function addMovie(req,res){
    const movie = req.body;
  console.log(movie);
    let sql = `INSERT INTO newMovie(title,poster_path,overview,comment) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values=[movie.title,movie.poster_path,movie.overview,movie.comment];
    client.query(sql,values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
  }

  function getMovieId(req,res){
const id = req.params.id
    let sql = `SELECT * FROM newMovie WHERE id=${id};`
   
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}

  function ubdateMovie(req,res){
    const id = req.params.id;
    const movie = req.body;
  console.log(movie);
    let sql = `UPDATE newMovie SET title = $1, poster_path = $2, overview = $3,comment=$4  WHERE id=$5 RETURNING *;`

    let values=[movie.title,movie.poster_path,movie.overview,movie.comment,id];
    client.query(sql,values).then(data =>{
        res.status(200).json(data.values);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
  }

  function deleteMovie(req,res){
    const id = req.params.id;
    const sql = `DELETE FROM newMovie WHERE id=${id};` 
  
    client.query(sql).then(()=>{
        res.status(204).json({});
     
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}



function notfound(req,res){
    return res.status(404).send('sorry, I cant help you')
}



function errorHandler (error,req,res){
    const err = {
         status : 500,
         messgae : error
     }
     res.status(500).send(err);
 }






client.connect().then(()=>{
   app.listen(3000,()=>{
        console.log(`listining to port =3000`)
    })
})
