"use strict";

let cartLen = 0;
let cost = 0;
let obj = [];
let cart = [];
let chckd = "AZ";

setup();

async function setup() {
    obj = await getData();
    sortPizzasList("AZ");
    refreshPizzasList();

    cart = readCartFromLocalStorage();
    cartLen = cart.length;
    if (cartLen > 0) {
        addSubButton();
        addClearCartButton();
    }
    refreshCart();
}


function refreshPizzasList() {
    let im, price, ingredients, id;
    document.getElementById("pizzas_list").innerHTML = "";
    makePizzasListItems(obj.length);
    console.clear();

    for (let i = 0; i < obj.length; i++) {
        im = obj[i].image;
        name = obj[i].title;
        price = obj[i].price;
        ingredients = String(obj[i].ingredients);
        id = i + 1;
        document.getElementById("pli" + id).innerHTML += '<img id="im' + id + '" class="image" src="' + im + '" >';
        document.getElementById("pli" + id).innerHTML += '<div id="name' + id + '" class="name">' + name + '</div>';
        document.getElementById("pli" + id).innerHTML += '<div id="price' + id + '" class="price">' + price + ' zł</div>';
        document.getElementById("pli" + id).innerHTML += '<div id="ingredients' + id + '" class="ingredients">' + ingredients + '</div>';
        console.log("obj[" + i + "].title, price, ingredients = " + obj[i].title + " " + obj[i].price + " " + obj[i].ingredients);
        setButton(i + 1);
    }
}


async function getData() {
    let jsonLink = "https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json";
    let textObj = await fetch(jsonLink);
    let txt = await textObj.text();
    let jsonObj = JSON.parse(txt);
    for (let i = 0; i < jsonObj.length; i++) {
        jsonObj[i].ingredients = String(jsonObj[i].ingredients).replaceAll(",", ", ");
    }
    return jsonObj;
}


function addSubButton() {
    document.getElementById("cart").innerHTML += '<button type="button" class="button" id="subBtn" onclick="subButtonPressed()"> Zamówienie </button>';
}


function addClearCartButton() {
    document.getElementById("cart").innerHTML += '<button type="button" class="button" id="clearCartBtn" onclick="clearCartButtonPressed()"> Wyczyść koszyk </button>';
}


function deleteSubButton() {
    if (document.getElementById("cart").lastChild.id != "cost") {
        document.getElementById("subBtn").remove();
    }
}


function deleteClearCartButton() {
    if (document.getElementById("cart").lastChild.id != "cost") {
        document.getElementById("clearCartBtn").remove();
    }
}


function setButton(id) {
    document.getElementById("pli" + id).innerHTML += '<button type="button" class="button" id="btn' + id + '" onclick="addToCartButtonPressed(' + id + ')">Zamów</button>';
}


function makePizzasListItems(len) {
    for (var j = 1; j <= len; j++) {
        document.getElementById("pizzas_list").innerHTML += '<li id="pli' + j + '"></li>';
    }
}


function addToCartButtonPressed(id) {
    let position = existsInCart(id);
    if (cartLen == 0) {
        addSubButton();
        addClearCartButton();
    }

    if (position == -1) {
        cartLen++;
        cart.push(
            {
                name: obj[id - 1].title,
                price: obj[id - 1].price,
                quantity: 1
            });
    } else {
        cart[position - 1].quantity++;
    }
    refreshCart();
}


function existsInCart(id) {
    let position = -1;
    let search = obj[id - 1].title;
    let current;
    for (let i = 1; i <= cartLen; i++) {
        current = cart[i - 1].name;
        if (search == current) {
            position = i;
        }
    }
    return position;
}


function deleteProductFromCartButtonPressed(button) {
    var id = Number(button.parentElement.id.replace("cli", ""));
    var quantity = cart[id - 1].quantity;
    var priceStr = cart[id - 1].price;
    var price = Number(priceStr);
    cost -= price;
    cost = Math.round(100 * cost) / 100;
    document.getElementById("cost").innerHTML = "Suma: " + cost + " zł";
    cart[id - 1].quantity = cart[id - 1].quantity - 1;

    if (quantity - 1 <= 0) {
        cart[id - 1].quantity = 0;
        for (let i = 0; i < cartLen; i++) {
            cart[id - 1 + i] = cart[id + i];
        }
        cart.pop();
        cartLen--;
    }

    if (cartLen <= 0) {
        clearCartButtonPressed();
    }
    refreshCart();
}


