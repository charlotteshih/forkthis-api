const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
	hasUserWithUserName(db, username) {
		return db('users')
			.where({ username })
			.first()
			.then(user => !!user)
	},
	insertUser(db, newUser) {
		return db
			.insert(newUser)
			.into('users')
			.returning('*')
			.then(([user]) => user)
	},
	validatePassword(password) {
		if (password.length < 8) {
			return 'Password must be longer than 8 characters.'
		}
		if (password.length > 72) {
			return 'Password cannot be longer than 72 characters.'
		}
		if (password.startsWith(' ') || password.endsWith(' ')) {
			return 'Password cannot start or end with empty spaces.'
		}
		if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
			return 'Password must contain at least one uppercase, one lowercase, one number, and one special character.'
		}
		return null
	},
	hashPassword(password) {
		return bcrypt.hash(password, 12)
	},
	serializeUser(user) {
		return {
			id: user.id,
			username: xss(username),
			nicknake: xss(nickname)
		}
	}
}

module.exports = UsersService