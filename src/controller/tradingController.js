const Database = require('../database/Database.js');

module.exports = { 
    async getData(req, res) {
        console.log("controller");
        const d = await new Database();      
        let fsym=req.query.fsym ? req.query.fsym : "GBP";
        let tsym=req.query.tsym ? req.query.tsym : "USD";
        let resolution=1; 
        if(req.query.resolution<60)
            resolution=req.query.resolution+"M";
        else if(req.query.resolution<1440)
            resolution=(req.query.resolution/60)+"H";
        else if(req.query.resolution<1440)
            resolution=(req.query.resolution/1440)+"D";
        else
            resolution=resolution+"M";
        const table=fsym+tsym+"_"+resolution;
        console.log(req.query.from);
        console.log(new Date(req.query.from*1000));
        console.log((new Date(req.query.from*1000)).getFullYear());
        let range=req.query.from ? (new Date(req.query.from*1000)).getFullYear() : 2021;
        const result = await d.query(`
        SELECT  * from "ADMIN"."${table}"
        WHERE TRUNC(DATETIME)>=TO_DATE('01/JAN/' || :range,'dd/mon/yyyy')
        `        
        , {range:range});
        // const result = await d.query(`
        // SELECT  * from "ADMIN"."GBPUSD_1M"
        // WHERE TRUNC(DATETIME)>=TO_DATE('01/JAN/2021','dd/mon/yyyy')
        // `        
        // );
        res.send(result);        
    }    
}



