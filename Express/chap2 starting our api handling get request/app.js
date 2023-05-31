const express = require('express');
const fs = require('fs');


const app = express();

// file ko read kisi bhi route se bahr krtay hn q k wo 1 time hi read hogi out of route 
// aur event loop nahi rok k rakhay gi
// json.parse se jo json ayegi wo array of javascript object mein convert hojayegi
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// lets create our 1st route 
// v1 is version 1 of our api in case api change krni ho ya update tou sab cheezain esi hi aur v2 kro
app.get('/api/v1/tours' , (req, res)=>{
    // uper tours ka response bhejnay k liye
    res.status(200).json({
        status:'success',
        results: tours.length, 
        data:{
            // ya tou esay bhej saktay hn 
            // tours:tours 
            // new version of javascript mein agr 2no name same ho tou wo 1 bar likhnay se key value pair bn jata hai
            tours
        }
    })
})

// how to return only 1 tour 
// iske k liye id ya kisi bhi naam ka varaible bnana prega
// url mein variable bnana k liye :variable_name
// to make a parameter optional uske agay question mark laga do :x?
app.get('/api/v1/tours/:id' , (req, res)=>{
   console.log(req.params);

//    to find something in a array 
// el variable name hai jo filter data return krega
    // params se jo value ayegi wo string mein hogi usko convert krnay k liye 1 se multiply
    const id = req.params.id *1 ;
    const tour = tours.find(el => el.id === id)
    // agr tour ki id se ziada hai tou 
    if(!tour){
        res.status(404).json({
            status:"fail",
            message:"invalid id"
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
        
    })
})



// for post request 

// req direct data nahi le sakta uske is kaam k liye middleware chaiye hota hai
// modify incoming request data
// agr ye middle ware nahi lagaingay tou humain data nahi milega in return
app.use(express.json()); 

// post route 

app.post('/api/v1/tours' , (req, res)=>{
    // console.log(req.body);
    // ab hum ye jo data hai usko json file mein add krengay
    // q k ye database nahi hai tou id khud bnani pregi db hota tou khud id bna leta
    const newId = tours[tours.length-1].id + 1;
    // object.assign new object bnata hai 2 existing object ko merge kr k 
    const newTour = Object.assign({id:newId} , req.body);

    // uper jo tours ka array call kia hai tours-simple  se us mein new tour add kro
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json` , JSON.stringify(tours) , err => {
        res.status(201).json({
            status:"success",
            data:{
                tour : newTour
            }
        });
    })
 
})



// Put request abhi sach mein update nahi kra rahay wo agay hoga

app.patch('/api/v1/tours/:id' , (req, res)=>{
    if(req.params.id * 1 > tours.length){
        res.status(404).json({
            status:'fail',
            message:'invalid id '
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour:'updated tour here'
        }
    })
})

// delete a request 


app.delete('/api/v1/tours/:id' , (req, res)=>{
    if(req.params.id * 1 > tours.length){
        res.status(404).json({
            status:'fail',
            message:'invalid id '
        })
    }

    res.status(204).json({
        status:'success',
        data:{
            tour:null
        }
    })
})


// to create a basic server

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
