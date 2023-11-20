const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
app = express();

// Connection URI (replace <username>, <password>, and <dbname> with your MongoDB credentials)
const uri = 'mongodb+srv://ds952073:ewebC2Mb1DxZUag5@cluster0.d2el9gu.mongodb.net/';

// Create a Mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    const dbName = mongoose.connection.name;
    console.log(dbName)
})
/*
'sensorID': _id,
        'sensorType': _type,
        'Value': _value,
        'Unit': _unit

 */

// Define a Mongoose schema
const dataSchema = new mongoose.Schema({
    moduleID: { type: String, required: true },
    dataHash: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

// Create a Mongoose model based on the schema
const DataModel = mongoose.model('SensorData', dataSchema);

const encryptData = (data) => {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    const hashResult = hash.digest('hex')
    return hashResult.toString()
}

const parseObject = (data) => {
    let result = ''
    for (const key in data) {
        if (data.hasOwnProperty(key))
            result += key + ': ' + data[key] + ', '
    }
    result = result.slice(0, -2)
    return result
}

// Call the function to create a new user
app.get('/createData', async (req, res) => {
    try {
        // Create a new user document
        data = {
            "sensor_id": '001',
            "sensorType": "temperature",
            "time": Date.now().toString(),
        }
        data_string = parseObject(data)
        console.log(data_string)

        hash_value = encryptData(data_string)
        console.log(hash_value)

        const newData = new DataModel({
            moduleID: 'predictability',
            dataHash: hash_value,
        });

        // Save the data point to the database
        const savedData = await newData.save();
        console.log('Data created:', savedData);
    } catch (error) {
        console.error('Error creating user:', error);
    }

    res.send("Ho gaya")

});

app.listen(3000, () => {
    console.log("Listen on http://localhost:3000")
})

