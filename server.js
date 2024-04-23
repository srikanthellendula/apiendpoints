const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const app = express()
app.use(express.json());

//Intial Customer Data
const customersJson = JSON.stringify([{'id': 1, 'name': 'srikanth', 'age': 27, 'phone':9573392830, 'email': 'srikanth@gmail.com', 'created_on': '', 'updated_on': '', 'address_id':1 },
                    {'id': 2, 'name': 'satya', 'age': 26, 'phone':9573392831, 'email': 'satya@gmail.com', 'created_on': '', 'updated_on': '' , 'address_id':2},
                    {'id': 3, 'name': 'durga', 'age': 25, 'phone':9573392832, 'email': 'durga@gmail.com', 'created_on': '', 'updated_on': '', 'address_id':3 },
                    {'id': 4, 'name': 'bhavani', 'age': 24, 'phone':9573392833, 'email': 'bhavani@gmail.com', 'created_on': '', 'updated_on': '', 'address_id':4 },
                    {'id': 5, 'name': 'praveen', 'age': 23, 'phone':9573392834, 'email': 'praveen@gmail.com', 'created_on': '', 'updated_on': '', 'address_id':5 }])

// Intial Address Data
const addressJson = JSON.stringify([{'address_id':1, 'lane': 'Market Lane', 'country':'USA', 'city':'NYC', 'pincode':339283, 'updated_on':''},
                    {'address_id':2, 'lane': 'IT Towers', 'country':'UK', 'city':'London', 'pincode':957339, 'updated_on':''},
                    {'address_id':3, 'lane': 'Mindspace', 'country':'India', 'city':'Hyderabad', 'pincode':500045, 'updated_on':''},
                    {'address_id':4, 'lane': 'Financial District', 'country':'India', 'city':'Delhi', 'pincode':500034, 'updated_on':''},
                   {'address_id':5, 'lane': 'TSIIC SEZ', 'country':'UAE', 'city':'Dubai', 'pincode': 203456 , 'updated_on':''},]) 

                   
//Connecting database
const db = new sqlite3.Database('database.db', (err)=>{
    if(err){
        console.error(err)
    }

    
    else{
        console.log('DB connected')
    }
} ) 

 /* db.run('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, mobile INTEGER NOT NULL, age INTERGER NOT NULL, updated_on DATETIME, created_on DATETIME, address_id INTEGER NOT NULL)', (err)=>{
    if (err){
        console.error(err)
    }
    else{
        console.log('Table created')
    }
}) */

/* db.run('CREATE TABLE IF NOT EXISTS address (address_id INTEGER PRIMARY KEY, lane VARCHAR(255), country  VARCHAR(255) NOT NULL, city  VARCHAR(255) NOT NULL, pincode INTERGER NOT NULL, updated_on DATETIME)', (err)=>{
    if (err){
        console.error(err)
    }
    else{
        console.log('Table created')
    }
}) */


/* const insertQuery = 'INSERT INTO customers (id, name, email, age, mobile, created_on, updated_on, address_id) VALUES (?,?,?,?,?,?,?,?)' 

customersJson.forEach(eachItem=>{
    const time = new Date()
    db.run(insertQuery, [eachItem.id, eachItem.name, eachItem.email, eachItem.age, eachItem.phone, time, time,eachItem.address_id], (err)=>{
        if(err){
            console.error(err)
        }
        else{
            console.log('Query Sucess')
        }
    })
}) */
 

/* const insertAddQuery = 'INSERT INTO address (address_id, lane, country, city, pincode, updated_on) VALUES (?,?,?,?,?,?)' 

addressJson.forEach(eachItem=>{
    const date = new Date()
    db.run(insertAddQuery, [eachItem.address_id, eachItem.lane, eachItem.country, eachItem.city, eachItem.pincode, date], (err)=>{
        if(err){
            console.error(err)
        }
        
        else{
            console.log('Query Success')
        }
    })
}) */


