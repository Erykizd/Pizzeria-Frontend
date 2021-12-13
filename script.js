let cartLen = 0;
let cost = 0;
let obj = [];
let cart = [];

setup();


async function setup() {
    obj = await getData();
    makePizzasListItems(obj.length);
    refreshPizzasList();
}


function refreshPizzasList() {
    let im, price, ingredients, id;
    for (let i = 0; i < obj.length; i++) {
        im = obj[i].image;
        name = obj[i].title;
        price = obj[i].price;
        ingredients = String(obj[i].ingredients).replaceAll(",", ", ");
        id = i + 1;
        document.getElementById("pli" + id).innerHTML += '<img id="im' + id + '" class="image" src="' + im + '" >';
        document.getElementById("pli" + id).innerHTML += '<div id="name' + id + '" class="name">' + name + '</div>';
        document.getElementById("pli" + id).innerHTML += '<div id="price' + id + '" class="price">' + price + ' zł</div>';
        document.getElementById("pli" + id).innerHTML += '<div id="ingredients' + id + '" class="ingredients">' + ingredients + '</div>';
        setButton(i + 1);
    }
}


async function getData() {
    let jsonLink = "https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json";
    let textObj = await fetch(jsonLink);
    let txt = await textObj.text();
    let jsonObj = JSON.parse(txt);
    return jsonObj;
}


function addSubButton() {
    let old = document.getElementById("cart").innerHTML;
    document.getElementById("cart").innerHTML = old + '<button type="button" class="button" id="subBtn" onclick="subButtonPressed()"> Zamówienie </button>';
}


function deleteSubButton() {
    document.getElementById("subBtn").remove();
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
    }

    if (position == -1) {
        cartLen++;
        cart.push(
            {
                name: obj[id - 1].title,
                price: obj[id - 1].price,
                quantity: 1
            });
        addCost(id);
    } else {
        cart[position - 1].quantity++;
        addCost(id);
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
        document.getElementById("cost").innerHTML = "Głodny? Zamów naszą pizzę";
        deleteSubButton();
    }
    refreshCart();
}


function refreshCart() {
    document.getElementById("cart_list").innerHTML = "";
    console.clear();

    for (let i = 1; i <= cartLen; i++) {
        addCartListItem(i);
        let cont;
        let name, price;
        name = cart[i - 1].name;
        price = cart[i - 1].price;
        priceSTR = price + " zł";
        quantity = cart[i - 1].quantity;
        cont = '<div class="prodname">' + name + '</div>' + '<div class="prodprice">' + priceSTR + '</div>' + '<button type="button" class="button"  onclick="deleteProductFromCartButtonPressed(this)">Usuń</button>' + '<div class="prodquantity">' + quantity + '</div>';
        document.getElementsByClassName("cli")[i - 1].innerHTML = cont;
        console.log("cart[" + (i - 1) + "].name = " + cart[i - 1].name);
    }

    console.log("cartLen = " + cartLen);
}


function addCost(id) {
    let addcost = obj[id - 1].price;
    cost = cost + Number(addcost);
    cost = Math.round(100 * cost) / 100;
    document.getElementById("cost").innerHTML = "Suma: " + cost + " zł";
}


function addCartListItem(ind) {
    let old = document.getElementById("cart_list").innerHTML;
    document.getElementById("cart_list").innerHTML = old + '<li class="cli" id="cli' + ind + '"></li>';
}


function subButtonPressed() {
    alert("Złożono zamówienie");
    refreshCart();
}
