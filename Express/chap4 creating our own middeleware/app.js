const express = require("express");
const fs = require("fs");

const app = express();


//to use middleware we use app.use

app.use(express.json());

// to create our own middele ware
// 3 arugument mein naam kuch bhi de saktay ho but it will be treated as next
// next se bhi pta chala ga express ko we are using middleware
// inka order boht zaroori hai agr middleware kisi route k nexxhay laga hai tou uper walay routes pe wo kaam nahi krega

app.use((req, res , next)=>{
  console.log('hello from middleware');
  // khud k middlwware mein next lagana boht zaroori hota hai warna ye loop mein phas jayega
  next();
})

// agr time bhejna ho tou res mein

app.use((req, res , next)=>{
req.requestTime = new Date().toISOString();
  next();
})


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);



const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    // agr middele ware ko kahin use krna ho tou
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
      status: "fail",
      message: "invalid id",
    });
  }

  res.status(200).json({
    status: "success",
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
        status: "success",
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
      status: "fail",
      message: "invalid id ",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "updated tour here",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: "fail",
      message: "invalid id ",
    });
  }

  res.status(204).json({
    status: "success",
    data: {
      tour: null,
    },
  });
};



app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
