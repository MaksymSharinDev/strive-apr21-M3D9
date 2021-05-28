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
window.onload = () => {
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
                productsSock.innerHTML = productsSock.innerHTML + tmpl('productTemplate', pageData)
            }, 2500)
        } catch (e) {
            alert("missing micro templating script")
        }
    }
    const deleteOne =
        async (id) => {
            await fetch(`api/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: pageData['access_token']
                })
            }).then(r => r.json()).then(data => console.log(`product id:${id} Deleted`))
        }
    const deleteAll = async () => {
            for (let elem of pageData.products){
                try{
                    await deleteOne( elem._id )
                }catch (e){ console.log( `impossible to delete product ID: ${elem._id}` ) }
            }
        }

    ;(function main() {
        readToken()
            //.then(() => createProduct())
            .then(() => viewProducts())
            .then(() => populatePage())
    })()
    ;(function addProductCard() {
        document.addEventListener('dragover', e => e.preventDefault())
        const imgUploadWrapper = $('#addCard .img-upload-wrapper')[0]
        const imageIcon = $('#addCard .card-img-top i')[0]
        const ImageUrlForm = $('#addCard .card-img-top .form-div')[0]
        const ImageSlot = $('#addCard .card-img-top')[0]

        imgUploadWrapper.addEventListener('mouseover', e => {
            imgUploadWrapper.classList.add('active')
            imageIcon.classList.add('hover')
            ImageUrlForm.classList.remove('collapse')
        })
        imgUploadWrapper.addEventListener('mouseout', e => {
            imgUploadWrapper.classList.remove('active')
            imageIcon.classList.remove('hover')
            ImageUrlForm.classList.add('collapse')
        })
        imgUploadWrapper.addEventListener('dragover', e => e.currentTarget.style.cursor = 'copy')
        imgUploadWrapper.addEventListener('drop', e => {
            e.preventDefault()
            let files = e.dataTransfer.items;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    let isImage = files[i].type.match('^image/')
                    isImage ? (() => {
                        let file = files[i].getAsFile();
                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                            pageData.imgToLoadBlob = reader.result;
                            ImageSlot.style.background = `url(${reader.result})`
                            ImageSlot.style.backgroundSize = 'contain'
                        })
                        file ? reader.readAsDataURL(file) : null
                    })() : null
                }
            }
        })

        const addBtn = $('#addCard [type="submit"] ')
        addBtn.on('click', e => {
            e.preventDefault();
            let inputsValues = [...$('#addCard ul input')].map(el => el.value)
            uploadImage(pageData.imgToLoadBlob).then(data => {
                let imgSrc = data.medium.url
                createProduct(imgSrc, inputsValues[0], inputsValues[1], inputsValues[2])
                    .then(populatePage)
            })
            //UPLOAD IMAGE

            /*
            console.log(imgSrc, inputsValues)
            */
        })
    })()
    ;(function deleteProductCards() {
        $('.btn-danger')[0].addEventListener('click',(e)=>{
            deleteAll().then(() => alert('oh, feeling nuclear today?') )
        })
    })()
}