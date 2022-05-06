const express = require("express");
const app = express();
const pool = require("./db")
const validator = require("email-validator")
const validatePhoneNumber = require('validate-phone-number-node-js');
const dotenv = require("dotenv")
const bodyParser = require('body-parser');
dotenv.config();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.json());

app.get("/", async (req, res)=>{
    res.send("Hello");
})
app.get('/api', async (req, res)=>{  
    try {
        const allforms = await pool.query("SELECT * FROM info");
        res.json(allforms.rows);
      } catch (err) {
        console.error(err.message);
      }
})
 
app.post("/api", async (req, res)=>{
    const {name, email, mobile} = req.body;
    if(!name || !email || !mobile){
        throw new Error("Enter all the fields");
    }
    for(let i = 0; i<name.length; i++){
        if(!((name[i]>= 'a' && name[i]<='z')||(name[i]>='A' && name[i]<='Z'))){
            throw new Error("Enter a Valid Name");
        }
    }
    if(!validator.validate(email)){
        throw new Error("Invalid Email");
      }
  if(!validatePhoneNumber.validate(mobile)){
      throw new Error("Enter a valid Phone Number");   
  }
  const newform = await pool.query(
    "INSERT INTO info (name, email, mobile) VALUES($1, $2, $3)",
    [name, email, mobile]
  );  

    res.redirect('/api');
})

app.put('/api', async (req, res)=>{
    try {
        const {id, name, email, mobile} = req.body;
        const updateTodo = await pool.query(
          "UPDATE info SET name = $1, email = $2, mobile = $3 WHERE id = $4",
          [name, email, mobile, id]
        );
        res.json("Updated")
      } catch (err) {
        console.error(err.message);
      }
})


app.delete('/api', async (req, res)=>{
  try {
    const { id } = req.body;
    const deletedata = await pool.query("DELETE FROM info WHERE id = $1", 
    [id]
    );
    res.json("Data is Deleted");
  } catch (err) {
    console.log(err.message);
  }
})

app.listen(5000);