function refreshCart() {

    document.getElementById("cart_list").innerHTML = "";
    saveCartToLocalStorage();

    if (cartLen <= 0) {
        deleteSubButton();
        deleteClearCartButton();
    }

    console.clear();
    cost = 0;
    let cont;
    let name, price, priceSTR, quantity;
    for (let i = 1; i <= cartLen; i++) {
        addCartListItem(i);
        name = cart[i - 1].name;
        price = cart[i - 1].price;
        priceSTR = price + " zł";
        quantity = cart[i - 1].quantity;
        cost += Number(price) * quantity;
        cont = '<div class="prodname">' + name + '</div>' + '<div class="prodprice">' + priceSTR + '</div>' + '<button type="button" class="button"  onclick="deleteProductFromCartButtonPressed(this)">Usuń</button>' + '<div class="prodquantity">' + quantity + '</div>';
        document.getElementsByClassName("cli")[i - 1].innerHTML = cont;
        console.log("cart[" + (i - 1) + "].name = " + cart[i - 1].name);
    }
    refreshCost();
    console.log("cartLen = " + cartLen);
}


function refreshCost() {
    if (cartLen > 0) {
        cost = Math.round(100 * cost) / 100;
        document.getElementById("cost").innerHTML = "Suma: " + cost + " zł";
    } else {
        document.getElementById("cost").innerHTML = "Głodny? Zamównaszą pizzę";
    }
}


function addCartListItem(ind) {
    let old = document.getElementById("cart_list").innerHTML;
    document.getElementById("cart_list").innerHTML = old + '<li class="cli" id="cli' + ind + '"></li>';
}


function subButtonPressed() {
    alert("Złożono zamówienie");
    refreshCart();
}

function clearCartButtonPressed() {
    cart = [];
    cost = 0;
    document.getElementById("cost").innerHTML = "Głodny? Zamów naszą pizzę";
    cartLen = 0;
    refreshCart();
    deleteSubButton();
    deleteClearCartButton();
}


function readCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem("cart"));
}


function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


function sortPizzasList(how) {
    let id = [];
    let title = [];
    let price = [];
    let image = [];
    let ingredients = [];
    let helper = [];

    for (let i = 0; i < obj.length; i++) {
        id[i] = obj[i].id;
        title[i] = obj[i].title;
        price[i] = obj[i].price;
        image[i] = obj[i].image;
        ingredients[i] = obj[i].ingredients;
    }

    switch (how) {
        case "AZ":
            title.sort();
            break;
        case "ZA":
            title.sort();
            title.reverse();
            break;
        case "09":
            price.sort(function (a, b) {
                return a - b
            });
            break;
        case "90":
            price.sort(function (a, b) {
                return a - b
            });
            price.reverse();
            break;
    }

    let ind = [];
    let j = 0;
    let index = 0;

    if (how == "AZ" || how == "ZA") {
        for (let i = 0; i < obj.length; i++) {
            ind = findIndex(title[i], "title");
            index = ind[j];
            j++
            if (j >= ind.length) {
                j = 0;
            }
            helper.push(
                {
                    id: id[index],
                    title: title[i],
                    price: price[index],
                    image: image[index],
                    ingredients: ingredients[index]
                });
        }
    } else if (how == "09" || how == "90") {
        for (let i = 0; i < obj.length; i++) {
            ind = findIndex(price[i], "price");
            index = ind[j];
            j++
            if (j >= ind.length) {
                j = 0;
            }

            helper.push(
                {
                    id: id[index],
                    title: title[index],
                    price: price[i],
                    image: image[index],
                    ingredients: ingredients[index]
                });
        }
    }
    obj = helper;
}


function findIndex(str, str2) {
    let ret = [];
    switch (str2) {
        case "title":
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].title == str) {
                    ret.push(i);
                }
            }
            break;
        case "price":
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].price == str) {
                    ret.push(i);
                }
            }
            break;
        case "ingredients":
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].ingredients.includes(str)) {
                    ret.push(i);
                }
            }
            break;
    }
    return ret;
}


async function radioChecked(radio) {
    obj = await getData();
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName("radio")[i].checked = false;
    }
    radio.checked = true;
    sortPizzasList(radio.id);
    makePizzasListItems(obj.length);
    refreshPizzasList();
    chckd = radio.id;
}


async function inputTextActivated(inpTxt) {
    if (inpTxt.value != "") {
        obj = await getData();
        let txt = inpTxt.value;
        let ingredients = [];
        let ind = [];
        ingredients = txt.split(", ");

        for (let j = 0; j < ingredients.length; j++) {
            ind = findIndex(ingredients[j], "ingredients");
            let heleper = [];

            for (let i = 0; i < ind.length; i++) {
                heleper.push(obj[ind[i]]);
            }
            obj = heleper;
        }

        sortPizzasList(chckd);
        refreshPizzasList();
    } else {
        obj = await getData();
    }
}
