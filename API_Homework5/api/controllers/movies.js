/**
 * Created by Smegs8 on 4/8/17.
 */
'use strict';

var _ = require('lodash');
var usergrid = require('usergrid');
var apigee = require('apigee-access');

var UsergridClient = require('../../node_modules/usergrid/lib/client');
var Usergrid = new UsergridClient({
    "appId": "sandbox",
    "orgId": "drews122002",
    "authMode": "NONE",
    "baseUrl": "https://apibaas-trial.apigee.net",
    "URI": "https://apibaas-trial.apigee.net",
    "clientId": "b3U61iNCqBvyEeeiwhIuBzeXfQ",
    "clientSecret": "b3U6PbtDfQfxzTAFvVdNoQBRqSjlgz8"
});
module.exports = {

    getMovies: getMovies,
    createMovie: createMovie,
    returnMovie: returnMovie,
    movieUpdate: movieUpdate,
    movieDelete: movieDelete

};

function getMovies (req,res){

    Usergrid.GET('movies', function(err, response, movie) {

        if(err){
            res.json({error: err});
        }
        else {
            console.log(response.entities);
            res.json({
                movies: response.entities
            }).end();
        }
    })
}
function createMovie (req,res){

    var movies = req.swagger.params.movie.value;
    _.assign(movies,{type: 'movies'});

    var title = req.swagger.params.movie.value.name;
    Usergrid.GET('movies', title, function(error, usergridResponse){
        if (error){


    if(_.isUndefined(movies.actors) || _.isUndefined(movies.name) || _.isUndefined(movies.year))
         {

        res.json({
            Error: "Is something missing?! Perhaps actors, title, or year"
        });
    }
    else
        Usergrid.POST(movies, function (err, response, movie) {
            if (err) {
                res.json({message: err});
            }
            else {
                movie.save(Usergrid, function (err) {

                    if (err) {
                        res.status(500).json(err).end();
                    }
                    else res.json({
                        message: 'successful movie creation',
                        movie: response
                    }).end();

                });
            }
        })
        }
        else {
            res.json({
                message: "Movie title already exists"
            });
        }
    });


        }
function returnMovie (req,res){

    var uuid = req.swagger.params.movieId.value;
    Usergrid.GET('movies',uuid, function(error, usergridResponse) {

        if (error){
            res.json({error: error});
        }
        else res.json({
            movie: usergridResponse
        }).end();
    })
}
function movieUpdate(req,res){

    var uuid = req.swagger.params.movieId.value;

    Usergrid.GET('movies', uuid, function(error, usergridResponse, movie) {

        _.assign(movie, req.swagger.params.movie.value.movie);
        _.assign(movie, {type: 'movie'});

        Usergrid.PUT(movie, function (err, response, newMovie) {
            if(err){
                res.json({
                    error: err
                });
            }
            else newMovie.save(Usergrid, function (err) {
                if (err) {
                    res.status(500).json(err).end();
                }
                res.json({
                    message: 'movie has been updated',
                    movie: response
                }).end();
            });
        });
    })
}
function movieDelete(req,res){

    var uuid = req.swagger.params.movieId.value;
    Usergrid.DELETE('movies',uuid, function(error, usergridResponse) {

        if (error) {
            res.json({error: error});
        }
        else res.json({
            message: 'movie has been deleted',
            movie: usergridResponse
        }).end();
    })
}