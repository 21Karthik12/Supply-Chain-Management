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
'sensorId': self.id,
            'sensorType': self.type,
            'moduleId': self.module_id,
            'module': self.module,
            'value': value,
            'unit': self.unit,
            'alert': self.alert,
            'timestamp': str(datetime.now())

*/

// Define a Mongoose schema
const dataSchema = new mongoose.Schema({
    sensorID: { type: Number, required: true },
    moduleID: { type: Number, required: true },
    module: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, required: true },
    alert: { type: Boolean, required: true },
    timestamp: { type: String, required: true },
    dataHash: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now() }
});

// Create a Mongoose model based on the schema
const DataModel = mongoose.model('SensorDatum', dataSchema);

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
            "sensorID": '001',
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

