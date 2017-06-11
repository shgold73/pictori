var express       = require('express');
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var User          = models.user;
var Imagepost     = models.imagepost;
var Comment       = models.comment;
var uploadHandler = multer({dest: 'public/images/imageposts'});
var router        = express.Router();

//Get All the Posts from DB
router.get('/', function(req, res) {
	if(req.user){
		Imagepost.findAll({
			include:[User,Comment]
		}).then(function(result) {
			console.log("Ok..now look for comments");
			res.render('imagepost/index', {
			imageposts: result
			})
				//console.log(JSON.stringify(result))
		});
	}
	else{
		res.redirect('/user/log-in');
	}
});


// New.
router.get('/new', function(request, response) {
	if (request.user)
		response.render('imagepost/new', {
			imagepost: {}
		});
	else
		response.redirect('/user/log-in');
});

// Create New Image Post
router.post('/', uploadHandler.single('image'), function(request, response) {
	Imagepost.create({
		title:         request.body.title,
		body:          request.body.body,
		userId:        request.user.id,
		imageFilename: (request.file && request.file.filename)
	}).then(function(imagepost) {
		console.log("inPICloop");
		sharp(request.file.path)
		.resize(490,490)
		
		.toFile(`${request.file.path}-thumbnail`, function() {
			response.redirect('/imagepost');
		});
	}).catch(function(error) {
		response.render('imagepost/new', {
			imagepost:   request.body,
			errors: error.errors
		});
	});
});

//Create Comment to Imagepost
router.post('/comments', function(request, response) {
    if(request.user){
	Comment.create({
		body:   request.body.body,
		imagepostId: request.body.imagepostid,
		author:request.user.firstname
		//author: {currentUser.firstname + ' '+ currentUser.lastname}
	}).then(function(comment) {
		response.redirect('/imagepost');
	}).catch(function(error) {
		});
	} else {
		response.redirect('/user/log-in');
	}
 });

module.exports = router;
