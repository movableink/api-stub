const http = require('http');

const hostname = process.env.ADDRESS || '127.0.0.1';
const port = process.env.PORT || 9097;

const responseTimePercentiles = {
  50:  200,
  90:  250,
  95:  500,
  99:  500,
  100: 8000
};

let responseTimes = [];

Object.keys(responseTimePercentiles).reverse().forEach((percentile) => {
  for(let i = percentile - 1; i >= 0; i--) {
    responseTimes[i] = responseTimePercentiles[percentile];
  }
});

const responseJson = JSON.stringify({"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}});

const server = http.createServer((req, res) => {
  const responseTime = responseTimes[Math.floor(Math.random() * responseTimes.length)];
  setTimeout(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(responseJson);
    console.log({t: responseTime});
  }, responseTime);
});

server.listen(port, hostname, () => {
  console.error("Simulated response time percentiles:");
  Object.keys(responseTimePercentiles).reverse().forEach((percentile) => {
    console.error(`  ${percentile}%\t${responseTimePercentiles[percentile]}ms`);
  });

  console.error(`Server running at http://${hostname}:${port}/`);
});