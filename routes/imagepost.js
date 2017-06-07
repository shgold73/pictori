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
	Imagepost.findAll({
		include:[Comment]
	}).then(function(result) {
		console.log("Ok..now look for comments");
			res.render('imagepost/index', {
			imageposts: result
			})
			//console.log(JSON.stringify(result))
		});
	});

//Route to New Imagepost
router.get('/new', function(req, res, next) {
  res.render('imagepost/new', { title: 'Pictori' });
});

// Create New Image Post
router.post('/', uploadHandler.single('image'), function(request, response) {
	Imagepost.create({
		title:         request.body.title,
		body:          request.body.body,
		
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
		console.log("Pass");
	}).catch(function(error) {
		console.log("Fail");
			// response.render('../index', {
			// 	imagepost:    imagepost,
			// 	comment: request.body,
			// 	errors:  error.errors
			//});	
		});
	} else {
		response.redirect('/user/log-in');
	}
 });



module.exports = router;
