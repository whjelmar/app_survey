const { read_db } = require("./db_functions.js");

test('read json', () => {
    expect(
        read_db()
    ).toBe("{"app_name" : "test_app"}");
});



