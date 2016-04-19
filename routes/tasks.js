//412 - pre-condition failed
module.exports = app => {
	const Tasks = app.db.models.Tasks;

	app.route("/tasks")
		.all(app.auth.authenticate())
		.get((req, res) => {
			Tasks.findAll({user_id: req.user.id})
				.then(result => res.json(result))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
		})
		.post((req, res) => {
			Tasks.create(req.body)
					.then(result => res.json(result))
					.catch(error => {
						res.status(412).json({msg: error.message});
					});
				});

	app.route("/tasks/:id")
		.all(app.auth.authenticate())
		.get((req, res) => {
			Tasks.findOne({where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => {
					if(result) {
						res.json(result);
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({msg: error.message});
				})
		})
		.put((req, res) => {
			Tasks.update(req.body, {where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => res.sendStatus(204))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
		})
		.delete((req, res) => {
			Tasks.destroy({where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => res.sendStatus(204))
				.catch(error => {
					res.statusSend(412).json({msg: error.message});
				});
		});
};