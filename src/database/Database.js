const oracledb = require('oracledb');

class Database {    

    constructor() {
        this.user = process.env.NODE_ORACLEDB_USER,
        this.password = process.env.NODE_ORACLEDB_PASSWORD,
        this.connectString = `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${process.env.NODE_ORACLEDB_HOSTNAME})(PORT = ${process.env.NODE_ORACLEDB_PORT}))(CONNECT_DATA =(SID= ${process.env.NODE_ORACLEDB_SID})))`
        this.externalAuth = true
    }

    getConnection() {
        console.log(process.env.NODE_ORACLEDB_USER);
        console.log(this.connectString);
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