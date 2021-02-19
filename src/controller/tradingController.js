const Database = require('../database/Database.js');

module.exports = { 
    async getData(req, res) {
        console.log("controller");
        const d = await new Database();      
        const params={}; 
        let fsym=req.query.fsym ? req.query.fsym : "GBP";
        let tsym=req.query.tsym ? req.query.tsym : "USD";
        let resolution=1; 
        if(req.query.resolution<60)
            resolution=req.query.resolution+"M";
        else if(req.query.resolution<1440)
            resolution=(req.query.resolution/60)+"H";
        else
            resolution=(req.query.resolution/1440)+"D";
        params.table=fsym+tsym+"_"+resolution;
        console.log(req.query.from);
        console.log(new Date(req.query.from*1000));
        console.log((new Date(req.query.from*1000)).getFullYear());
        params.range=req.query.from ? (new Date(req.query.from*1000)).getFullYear() : 2021;
        console.log(params);
        const result = await d.query(`
        SELECT  * from :table
        WHERE TRUNC(DATETIME)>=TO_DATE('01/JAN/:range','dd/mon/yyyy')
        `        
        , params);
        res.send(result);        
    }    
}



