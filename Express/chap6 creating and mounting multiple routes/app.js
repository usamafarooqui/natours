const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    createAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id ',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id ',
    });
  }

  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};


// users route 

const getAllUsers= ( req , res) =>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet define'
  })
}

const createUser= ( req , res) =>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet define'
  })
}

const getUser = ( req , res) =>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet define'
  })
}

const updateUser= ( req , res) =>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet define'
  })
}

const deleteUser = ( req , res) =>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet define'
  })
}




// yahan tour router middleware bna hai jo routing sambhalega
const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// users routes

const userRouter = express.Router();

app.route('/').get(getAllUsers).post(createUser);

app
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// how to make sepreate routes mounting multiple routes
// apni main api ko middleware mein dalo
// ye humesha router create krnay k neechay hi ayega
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);



const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
