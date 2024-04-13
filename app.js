const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbpath = path.join(__dirname, 'moviesData.db')
let db = null
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
intializeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getAllMoviesNameQuery = `SELECT movie_name FROM movie;`
  const movies = await db.all(getAllMoviesNameQuery)
  response.send(movies.map(eachMovie => ({movieName: eachMovie.movie_name})))
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const movieInsertQuery = `
  INSERT INTO movie(directorId, movieName, leadActor)
  VALUES (${directorId}, ${movieName}, ${leadActor});`
  await db.run(movieInsertQuery)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
  SELECT * FROM movie
  WHERE movie_id = ${movieId};`
  const movie = await db.get(getMovieQuery)
  response.send(movie)
})

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const {directorId, movieName, leadActor} = request.body
  const updateMovieQuery = `
  UPDATE movie 
  SET 
     director_id = ${directorId},
     movie_name = ${movieName},
     lead_actor = ${leadActor}
  WHERE movie_id = ${movieId};`
  await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteQuery = `
  DELETE FROM movie 
  WHERE movie_id = ${movieId};`
  await db.run(deleteQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const {directorId} = request.params
  const getDirectorsQuery = `SELECT * FROM director;`
  const directors = await db.all(getDirectorsQuery)
  response.send(
    directors.map(eachDirector => ({
      directorId: eachDirector.director_id,
      directorName: eachDirector.director_name,
    })),
  )
})


app.get('/directors/:directorId/movies/', async (request,response) => [
  const directorId = request.param;
  const getDirectorMovieQuery = `SELECT * FROM movie WHERE director_id = ${directorId};`;
  const movieArray = await db.all(getDirectorMovieQuery);
  response.send(movieArray.map((eachMovie) => ({movieName: eachMovie.movie_name})))
])

module.exports = app;
