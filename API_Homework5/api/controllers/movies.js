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
    'appName' : 'movies',
    "clientId": "b3U61iNCqBvyEeeiwhIuBzeXfQ",
    "clientSecret": "b3U6PbtDfQfxzTAFvVdNoQBRqSjlgz8"
});
module.exports = {

    getMovies: getMovies,
    createMovie: createMovie,
    returnMovie: returnMovie,
    movieUpdate: movieUpdate,
    movieDelete: movieDelete,
    getOne: getOne,
    addReview: addReview,
    deleteReview: deleteReview

};
function addReview (req,res){
    var review = req.swagger.params.review.value;
    _.assign(review, {type: 'review'});
    Usergrid.GET("movies", req.swagger.params.id.value, function(error, usergridResponse, movie) {
        if (!error){
            var movietitle = movie.name;
            //give movie name to review, only if movie exists already
            _.assign(review, {movie: movietitle});
            if(_.isUndefined(review.movie))
                res.json({ Error: "movie undefined."});
            else if(_.isUndefined(review.score))
                res.json({ Error: "movie score undefined." });
            else if(_.isUndefined(review.review))
                res.json({ Error: "movie review text undefined." });

            else Usergrid.POST(review, function (err, response, review) {
                    if (err) {
                        res.json({message: err});
                    }
                    else {
                        review.save(Usergrid, function (err) {

                            if (err) {
                                res.status(500).json(err).end();
                            }
                            else res.json({
                                message: 'Review add successful',
                                review: review
                            }).end();
                        });
                    }
                })
        }
        else
            res.json({message: "Cannot add review. Movie does not exist.",
                error: error});
    });
}
function getOne(req,res) {

    var uuid = req.swagger.params.id.value;
    var reviews = req.swagger.params.reviews.value;
    Usergrid.GET("movies", uuid, function (error, usergridResponse, movie) {
        if (error) {
            res.json({error: error});
        }
        else if (!reviews) {
            res.json({
                movie: usergridResponse
            }).end();
        }
        else {
            var options = {
                path: "reviews",

                ql: "movie = '" + movie.name + "'"
            };
            Usergrid.GET(options, function (error, usergridResponse2) {
                res.json({
                    movie: usergridResponse,
                    reviews: usergridResponse2.entities
                }).end();
            })
        }
    })
}

function getMovies (req,res) {

    Usergrid.GET('movies', function (err, response, movie) {

        if (err) {
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
    function deleteReview(req,res){

        var uuid = req.swagger.params.id.value;
        Usergrid.DELETE('reviews',uuid, function(error, usergridResponse) {
            if (error) {
                res.json({error: error});
            }
            else res.json({
                message: 'Review removed',
                movie: usergridResponse
            }).end();
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