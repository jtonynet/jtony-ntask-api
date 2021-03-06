module.exports = app => {
	const Users = app.db.models.Users;

	app.route("/user")
		.all(app.auth.authenticate())
		/**
		 *	@api {get} /user Exibe usuário autenticado
		 *	@apiGroup Usuario
		 *	@apiHeader Authorization Token do usuário
		 *	@apiHeaderExample {json} Header
		 *		{"Authorization": "JWT xyz.abc.123.hgf"}
		 *	@apiSuccess {Number} id Id de registro
		 *	@apiSuccess {String} name Nome
		 *	@apiSuccess {String} email Email
		 *	@apiSuccessExample {json} Sucesso
		 *		HTTP/1.1 200 OK
		 *		{
		 *			id: 1,
		 *			name: "John",
		 *			email: "john@email.net"
		 *		}
		 *	@apiErrorExample {json} Erro de autenticação
		 *		HTTP/1.1 412 Precondition Failed
		 */
		.get((req, res) => {
		Users.findById(req.user.id, {
				attributes: ["id", "name", "email"]
			})
			.then(result => res.json(result))
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
		})
		/**
		 *	@api {delete} /user Exclui usuário autenticado
		 *	@apiGroup Usuario
		 *	@apiHeader Authorization Token do usuário
		 *	@apiHeaderExample {json} Header
		 *		{"Authorization": "JWT xyz.abc.123.hgf"}
		 *	@apiSuccessExample {json} Sucesso
		 *		HTTP/1.1 204 No Content
		 *	@apiErrorExample {json} Erro de exclusão
		 *		HTTP/1.1 412 Precondition Failed
		 */
		.delete((req, res) => {
			Users.destroy({
					where: {id: req.user.id}
				})
				.then(result => res.sendStatus(204))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
		});

	/**
	 *	@api {post} /users Cadastra novo usuário
	 *	@apiGroup Usuario
	 *	@apiParam {String} name Nome
	 *	@apiParam {String} email Email
	 *	@apiParam {String} password Senha
	 *	@apiParamExample {json} Sucesso
	 *		HTTP/1.1 200 OK
	 *		{
	 *			name: "John",
	 *			email: "john@email.net"
	 *			password: "12345",
	 *		}
	 *	@apiSuccess {Number} id Id de registro
	 *	@apiSuccess {String} name Nome
	 *	@apiSuccess {String} email Email
	 *	@apiSuccess {String} password Senha criptografada
	 *	@apiSuccess {Date} updated_at Data de atualização
	 *	@apiSuccess {Date} created_at Data de cadastro
	 *	@apiSuccessExample {json} Sucesso
	 *		HTTP/1.1 200 OK
	 *		{
	 *			id: 1,
	 *			name: "John",
	 *			email: "john@email.net",
	 *			password: "$2a$10$SK1B1",
	 *			updated_at: "2015-09-24T15:46:51.778Z",
	 *			created_at: "2015-09-24T15:46:51.778Z"
	 *		}
	 *	@apiErrorExample {json} Erro de Cadastro
	 *		HTTP/1.1 412 Precondition Failed
	 */
	app.post("/users", (req, res) => {
		Users.create(req.body)
			.then(result => res.json(result))
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
	});
}