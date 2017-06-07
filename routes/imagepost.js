var express       = require('express');
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var User          = models.user;
var Imagepost     = models.imagepost;
var uploadHandler = multer({dest: 'public/images/imageposts'});
var router        = express.Router();

//Get All the Posts from DB

router.get('/', function(req, res) {
	Imagepost.findAll().then(function(result) {
		console.log("Why am I stuck here");
		res.render('imagepost/index', {
			imageposts: result
		});
	});
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

// Create.
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
		.withoutEnlargement()
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


//Comments.
// router.post('/comments', function(request, response) {
// 	Imagepost(Imagepost).then(function(post) {
// 		Imagepost.createComment({
// 			body:   request.body.body,
// 			author: request.body.author
// 		}).then(function(comment) {
// 			response.redirect(post.url);
// 		}).catch(function(error) {
// 			response.render('/', {
// 				imagepost:    imagepost,
// 				comment: request.body,
// 				errors:  error.errors
// 			});
// 		});
// 	});
// });

module.exports = router;
