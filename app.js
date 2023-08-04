
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB setup (make sure you have MongoDB installed and running)
// const mongoURI = 'mongodb://127.0.0.1:27017/task-manager';
const mongoURI = process.env.Database_url ;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Task model
const Task = mongoose.model('Task', {
  title: {type:String,required:true},
  description: {type:String,required:true},
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' } ,
});

// Routes
app.post('/create', async (req, res) => {
    const {title,description} = req.body;
    if (title && description){
        const task = new Task({
            title:title,
            description:description
        });
        await task.save();
        res.status(201).send({'data':task})
    }
    else{
        res.status(400).send({'message':'the all fields are required'})
    } 
}); 

app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(400).json({ error: 'Failed to fetch tasks' });
  }
});

app.patch('/update/:id', async (req, res) => {
    const taskId = req.params.id;
   
    if(taskId == taskId){
        const user = await Task.findOne({_id:taskId})
        if(user){
          const { status } = req.body;
          console.log(status);
          const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
            // const { title,description,status } = req.body;
            // const updateFields = {};
            // if (title !== undefined) updateFields.title = title;
            // if (description !== undefined) updateFields.description = description;
            // if (status !== undefined) updateFields.status = status;
            // const task = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });
            res.status(200).send({status:"updated the data",data:task});
        }   
    }
    else{
        res.status(400).send({'message':'the user is not exits'})
    }
});

app.delete('/delete/:id', async (req, res) => {
 const id = req.params.id
 const data = await Task.findByIdAndRemove(id)

 res.send({status:"done",data:data})
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port  ${PORT}`));
