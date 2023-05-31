const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
  
// get tour update aur delete mein ye code repeat ho raha tha tou usko alag se nikal liya
 exports.checkId = (req, res , next , val)=>{
    if (req.params.id* 1 > tours.length) {
        // return lazmi lagana warna header error ayega
       return  res.status(404).json({
          status: 'fail',
          message: 'invalid id',
        });
      }
      next();
 }


 // yahan wo middleware bnao

 exports.checkBody = (req, res , next)=>{
  if (!req.body.name || !req.body.price) {
      // return lazmi lagana warna header error ayega
     return  res.status(400).json({
        status: 'fail',
        message: 'missing name or price',
      });
    }
    next();
}

  exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: 'success',
      createAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  };
  
  exports.getTour = (req, res) => {
    console.log(req.params);
  
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
  
   
  
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  };
  
  exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
  
    const newTour = Object.assign({ id: newId }, req.body);
  
    tours.push(newTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    );
  };
  
  exports.updateTour = (req, res) => {
   
    res.status(200).json({
      status: 'success',
      data: {
        tour: 'updated tour here',
      },
    });
  };
  
  exports.deleteTour = (req, res) => {
    
  
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  };
