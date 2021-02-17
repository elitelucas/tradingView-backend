const Database = require('../database/Database.js');

module.exports = { 
    async getData(req, res) {
        const d = await new Database();      
        const params={}; 
        let resolution; 
        if(req.query.resolution<60)
            resolution=req.query.resolution+"M";
        else if(req.query.resolution<1440)
            resolution=(req.query.resolution/60)+"H";
        else
            resolution=(req.query.resolution/1440)+"D";
        const resolution=req.query.resolution/60;
        params.table=req.query.fsym+req.query.tsym+"_"+resolution;
        params.range=(new Date(req.query.from)).getFullYear();
        console.log(params);
        const result = await d.query(`
        SELECT  * from :table
        WHERE TRUNC(DATETIME)>=TO_DATE('01/JAN/:range','dd/mon/yyyy')
        `        
        , params);
        res.send(result);        
    }    
}



