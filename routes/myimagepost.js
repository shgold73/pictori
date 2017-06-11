var express       = require('express');
var models        = require('../models/index');
var User          = models.user;
var Imagepost     = models.imagepost;
var Tag           = models.tag;
var router        = express.Router();


//Display all the Imagepost that belongs to the user
router.get('/', function(request, response) {
	if(request.user){
		Imagepost.findAll({
			include: Tag,User,
			 where: {userId: request.user.id} 
		}).then(function(result) {
			response.render('myimagepost/index', {
				imageposts: result
			});
		});
	}
	else{
		response.redirect('/user/log-in');
	}
});


// Search based on Tag.
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
		res.render('myimagepost/search', {
		query: query,
		count: result.count,
		imageposts: result.rows
		});
	});
});

//Deletes a Imagepost 
router.post('/:id/delete', function(request, response) {
	Imagepost.destroy({
		where: {
			id: request.params.id
		}
	}).then(function(){
    	response.redirect('/myimagepost');
	});
});


//POST request for Editing an imagepost description or title
router.post('/:id/edit', function(request, response) {
	Imagepost.findById(request.params.id).then(function(imagepost) {
		imagepost.update(  {
			title:        request.body.title,
			body:         request.body.body}
	 ).then(function(post) {
	 	response.redirect('/myimagepost');
		}).catch(function(error) {
			response.render('myimagepost/edit', {
				post:    imagepost
			});
		});
	});
});

//POST request to add Tags to imagepost
router.post('/tags',function(request,response) {
  Tag.create({
  	tag:         request.body.tags,
  	imagepostId: request.body.imagepostid,
  	userId:      request.user.id
  }).then(function(comment) {
		response.redirect('/myimagepost');
	}).catch(function(error) {
	});	
});

//GET request for Editing an Imagepost
router.get('/:id/edit', function(request, response) {
	Imagepost.findById( request.params.id).then(function(imagepost){
		if (imagepost)
	 		response.render('myimagepost/edit', {post: imagepost})
		else
			response.redirect('/myimagepost');
	}).catch(function(err) {
	 	response.redirect('/myimagepost');
	 });
 });

module.exports = router;