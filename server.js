const fs = require('fs/promises');
const http = require('http');

const cats = require('./cats.json');


const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
    });

    if (req.url == '/') {
        const homePage = await readFile('./views/home.html');

        const catsHtml = await Promise.all(cats.map(cat => catTemplate(cat)));
        const result = homePage.replace('{{cats}}', catsHtml);

        res.write(result);
    } else if (/cats\/\d+\/edit/.test(req.url)) {
        const catId = req.url.split('/')[2];
        const cat = cats.find(x => x.id == catId);

        const editHtml = await catEditTemplate(cat, './views/editCat.html');
        res.write(editHtml)
    } else if (req.url == '/content/styles/site.css') {
        res.writeHead(200, {
            'Content-Type': 'text/css',
        });
        const siteCss = await readFile('./content/styles/site.css');
        res.write(siteCss)
    } else if (req.url == '/cats/content/styles/site.css') {
        res.writeHead(200, {
            'Content-Type': 'text/css',
        });
        const siteCss = await readFile('./content/styles/site.css');
        res.write(siteCss)
    }else if (req.url == '/cats/add-breed') {
        const addBreed = await readFile('./views/addBreed.html');

        res.write(addBreed);
    } else if (req.url == '/cats/add-cat') {
        const addCat = await readFile('./views/addCat.html');

        res.write(addCat);
    } else {
        res.write(`
            <h1>404</h1>
        `);
    }

    res.end();
});

function readFile(path) {
    return fs.readFile(path, { encoding: 'utf-8' })
}

async function catEditTemplate(cat, path) {
    const html = await readFile(path);

    const modifiedHtml = Object.keys(cat).reduce((result, key) => {
        return result.replace(`{{${key}}}`, cat[key]);
    }, html);

    return modifiedHtml
}

async function catTemplate(cat) {
    const html = await readFile('./views/partials/cat.html');

    // let result = html.replace('{{name}}', cat.name);
    // result = result.replace('{{description}}', cat.description);
    // result = result.replace('{{imageUrl}}', cat.imageUrl);
    // result = result.replace('{{breed}}', cat.breed);
    // return result;

    const modifiedHtml = Object.keys(cat).reduce((result, key) => {
        return result.replace(`{{${key}}}`, cat[key])
    }, html);

    return modifiedHtml;
}
server.listen(5000);
console.log('Server is running on port 5000...');