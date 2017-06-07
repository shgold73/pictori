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
		console.log("In myimagePosts file");
		response.render('myimagepost/index', {
			imageposts: result
		});
	});
});


router.post('/:id/delete', function(request, response) {
		console.log('delete route hit');
	Imagepost.destroy({
		where: {
			id: request.params.id
		}
	}).then(function(){
    	console.log('destroy all data');
    	response.redirect('/myimagepost');
    	//response.send('You get to the DELETE ROUTE');
	});
});

router.post('/:id/edit', function(request, response) {
	console.log('========');
 	console.log(request.body);
 	console.log('========');
	Imagepost.findById(request.params.id).then(function(imagepost) {
		console.log('body:         ' + request.body.body);
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
	console.log('========================in edit=============');
	Imagepost.findById( request.params.id).then(function(imagepost){
		if (imagepost)
	 		response.render('myimagepost/edit', {post: imagepost})
		else
			response.redirect('/myimagepost');
	}).catch(function(err) {
	 	response.redirect('/myimagepost');
//	response.send('IN EDITING ');
	 });
 });


module.exports = router;