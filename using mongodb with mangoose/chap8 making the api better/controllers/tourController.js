const Tour = require('../model/tourModel')



  exports.aliasTopTours = (req,res , next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
  }
  
  exports.getAllTours = async (req, res) => {
    // yahan query string bnaegay
    // url se query string nikalnay k liye req.query
    // console.log(req.query)
    
    try {
      // Build Query
      // to delete unwanted fields from the query 
      // ye {...req.query} is liye use kia hai q k queryObj ko iske = rakh dia hao
      // ab query object mein change ka mtlb req.body mein change is cheez ko avoid krnay k liye
      const queryObj ={...req.query};
      // ye cheezain query se nikal jayengi
      const excludeFields = ['page','sort','limit','fields'];
      // delete is a operator here
      excludeFields.forEach(el => delete queryObj[el])
      // there are 2 methods to find
      // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
      // const query =  Tour.find(queryObj);

      // 2) advance filtering 
      // query mein esay likhtay hn api/v1/tours?duration[gte]=5&difficulty=easy
      // agr greater than ya less than ka kaam krana ho url mein 
      let queryStr = JSON.stringify(queryObj); // stringify se object ko string mein convert kia hao 


      // to replace gte gt lte lt   inko agay dollar sign lagana hai
      // \b ka mtlb hai exact words match krega g se sab mein replace krega na k first mein
      // replace function accepts ka call back aur is ka pehla argument match string hai jo old string ko replace krdega
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`);
      // console.log(JSON.parse(queryStr));
      let query =  Tour.find(JSON.parse(queryStr));



      // Sorting the api by price in api we write (sort=price)
      if(req.query.sort){
        // query = query.sort(req.query.sort);
        

        // if sort by 2 criteria
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
        console.log(sortBy);
      }else{
        // if no sort define api sort results by created time
        // - means descending mein sort krega
        query = query.sort('-createdAt');
      }


      // 3) fields limiting 
      // yani user ko data request kre usko wohi data send kia jaye
      if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        // select method hai k bus yehi data send kia jayega
        query = query.select(fields);
      }else{
        // __v mongo by default bhejta hai - ka mtlb ye send nahi hoga
        query = query.select('-__v');
      }



      // 4) pagination and number of result per page
      // setting default page and limit

      const page = req.query.page *1 || 1;
      const limit = req.query.limit *1 || 100;
      // skip is a amount of results that is skipped before quering data
      // calculate skip value
      const skip = (page -1 ) * limit;

      // page=2&limit=10
      query = query.skip(skip).limit(limit)


      // throw error if a given page is not found or made with few limits data

      if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error("this page does not exist");
      }



      // execute the query
      const tours = await query;

      // send response
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours,
        },
      });
    } catch (error) {
      res.status(404).json({
        status:'fail',
        message: error
      })
    }
  
  };
  
  // read a specific tour
  exports.getTour = async(req, res) => {
   try {
    // req.params.id is liye q k url mein variable ka naam id hai
    console.log(req.params.id)
    const tour =await Tour.findById(req.params.id);
    console.log(tour.status);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
   } catch (error) {
    res.status(404).json({
      status:'fail',
      message: error
    })
   }
   
  };
  

  // sab se pehlay tour route bnatay hn
  exports.createTour = async (req, res) => {
    try{
       // doucment create krnay k do tareekay hn
    // const newTour = new Tour({})
    // newTour.save()
    // 2nd method
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data:{
        tour:newTour
      }
    
    });
    }catch (err){
      res.status(400).json({
        status:'fail',
        message: err
      })
    }
   
  };
  
  // update the tour 
  exports.updateTour = async (req, res) => {
   try {
    // req.params dhoonde ga req.body update krega new object new update document return krega
    const tour = await Tour.findByIdAndUpdate(req.params.id , req.body,{
      new:true,
      // runvalidators check krega k sare validations sahi lagain hn ya nahi
      runValidators:true
    } )
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
   } catch (error) {
    res.status(404).json({
      status:'fail',
      message: error
    })
   }
    
  };
  
  // delete
  exports.deleteTour = async(req, res) => {
    
    try {
      await Tour.findByIdAndDelete(req.params.id)
      res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
    } catch (error) {
      res.status(404).json({
        status:'fail',
        message: error
      })
    }
    
  };
