//things to show:
// credentials are in a env file
// front-end -> backend only POST request with access_token
// backend interfacing with external APIs
// API wrapping
// i set static root
// for speedup, i set npm run dev to  kill -9 $(lsof -ti tcp:8000 ) ; nodemon server.js
// i learned to use postmen
let pageData = {
    access_token: "",
    products: []
}

    const readToken = async () =>
        await fetch('api/login', {method: 'POST'})
            .then(r => r.json()).then(data => pageData.access_token = data.access_token)
    const createProduct = async (imgBlob, name, desc, company) =>
        await fetch('api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "access_token": pageData.access_token,
                "name": name,
                "description": desc,
                "brand": company,
                "imageUrl": imgBlob,
                "price": 0
            })
        }).then(r => r.json()).then(data => pageData.products.push(data))

    const uploadImage = async (blob) =>
        await fetch('api/imageUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: pageData['access_token'],
                "blob": blob
            })
        }).then(r => r.json()).then(data => data)

    const viewProducts = async () => {
        await fetch(`api/product/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: pageData['access_token']
            })
        }).then(r => r.json()).then(data => pageData.products = [...pageData.products, ...data])
    }
    const populatePage = () => {
        try {
            setTimeout(() => {
                $('#card-loading')[0]
                    .setAttribute('hidden', 'true')
                let productsSock = document.querySelector('#productsSock')
                productsSock.innerHTML = ''
                productsSock.innerHTML = productsSock.innerHTML + tmpl('productTemplate', pageData)
            }, 2500)
        } catch (e) {
            alert("missing micro templating script")
        }
    }
    const deleteOne =
        async (id) => {
            document.getElementById(id).outerHTML = ""
            let idArr = pageData.products.map(obj => obj._id)
            pageData.products.splice( idArr.indexOf(id) , 1)
            await fetch(`api/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: pageData['access_token']
                })
            }).then(r => r.json()).then(() => null) //console.log(`product id:${id} Deleted`))
        }

