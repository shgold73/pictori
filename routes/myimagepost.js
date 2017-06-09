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
			console.log("In myimagePosts file");
			response.render('myimagepost/index', {
				imageposts: result
			});
			console.log(JSON.stringify(result))
		});
	}
	else{
		response.redirect('/user/log-in');
	}
});


//Deletes a Imagepost 
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


//POST request for Editing an imagepost description or title
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


//POST request to add Tags to imagepost
router.post('/tags',function(request,response) {
 console.log("In tags loop");	
  Tag.create({
  	tag:         request.body.tags,
  	imagepostId: request.body.imagepostid,
  	userId:      request.user.id
  }).then(function(comment) {
		response.redirect('/myimagepost');
		console.log("Pass at tags");
	}).catch(function(error) {
		console.log("Fail at tags");
	});	
});

//GET request for Editing an Imagepost
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






// //Create Comment to Imagepost
// router.post('/comments', function(request, response) {
//     if(request.user){
// 	Comment.create({
// 		body:   request.body.body,
// 		imagepostId: request.body.imagepostid,
// 		author:request.user.firstname
// 		//author: {currentUser.firstname + ' '+ currentUser.lastname}
// 	}).then(function(comment) {
// 		response.redirect('/imagepost');
// 		console.log("Pass");
// 	}).catch(function(error) {
// 		console.log("Fail");
// 			// response.render('../index', {
// 			// 	imagepost:    imagepost,
// 			// 	comment: request.body,
// 			// 	errors:  error.errors
// 			//});	
// 		});
// 	} else {
// 		response.redirect('/user/log-in');
// 	}
//  });


module.exports = router;