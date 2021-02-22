const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restControllers')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')


const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

const authenticatedUser = (req, res, next) => {
  if (Number(helpers.getUser(req).id) !== Number(req.params.id)) {
    req.flash('error_messages', 'Cannot Access');
    return res.redirect(`/users/${req.user.id}`);
  }
  return next();
};

//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
//在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, authenticatedUser, userController.editUser)
router.put('/users/:id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)


router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

module.exports = router
