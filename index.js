const express = require('express');
const dotenv = require('dotenv');
const pa11y = require('pa11y');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();
dotenv.config();
const authRoutes = require('./routes/authRoutes');
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
app.use(cookieParser());
app.get('*', checkUser);

app.use(authRoutes);


app.get('/', async (req, res) => {
    await Report.deleteMany({ userid: { $exists: false } });
    res.status(200).render('home');
})

app.get('/history', requireAuth, async (req, res) => {
    const userid = res.locals.user._id;
    
    try{
        const reports = await Report.find({ userid });
        res.status(200).render('history', { reports });
    }catch(e){
        console.log(e);
    }
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


app.post('/results', checkUser, async (req, res) => {
    const { url } = req.body;
    if(res.locals.user){
        userid = res.locals.user._id;
    }

    try{
        const result = await pa11y(url , {
            screenCapture: `${__dirname}/my-screen-capture.png`,
            includeNotices: true,
            includeWarnings: true,
        })
        const name = result.documentTitle;
        const report = parseData(result);
        result.issues = report;
        if(res.locals.user){
            await Report.findOneAndUpdate({ userid, name }, { result }, {upsert: true});
        }else{
            await Report.create({result, name});
        }

        res.status(200).json({success: true, name});
    }catch(e){
        console.log(e);
        res.status(400).json({ msg: e.message });
    }

})

app.get('/results/', async (req, res) => {
    
    const name = req.query.name;
    try{
        if(res.locals.user){
            const userid = res.locals.user._id;
            const result = await Report.findOne({userid, name }).sort({ createdAt: -1 });
            res.status(200).render('results', {result: result.result, el: result.result.issues.el, nl: result.result.issues.notices.length, wl: result.result.issues.warnings.length});
        }else{
            const result = await Report.findOne({ name }).sort({ createdAt: -1 });
            res.status(200).render('results', {result: result.result, el: result.result.issues.el, nl: result.result.issues.notices.length, wl: result.result.issues.warnings.length});
        }
    }catch(e){
        console.log(e);
        res.send('page not found');
    }
})

app.delete('/history', checkUser, async (req, res) => {
    const userid = res.locals.user._id;
    const name = req.body.name;
    console.log(name);
    try{
        await Report.findOneAndDelete({ name, userid });
        
        res.json({ name, success: true });
    }catch(e){
        console.log(e);
        res.json({ success: false });
    }  
})


app.get('*', (req, res) => {
    res.status(404).send('page not found');
})