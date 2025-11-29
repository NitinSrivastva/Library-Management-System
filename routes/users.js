const express = require('express');
const {users} = require('../data/users.json');

const router = express.Router();

/**
 * Routes: /users
 * Method: GET
 * Description: Get all the list of the users in the system
 * Access: Public
 * Parameters: None
 */

router.get('/', (req,res)=>{
    res.status(200).json({
        Success:true,
        data: users
    })
})

/**
 * Routes: /users/:id
 * Method: GET
 * Description: Get a user by their ID
 * Access: Public
 * Parameters: id
 */

router.get('/:id', (req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=> each.id === id);

    if(!user){
        return res.status(404).json({
            Success:false,
            message: `User with the id ${id} not found`
        });
    }
    
    res.status(200).json({
        Success:true,
        data: user
    })
});

/**
 * Routes: /users
 * Method: POST
 * Description: Create/Register new user
 * Access: Public
 * Parameters: None
 */

router.post('/', (req,res)=>{
    // req.body should contain all the details of the user
    const {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;

    // check if all the required fields are present
    if(!id || !name || !surname || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            Success:false,
            message: "Please provide all the required fields"
        });
    }

    // check if the user with the same id already exists    
    const user = users.find((each)=> each.id === id);

    // if user already exists, send error response
    if(user){
        return res.status(409).json({
            Success:false,
            message: `User with the id ${id} already exists`
        });
    }

    // else create a new user
    // push the new user to the users array
    users.push({id, name, surname, email, subscriptionType, subscriptionDate});

    // send success response
    res.status(201).json({
        Success:true,
        message: "User created successfully",
        // data: users
    });
});

/**
 * Routes: /users/:id
 * Method: PUT 
 * Description: Updatting a user by their ID 
 * Access: Public
 * Parameters: ID
 */
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    // check if the user exists !!
    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            Success:false,
            message: `User with the id ${id} not found`
        });
    }

    // update the user details
    // ... this operator is used to copy all the properties of the user object
    // called as spread operator
    const updatedUser = users.map((each)=>{
        if(each.id === id){
            return {
                ...each,
                ...data,
            }
        }
        return each
    });

    res.status(200).json({
        Success:true,
        data: updatedUser,
        message: "User details updated successfully"
    })

});

/**
 * Routes: /users/:id
 * Method: DELETE 
 * Description: Deleting a user by their ID 
 * Access: Public
 * Parameters: ID
 */
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    // check if the user exists !!
    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            Success:false,
            message: `User with the id ${id} not found`
        });
    }

    const deletedUser = users.filter((each)=> each.id !== id);
    res.status(200).json({
        Success:true,
        data: deletedUser,
        message: "User deleted successfully"
    })
});

/**
 * Routes: /users/subscription-details/:id
 * Method: GET
 * Description: Get all the subscriptions-details by their id 
 * Access: Public
 * Parameters: id
 */
router.get('/subscription-details/:id' , (req,res)=>{
    const { id } = req.params;

    //find the user by ID
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found fot id: ${id}`
        });
    }

    // Exract the Subscription Details
    const getDateInDays = (data = '') => {
        let date;
        if(data){
            date = new Date(data);
        }else{
            date = new Date();
        }
        let days =  Math.floor(date / (1000 * 60 * 60 * 24));  
        return days;    
    }

    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date = date + 90;   
        }else if(user.subscriptionType === "Standard"){
            date = date + 180;
        }else if(user.subscriptionType === "Premium"){
            date = date + 365;
        }
        return date;
    }

    // Subscription Expiration Calculation
    // 1 january , 1970 UTC  //millisecond
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired : subscriptionExpiration < currentDate,
        subscriptionDaysLeft : subscriptionExpiration - currentDate,
        daysLeftForExpiration : returnDate - currentDate,
        returnDate : returnDate < currentDate ? "Book is overdue" : returnDate,
        fine : returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }

    res.status(200).json({
        success:true,
        data: data
    })
})

module.exports = router;