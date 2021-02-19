const oracledb = require('oracledb');

class Database {    

    constructor() {
        this.user = "admin",
        this.password = "iMPj1YEdB9OZCDXCjoNW",
        this.connectString = `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = optitrade.cwddl2yxow6x.us-east-2.rds.amazonaws.com)(PORT = 1521))(CONNECT_DATA =(SID= OPTI)))`
        this.externalAuth = false
    }

    getConnection() {
        // console.log(process.env.NODE_ORACLEDB_USER);
        // console.log(this.connectString);
        return oracledb.getConnection({            
                user: this.user,
                password: this.password,
                connectString: this.connectString,
                externalAuth: this.externalAuth             
        })
    }

    async query(sql, params = []) {        
            const conn = await this.getConnection();
            const result = await conn.execute(sql, params);
            return result;       
        
    }
}

module.exports = Database;