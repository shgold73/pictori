var express       = require('express');
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var User          = models.user;
var Imagepost     = models.imagepost;
var Comment       = models.comment;
var Tag 		  = models.tag;
var uploadHandler = multer();
var aws           = require('aws-sdk');
var s3 = new aws.S3({region:'us-east-2'});
var router        = express.Router();

//S3 Stuff


//Get All the Imageposts from DB
router.get('/', function(req, res) {
	if(req.user){
		Imagepost.findAll({
			include:[Comment,Tag,User]
		}).then(function(result) {
			res.render('imagepost/index', {
			imageposts: result
			})
		});
	}
	else{
		res.redirect('/user/log-in');
	}
});


// Get Request for New Imagepost.
router.get('/new', function(request, response) {
	if (request.user)
		response.render('imagepost/new', { imagepost: {} });
	else
		response.redirect('/user/log-in');
});

// // Create New Image Post
// router.post('/', uploadHandler.single('image'), function(request, response) {
// 	Imagepost.create({
// 		title:         request.body.title,
// 		body:          request.body.body,
// 		userId:        request.user.id
// 	}).then(function(imagepost) {
// 		sharp(request.file.buffer)
// 		.resize(490,490)
// 		.toBuffer()
// 	}).catch(function(error) {
// 		response.render('imagepost/new', {
// 			imagepost:   request.body,
// 			errors: error.errors
// 		});
// 	});
// });

// Create New Image Post
router.post('/', uploadHandler.single('image'), function(request, response) {
	Imagepost.create({
		title:         request.body.title,
		body:          request.body.body,
		userId:        request.user.id
		//imageFilename: (request.file && request.file.filename)
	}).then(function(imagepost) {
		sharp(request.file.buffer)
		.resize(490, 490)
		// .max()
		// .withoutEnlargement()
		.toBuffer()
		.then(function(thumbnail) {
			console.log("in the loop I want to be in");
			s3.upload({
				Bucket:     'pictori',
				Key:        `imageposts/${imagepost.id}`,
				Body:        request.file.buffer,
				ACL:        'public-read',
				ContentType: request.file.mimetype
			}, function(error, data) {
				console.log("in inner loop");
				JSON.stringify(imagepost);
				s3.upload({
					Bucket:     'pictori',
					Key:        `imageposts/${imagepost.id}-thumbnail`,
					Body:        thumbnail,
					ACL:        'public-read',
					ContentType: request.file.mimetype
				}, function(error, data) {
					response.redirect('/');
				});
			});
		});
	}).catch(function(error) {
		console.log("testttttttt");
		response.render('imagepost/new', {

			imageposts:   request.body,
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


// Search.
router.get('/search', function(req, res) {
	var query     = req.query.tag;
	var condition = `${query}`;
	Tag.findAndCountAll({
		include: [Imagepost,User],
		where: {
			$or: {
				tag: {
					$iLike: condition
				}
			}
		}		   
	}).then(function(result) {
		res.render('imagepost/search', {
		query: query,
		count: result.count,
		imageposts: result.rows
		});
	});
});




module.exports = router;
