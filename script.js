var cartLen = 0;
var cost = 0;

async function setup()
{
	var jsonLink= "https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json";
	let textObj = await fetch(jsonLink);
	let txt = await textObj.text();
	var obj = JSON.parse(txt);

	document.getElementById("subBtn").style.display='none';

	makePizzasListItems(obj.length);
	var str=[];
	for(var i = 0; i<obj.length; i++)
	{
			setImage(obj[i].image,i+1);
			setName(obj[i].title,i+1);
			setPrice(obj[i].price,i+1);
			setIngredients(obj[i].ingredients,i+1);
			setButton(i+1);
	}
}

function setImage(im,id)
{
	var old=document.getElementById("pli"+id).innerHTML;
	document.getElementById("pli"+id).innerHTML='<img id="im'+id+'" class="image" src="'+im+'" >';
}

function setName(name,id)
{
	var old=document.getElementById("pli"+id).innerHTML;
	document.getElementById("pli"+id).innerHTML=old+'<div id="name'+id+'" class="name">'+name+'</div>';
}

function setPrice(price,id)
{
	var old=document.getElementById("pli"+id).innerHTML;
	document.getElementById("pli"+id).innerHTML=old+'<div id="price'+id+'" class="price">'+price+' zł</div>';
}

function setIngredients(ingredients,id)
{
	ingredients=ingredients.toString().replaceAll(",",", ");
	var old=document.getElementById("pli"+id).innerHTML;
	document.getElementById("pli"+id).innerHTML=old+'<div id="ingredients'+id+'" class="ingredients">'+ingredients+'</div>';
}

function setButton(id)
{
	var old=document.getElementById("pli"+id).innerHTML;
	document.getElementById("pli"+id).innerHTML=old+'<button type="button" class="button" id="btn'+id+'" onclick="pizzaButtonPressed('+id+')">Zamów</button>';
}

function makePizzasListItems(len)
{
	var old;
	for (var j=1; j<=len; j++)
	{
		old=document.getElementById("pizzas_list").innerHTML;
		document.getElementById("pizzas_list").innerHTML = old+'<li id="pli'+j+'"></li>';
	}
}

function pizzaButtonPressed(id)
{
	var position = existsInCart(id);
	var old;
	if (document.getElementById("subBtn").style.display=='none')
	{
		document.getElementById("subBtn").style.display='block';
	}
	if (position==-1)
	{
		addCartListItem();
		setProd(id);
	}
	else
	{	
		old = document.getElementsByClassName("prodquantity")[position].innerHTML;
		document.getElementsByClassName("prodquantity")[position].innerHTML = Number(old)+1;
		addCost(id);
	}
}

function productButtonPressed(button)
{
	var amountOfChildren = button.parentElement.children.length;
	var quantity = button.parentElement.children[amountOfChildren-1].innerHTML; 
	var priceStr = button.parentElement.children[amountOfChildren-3].innerHTML; 
	var price = Number(priceStr.replace(" zł",""));
	
	cost-=price;
	cost=Math.round(100*cost)/100;
	document.getElementById("cost").innerHTML="Suma: "+cost+" zł";
	
	button.parentElement.children[amountOfChildren-1].innerHTML=Number(quantity)-1;
	if (Number(quantity-1)==0)
	{
			button.parentElement.remove(); 
			cartLen--;
	}
	if(cartLen<=0)
	{
		document.getElementById("cost").innerHTML="Głodny? Zamów naszą pizzę";
		document.getElementById("subBtn").style.display='none';
	}
}

function setProd(id)
{
	var ind=cartLen;
	var cont;
	var old;
	old=document.getElementsByClassName("cli")[ind-1].innerHTML;
	var name, price;
	name=document.getElementById("name"+id).innerHTML; //tutaj id -mają być dzieci
	price=document.getElementById("price"+id).innerHTML;
	quantity=1;
	cont = '<div class="prodname">'+name+'</div>'+'<div class="prodprice">'+price+'</div>'+'<button type="button" class="button"  onclick="productButtonPressed(this)">Usuń</button>'+'<div class="prodquantity">'+quantity+'</div>';
	document.getElementsByClassName("cli")[ind-1].innerHTML = cont;
	
	addCost(id);
}

function addCost(id) 
{
	var price=document.getElementById("price"+id).innerHTML;
	var addcost=price.replace(" zł","").replace("Suma: ","");
	cost=cost+Number(addcost);
	cost=Math.round(100*cost)/100;
	document.getElementById("cost").innerHTML="Suma: "+cost+" zł";
}

function addCartListItem() 
{
	cartLen=cartLen+1;
	var ind=cartLen;
	var old;
	old=document.getElementById("cart_list").innerHTML;
	document.getElementById("cart_list").innerHTML = old+'<li class="cli" id="cli'+ind+'"></li>';
}

function existsInCart(id) 
{
	var position=-1;
	var search=document.getElementById("name"+id).innerHTML;
	var current;
	
	for (var i=0; i<cartLen; i++)
	{
		current=document.getElementsByClassName("prodname")[i].innerHTML;
		if(search==current)
		{
			position=i;
		}
	}
	
	return position;
}

function Sub() 
{
	alert("Złożono zamówienie");
}