//Get all customers
app.get('/customers/', async (req, res)=>{
    const query1 = 'SELECT * FROM customers INNER JOIN address ON customers.address_id = address.address_id'
    
    try{
        const result1 = await db.all(query1, [], (err, rows)=>{
            if(err){
                throw err
            }
            else{
                const finalResult = rows.map(eachItem =>{
                    return {id: eachItem.id, Name: eachItem.name, Mobile: eachItem.mobile, Email: eachItem.email, updated_on: eachItem.updated_on, created_on: eachItem.created_on,  Address:{Lane: eachItem.lane, city: eachItem.city, country: eachItem.country, pincode: eachItem.pincode} }
                })
                
                res.send(finalResult)                
                
            }

        })
    }
    catch(e){
        console.log(e)
    }   
     
})

// Get particular customer with given ID
app.get('/customers/:id', async(req, res)=>{
    const id = req.params.id
    const query = `SELECT * FROM customers WHERE id=${id}`

    try{
        db.all(query, [], (err, result)=>{
            res.send(result)
        })
    }
    catch(e){
        console.log(e)
    }    
})

// Delete specific customer with given ID
app.delete('/customers/:id', async(req, res)=>{
    const id = req.params.id
    const query = `DELETE FROM customers WHERE id=${id}`

    try{
        db.all(query, [], (err, result)=>{
            if(err){
                console.error(err)
            }
            else{
                res.send(`${id} Deleted Succesfully`)
            }
            
        })
    }
    catch(e){
        console.log(e)
    }

    
})

// Adding new customer with customer details and address details
app.post('/customers/', (req, res)=>{
    const time = new Date
    const updated = time.toLocaleString()
     const {id, name, email, mobile, address_id, age, lane, country, city, pincode } = req.body
     const insertData1 = 'INSERT INTO customers (id, name, age, email, mobile, updated_on, created_on, address_id) VALUES(?,?,?,?,?,?,?,?)'
     db.run(insertData1, [id, name, age, email, mobile, updated, updated, address_id], (err, result)=>{
        if(err){
            console.error(err.message)
        }
        else{
            res.send('Data inserted Succefully')
        }
     })

     const insertData2 = 'INSERT INTO address (address_id, updated_on, lane, country, pincode, city) VALUES(?,?,?,?,?,?)'
     db.run(insertData2, [address_id, updated, lane, country, pincode, city], (err, result)=>{
        if(err){
            console.error(err.message)
        }
        else{
            res.send('Data inserted Succefully')
        }
     })


})

//Modify customer personal details not address
app.put('/customers/:id', (req, res)=>{
    const time = new Date
    const updated = time.toLocaleString()
    const {id} = req.params
    const {name, email, mobile, address_id, age, lane, country, city, pincode } = req.body
    console.log(req.body)
    
    for(let column in req.body){            
        const val = req.body[`${column}`]
        console.log(column, val)
        const updateQuery = `UPDATE customers SET ${column}=? WHERE id=?` 
        console.log(updateQuery)
        try{
            db.all(updateQuery,[val, id], (err, result)=>{
                if(err){
                    console.error(err)
                }
                else{
                    res.send(`Updated ${column}`)
                }
            })
        }
        catch(e){
            console.error(e)
        }
    }
})


//Modify customer address details
app.put('/address/:id', (req, res)=>{
    const time = new Date
    const updated = time.toLocaleString()
    const {id} = req.params
    const {address_id, lane, country, city, pincode } = req.body
    console.log(req.body)
    
    for(let column in req.body){            
        const val = req.body[`${column}`]
        console.log(column, val)
        const updateQuery = `UPDATE address SET ${column}=? WHERE address_id=?` 
        console.log(updateQuery)
        try{
            db.all(updateQuery,[val, id], (err, result)=>{
                if(err){
                    console.error(err)
                }
                else{
                    res.send(`Updated ${column}`)
                }
            })
        }
        catch(e){
            console.error(e)
        }
    }
})


app.listen('3000', ()=>{
    console.log('server started')
})

