const Tour = require('../model/tourModel');

  // 2nd ab ye wali api (reading the documents)
  exports.getAllTours = async (req, res) => {
    try {
      // jb find mein kuch bhi data pass na ho tou wo sare document retrun krta hao
      const tours = await Tour.find();
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
    // findbyid is like findOne({_id:req.params.id})
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
    // jb async await use krtay hn tou uske ander try catch hota hai for error handling
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
      new:true, // yani updated document will be return 
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
