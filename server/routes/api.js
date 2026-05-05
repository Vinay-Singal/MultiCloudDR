const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authCtrl = require('../controllers/authController');
const taskCtrl = require('../controllers/taskController');

// ==========================================
// AUTH ROUTES
// ==========================================
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// ==========================================
// TASK & CLOUD ROUTES
// ==========================================
router.post('/tasks/add', upload.single('file'), taskCtrl.createTask);
router.get('/tasks/my-tasks/:userId', taskCtrl.getUserTasks);
router.get('/admin/stats', taskCtrl.getAdminStats);
router.get('/admin/users', taskCtrl.getAllUsers);

// ==========================================
// DELETE ROUTES
// ==========================================

// Route for deleting a specific task/object by ID
router.delete('/tasks/:id', taskCtrl.deleteTask);

// Route for deleting a user account and associated data by Admin
router.delete('/admin/users/:id', taskCtrl.deleteUserAccount);

module.exports = router;