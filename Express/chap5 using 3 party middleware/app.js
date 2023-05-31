const express = require('express');
const fs = require('fs');
// require the third party middleware morgan
const morgan = require('morgan'); // npm i morgan

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

// agr time bhejna ho tou res mein

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





app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// users routes

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
