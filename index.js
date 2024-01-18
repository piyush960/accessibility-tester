const express = require('express');
const dotenv = require('dotenv');
const pa11y = require('pa11y');
const mongoose = require('mongoose');
const app = express();
dotenv.config();
const Report = require('./models/reports');


const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(results => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`server listening to port ${PORT}`));    
})
.catch(e => console.log(e));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {

    Report.deleteMany({})
    .then(result => console.log('all deleted'))
    .catch(e => console.log(e));
    res.status(200).render('home');
})

function parseData(data){
    const report = {
        errors : {
            empty_head: [],
            htmlfault: [],
            contentIssue: [],
            alt_missing: [],
            obsolete_content: [],
            tag_with_no_content: [],
            missing_alt_text: [],
            missing_attributes: [],
            no_label: [],
            duplicate_id: [],
            child_semantic_meaning: [],
            other: []
        },
        warnings : [],
        notices : [],
        el: 0,
    }
    data.issues.forEach(issue => {
        if(issue.type === 'error'){
            report.el++;
            if(issue.code === 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail'){
                report.errors.contentIssue.push(issue);
            }
            else if(issue.code === 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37'){
                report.errors.alt_missing.push(issue);
            }
            else if(issue.code.includes('WCAG2AA.Principle1.Guideline1_3.1_3_1.H49')){
                report.errors.obsolete_content.push(issue);
            }
            else if(issue.code === 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2'){
                report.errors.tag_with_no_content.push(issue);
            }
            else if(issue.code === 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H30.2'){
                report.errors.missing_alt_text.push(issue);
            }
            else if(issue.code.includes('WCAG2AA.Principle4.Guideline4_1.4_1_2.H91')){
                report.errors.missing_attributes.push(issue);
            }
            else if(issue.code === 'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77'){
                report.errors.duplicate_id.push(issue);
            }
            else if(issue.code === 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F92,ARIA4'){
                report.errors.child_semantic_meaning.push(issue);
            }else if(issue.code === 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F68'){
                report.errors.no_label.push(issue);
            }else if(issue.code.includes('WCAG2AA.Principle2.Guideline2_4.2_4_2.H25')){
                report.errors.empty_head.push(issue);
            }else if(issue.code === 'WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2'){
                report.errors.htmlfault.push(issue);
            }
            else{
                report.errors.other.push(issue);
            }
        }else if(issue.type === 'warning'){
            report.warnings.push(issue);
        }else if(issue.type === 'notice'){
            report.notices.push(issue);
        }
        
    })

    return report;
}


app.post('/results', async (req, res) => {
    const { url } = req.body;
    const result = await pa11y(url , {
        screenCapture: `${__dirname}/my-screen-capture.png`,
        includeNotices: true,
        includeWarnings: true,
    })
    const report = parseData(result);
    result.issues = report;

    try{
        const report = await Report.create({ result });
        res.status(200).json({ result });
    }catch(e){
        console.log(e);
        res.status(400).json({ msg: "failed to create report" });
    }

})

app.get('/results', async (req, res) => {

    try{
        const result = await Report.findOne().sort({ createdAt: -1 });
        res.status(200).render('results', {result: result.result, el: result.result.issues.el, nl: result.result.issues.notices.length, wl: result.result.issues.warnings.length});
    }catch(e){
        console.log(e);
        res.send('page not found');
    }

})
