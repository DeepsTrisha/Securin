const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const CVE = require('./models/cve.js'); // Import Mongoose model for CVE

const app = express();
app.use(cors());
app.use(express.json());

const mongoDBURI = 'mongodb://localhost:27017/cve';

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  });

 
   async function storeToDB(){
        try {
          const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');

    // Extract the CVE data from the response
    const vulnerabilities = response.data.vulnerabilities;

    // Save each CVE to the database
    for (const vul of vulnerabilities) {
      const cve = new CVE({
        id: vul.cve.id,
        sourceIdentifier: vul.cve.sourceIdentifier,
        published: vul.cve.published,
        lastModified: vul.cve.lastModified,
        vulnStatus: vul.cve.vulnStatus,
        descriptions:vul.cve.descriptions,
        metrics:vul.cve.metrics,
        weaknesses:vul.cve.weaknesses,
        configurations:vul.cve.configurations,
        references:vul.cve.references
      });
      await cve.save();
    }

      
        } catch (error) {
          console.error('Error fetching and storing CVEs:', error);
        }
   }
  storeToDB();
  app.get('/api/cves', async (req, res) => {
    try {
      const cves = await CVE.find();
      res.json(cves);
    } catch (error) {
      console.error('Error fetching CVEs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Endpoint to fetch total count of CVE records from MongoDB
  app.get('/api/cves/count', async (req, res) => {
    try {
      const count = await CVE.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error('Error fetching CVE count:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
