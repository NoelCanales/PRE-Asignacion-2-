const server = require("./src/app");

server.listen(process.env.PORT || 5010, () => {
    console.log(`Languages Service working in port: ${process.env.PORT || 5010}`);
});