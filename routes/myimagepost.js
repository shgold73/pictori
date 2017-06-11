var express       = require('express');
var models        = require('../models/index');
var User          = models.user;
var Imagepost     = models.imagepost;
var router        = express.Router();



router.get('/', function(request, response) {
	Imagepost.findAll({
		include: User,
		 where: {userId: request.user.id} 

	}).then(function(result) {
		response.render('myimagepost/index', {
			imageposts: result
		});
	});
});


router.post('/:id/delete', function(request, response) {
	Imagepost.destroy({
		where: {
			id: request.params.id
		}
	}).then(function(){
    	response.redirect('/myimagepost');
	});
});

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