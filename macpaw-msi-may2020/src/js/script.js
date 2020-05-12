'use strict';

let newObj;
const randUrl = 'https://api.chucknorris.io/jokes/random',
    catUrl = 'https://api.chucknorris.io/jokes/random?category=',
    srchUrl = 'https://api.chucknorris.io/jokes/search?query=',
    textWrapper = document.getElementById('textMesWrap'),
    modalMain = document.getElementById('modal'),
    catCont = document.getElementById('cat_cont'),
    randRadInp = document.getElementById('rand'),
    catRadInp = document.getElementById('cat'),
    srchRadInp = document.getElementById('srch'),
    srchTextInp = document.querySelector('.form__line__inner--srch'),
    textSrch = document.getElementById('textSrch'),
    submit = document.getElementById('submit'),
    popup = document.querySelector('.popup'),
    popText = document.querySelector('.popup__text'),
    popBut = document.querySelector('.popup__but'),
    favsWrap = document.getElementById('favsWrap'),
    favMenu = document.getElementById('fav_menu'),
    modalSec = document.querySelector('.modal');


self.onload = function () {
    getFromStore();
    fetchChuckApi('https://api.chucknorris.io/jokes/categories', addCategories);
    // localStorage.clear();
}


// fetch json from chucknorris api

function fetchChuckApi(url, funcName) {
    try {
        fetch(url,
            {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((response) => funcName(addToArr(response)));
    } catch (error) {
        alert(error);
    }
}


function addToArr(obj) {
    let arr = [];
    if (obj.id) {
        document.getElementById(obj.id) !== null ? newObj = {} : newObj = { ...obj };
    } else if (obj.result) {
        if (textWrapper.children.length) {
            obj.result.forEach(val => {
                if (document.getElementById(val.id) === null) {
                    arr.push(val);
                }
            })
            newObj = { ...arr };
        } else {
            newObj = { ...obj.result };
        }
    } else {
        newObj = { ...obj };
    }
    return newObj;
}


// draw categories

function addCategories(obj) {
    let catList = document.createElement('ul');
    catList.classList.add('form__line__inner__list');
    catCont.appendChild(catList);
    Object.entries(obj).forEach(([i, val]) => {
        let catEl = document.createElement('li');
        catList.appendChild(catEl);
        let catElInp = document.createElement('input');
        catElInp.type = 'checkbox';
        catElInp.id = i;
        catElInp.name = 'cat';
        catElInp.value = val;
        catEl.appendChild(catElInp);
        let catElLab = document.createElement('label');
        catElLab.htmlFor = i;
        catElLab.innerHTML = val;
        catEl.appendChild(catElLab);
    })
}


// additional info by click radio-buts

randRadInp.addEventListener('click', function () {
    catCont.style.display = 'none';
    srchTextInp.style.display = 'none';
});
catRadInp.addEventListener('click', function () {
    catCont.style.display = 'block';
    srchTextInp.style.display = 'none';
});
srchRadInp.addEventListener('click', function () {
    srchTextInp.style.display = 'block';
    catCont.style.display = 'none';
});


// check radio buttons

function getSelectedRadioValues(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]:checked`);
    radios.forEach((rad) => {
        if (rad.value === 'rand') {
            fetchChuckApi(randUrl, addJoke);
        } else if (rad.value === 'cat') {
            corCat();
        } else {
            corInp();
        }
    });
}


// correct radio category

function corCat() {
    if (getSelectedCheckboxValues('cat').length) {
        fetchChuckApi(catUrl + getSelectedCheckboxValues('cat'), addJoke);
    } else {
        errMes('Chuck dont know anything about this category...');
    }
}


// correct input text

function corInp() {
    let letters = /^[0-9a-zA-Z]+$/;
    if (2 < textSrch.value.length && textSrch.value.length < 121) {
        console.log(textSrch.value.length)
        if (textSrch.value.match(letters)) {
            fetchChuckApi(srchUrl + textSrch.value, addJokeBySrch);
        } else {
            errMes('Chuck using letters and numbers!');
        }
    } else {
        errMes('Chuck using min 3 and max 120 symbols');
    }
}


// check checkbox buttons

function getSelectedCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((cb) => {
        values.push(cb.value);
    });
    return values;
}


// get jokes by submit form

submit.addEventListener('click', function (e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    getSelectedRadioValues('jokes');
});


//draw joke

function drawJoke(obj, cont) {
    let textOuter = document.createElement('div');
    textOuter.id = obj.id;
    textOuter.classList.add('textMes__outer_' + cont.id);
    cont.appendChild(textOuter);
    for (let i = 0; i < 2; i++) {
        let textInner = document.createElement('div');
        textInner.classList.add('textMes__outer_' + cont.id + '__inner_' + obj.id);
        textOuter.appendChild(textInner);
    }
    let comImg = document.createElement('img');
    comImg.classList.add('textMes__outer_' + cont.id + '__inner__com_img');
    comImg.src = 'img/com.svg';
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).appendChild(comImg);
    let likeImg = document.createElement('a');
    likeImg.classList.add('textMes__outer_' + cont.id + '__inner__like_img');
    likeImg.classList.add('textMes__outer_' + cont.id + '__inner__like_img_' + obj.id);

    // check joke in favourites
    if (localStorage.getItem(obj.id) !== null) {
        likeImg.classList.add('fav');
    }
    likeImg.style.backgroundImage = 'url(img/love.svg)';
    likeImg.href = '#';
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.appendChild(likeImg);
    let idBox = document.createElement('div');
    idBox.classList.add('textMes__outer_' + cont.id + '__inner__idbox');
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.appendChild(idBox);
    let idText = document.createElement('span');
    idText.classList.add('textMes__outer_' + cont.id + '__inner__idbox__text');
    idText.innerHTML = 'ID:';
    idBox.appendChild(idText);
    let idLink = document.createElement('a');
    idLink.classList.add('textMes__outer_' + cont.id + '__inner__idbox__link');
    idLink.innerHTML = obj.id;
    idLink.href = obj.url;
    idLink.target = '_blank';
    idBox.appendChild(idLink);
    let idImg = document.createElement('img');
    idImg.classList.add('textMes__outer_' + cont.id + '__inner__idbox__img');
    idImg.src = 'img/link.svg';
    idBox.appendChild(idImg);
    let jokeText = document.createElement('p');
    jokeText.classList.add('textMes__outer_' + cont.id + '__inner__joketext');
    jokeText.innerHTML = obj.value;
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.appendChild(jokeText);
    let footBox = document.createElement('div');
    footBox.classList.add('textMes__outer_' + cont.id + '__inner__foot_box')
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.appendChild(footBox);
    let upd = document.createElement('p');
    upd.classList.add('textMes__outer_' + cont.id + '__inner__foot_box__update');
    upd.innerHTML = 'Last update: ' + getHours(Date.parse(obj.updated_at)) + ' hours ago';
    document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.children[3].appendChild(upd);
    if (obj.categories != null) {
        if (obj.categories.length) {
            let cat = document.createElement('span');
            cat.classList.add('textMes__outer_' + cont.id + '__inner__foot_box__cat');
            cat.innerHTML = obj.categories;
            document.querySelector('.textMes__outer_' + cont.id + '__inner_' + obj.id).nextElementSibling.children[3].appendChild(cat);
        }
    }
    remFromFav(obj.id);
}


// adding joke

function addJoke(obj) {
    if (Object.keys(obj).length) {
        drawJoke(obj, textWrapper);
        addToFav(obj.id, obj);
        remFromFav(obj.id);
    } else {
        errMes('Chuck is tyred to do it twice');
    }
}


// adding joke by searching

function addJokeBySrch(obj) {
    console.log('addjoke', obj)
    if (Object.keys(obj).length) {
        Object.entries(obj).forEach(([k, val]) => {
            addJoke(val);
        })
    } else {
        errMes('Chuck is very drunk');
    }
}


// same joke

function errMes(text) {
    popText.innerHTML = text;
    popup.classList.toggle('popup_close');
    setTimeout(function () { modalMain.classList.toggle('modal_back'); modalMain.classList.toggle('index'); }, 300);
    popBut.addEventListener('click', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        errMes();
    })
}


// add to favourites

function addToFav(id, obj) {
    const likeOnJokeInMain = document.querySelector('.textMes__outer_textMesWrap__inner__like_img_' + id);

    likeOnJokeInMain.addEventListener('click', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        this.classList.toggle('fav');
        if (localStorage.getItem(id) === null) {
            addToStore(obj);
            drawJoke(obj, favsWrap);
        } else {
            remUnfav(id);
            remFromStor(id);
        }
    })
}


// unfavourite joke

function remUnfav(id) {
    const likeOnJokeInFavs = document.querySelector('.textMes__outer_favsWrap__inner__like_img_' + id);
    likeOnJokeInFavs.parentElement.parentElement.remove();
}


// remove from favourites

function remFromFav(id) {
    const likeOnJokeInFavs = document.querySelector('.textMes__outer_favsWrap__inner__like_img_' + id);
    const likeOnJokeInMain = document.querySelector('.textMes__outer_textMesWrap__inner__like_img_' + id);
    if (likeOnJokeInFavs instanceof Element) {
        likeOnJokeInFavs.addEventListener('click', function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            likeOnJokeInFavs.parentElement.parentElement.remove();
            if (likeOnJokeInMain instanceof Element) {
                likeOnJokeInMain.classList.remove('fav');
            }
            remFromStor(id);
        })
    }
}


// get time

function getHours(ms) {
    let nMs = Date.now() - ms;
    let s = nMs / 1000;
    let m = s / 60;
    let h = m / 60;
    return Math.round(h);
}


// favourite menu by clicking

if (self.screen.width < 1440) {
    favMenu.addEventListener('click', function () {
        this.children[0].children[0].classList.toggle('line--fir');
        this.children[0].children[1].classList.toggle('line--sec');
        modalSec.classList.toggle('modal_overlay');
        setTimeout(function () { modalMain.classList.toggle('modal_back') }, 300);
    });
}


// add to localStorage

function addToStore(obj) {
    let joke = {
        id: obj.id,
        url: obj.url,
        categories: obj.categories.length ? obj.categories : null,
        value: obj.value,
        updated_at: obj.updated_at
    }
    if (typeof (Storage) !== "undefined") {
        self.localStorage.setItem(joke.id, JSON.stringify(joke));
    } else {
        alert('Sorry no storage support');
    }
}


// remove from localStorage

function remFromStor(id) {
    self.localStorage.removeItem(id);
}


// get favourite jokes from localStorage

function getFromStore() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        drawJoke(JSON.parse(value), favsWrap);
    }
}
