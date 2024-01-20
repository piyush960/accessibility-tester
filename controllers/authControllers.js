const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    
    const errors = { username: '', email: '', password: '' };

    if(err.code === 11000 && err.message.includes('username')){
        errors.username = 'username already exists';
    }

    if(err.code === 11000 && err.message.includes('email')){
        errors.email = 'email already exists';
    }

    if(err.message.includes('Incorrect username or email')){
        errors.email = err.message;
    }

    if(err.message.includes('Incorrect Password')){
        errors.password = err.message;
    }

    if(err.message.includes('user validation failed')){
       Object.values(err.errors).forEach( ({ properties }) => {
        errors[properties.path] = properties.message;
       })
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const generateToken = (id) => {
    return jwt.sign({ id }, 'accessibility tester website', {
        expiresIn: maxAge
    });
}

const login_get = (req, res) => {

    res.status(200).render('login');
}

const login_post = async (req, res) => {
    const { emailname, password } = req.body;
    try{
        const user = await User.login(emailname, password);
        const token = generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }catch(e){
        const errors = handleErrors(e);
        res.status(400).json({ errors });
    }

}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).redirect('/');
}

const signup_post = async (req, res) => {
    console.log('here');
    const { username, email, password } = req.body;

    try{
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }catch(e){
        const errors = handleErrors(e);
        res.status(400).json({ errors });
    }

}

module.exports = { login_get, login_post, signup_post, logout_get };