const fs = require('fs');

function read_db(db_name = 'app.json') {
    const data = fs.readFileSync(db_name, 'utf8');

    return JSON.parse(data);
}

function write_db(onj, db_name = 'app.json') {
    if (!obj) return console.log("No data to save!")
    try {
        fs.writeFileSync(db_name, JSON.stringify(obj));
        return console.log('data saved!');
    } catch (err) {
        return console.log(err);
    }
}

module.exports = {
    read_db,
    write_db
}
