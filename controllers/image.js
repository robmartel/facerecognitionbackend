// UPDATED WAY OF USING CLARIFAI GRPC
require('dotenv').config();

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const  stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.API_KEY)

//********/ Old way of using Clarifai **********
// const Clarifai = require('clarifai');

// const app = new Clarifai.App({
//     apiKey: 'b18617e521c949139d6cc40817ed9add'
// })
// **********************************************

const handleApiCall = (req, res) => {
stub.PostModelOutputs(
    {
        model_id: "face-detection",
        inputs: [{data: {image: { url: req.body.input }}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }
        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
)
}

// const handleApiCall = (req, res) => {
//     app.models.predict('face-detection', req.body.input)
//     .then(data => {
//         res.json(data);
//     })
//     .catch(err => res.status(400).json('unable to work with api'))
// }


const handleImage = (req, res, db) => {
    const { id } = req.body;
      db('users').where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
          res.json(entries[0].entries);
      })
      .catch(err => res.status(400).json('Unable to get entries'))
  };

  module.exports = {
    handleImage,
    handleApiCall
  }