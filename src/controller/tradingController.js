const Database = require('../database/Database.js');

module.exports = { 
    async getData(req, res) {
        const d = await new Database();      
        const params={};  
        params.table=req.params.ticker+"_"+req.params.timeframe;
        params.range=req.params.range;
        const result = await d.query(`
        SELECT  * from :table
        WHERE TRUNC(DATETIME)>=TO_DATE('01/JAN/:range','dd/mon/yyyy')
        `        
        , params);
        res.send(result);        
    }    
}



