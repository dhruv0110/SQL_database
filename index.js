const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
const { v4: uuidv4 } = require("uuid");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'delta_app',
    password : 'Momdad2112001',
});

app.get("/",(req,res)=>{
  let q = "select count(*) from user";
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs",{count});
    })
} catch(err){
    console.log(err);
}
});

app.get("/user",(req,res)=>{
  let q = "SELECT * FROM USER";
  try{
    connection.query(q,(err,users)=>{
        if(err) throw err;
        res.render("show.ejs",{users});
    })
} catch(err){
    console.log(err);
}
});

app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM USER WHERE ID = '${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs",{user});
    })
} catch(err){
    console.log(err);
}
});

app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let{password: formPass,username: newUsername} = req.body;
  let q = `SELECT * FROM USER WHERE ID = '${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
        if(formPass != user.PASSWORD){
          res.send("WRONG password");
        }else{
          let q2 = `UPDATE USER SET USERNAME='${newUsername}' WHERE ID='${id}'`;
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
          })
        }
    });
} catch(err){
    console.log(err);
}
});

app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});

app.post("/user/new",(req,res)=>{
  let{username,email,password} = req.body;
  let id = uuidv4();

  let q = `insert into user(id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  }catch(err){
    res.send("Some error occurred");
  }
});

app.get("/user/:id/delete",(req,res)=>{
  let{id} = req.params;
  let q = `select * from user where id='${id}'`;

  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs",{user});
    });
  }catch(err){
    res.send("some error with db");
  }
});

app.delete("/user/:id/",(req,res)=>{
  let {id} = req.params;
  let {password} = req.body;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];

      if(user.PASSWORD != password){
        res.send("WRONG PASSWORD");
      }else{
        let q2 = `delete from user where id = '${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          else{
            console.log(result);
            console.log("deleted");
            res.redirect("/user");
          }
        });
      }
    });
  }catch(err){
    res.send("some error with DB");
  }
})

app.listen("8080",()=>{
  console.log("server is listening to port 8080");
});





// let p = "INSERT INTO user (id, username,email,password) values ?";
// let users = [["0110","dhruv","dhruvsheth0110@gmail.com","2112001"],
//              ["14796","vedantshah44558","vedantshah0110@gmail.com","2112002"]]

// try{
//     connection.query(p,[users],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     })
// } catch(err){
//     console.log(err);
// }
// connection.end();
