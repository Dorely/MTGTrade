// sample api call to deckbrew for card search
// https://api.deckbrew.com/mtg/cards?name=jace

function searchOnKey(input){
    console.log("event called "+input);

    if(input.length > 3) {

        //ajax call to api
        //javascript may not be allowed to make cross domain ajax call, may have to make a same domain call to a php script that does the cross domain call

        //first try doing cross domain call
        var url = "https://api.deckbrew.com/mtg/cards?name=" + encodeURIComponent(input);
        var http_request = new XMLHttpRequest();

        http_request.onreadystatechange = function () {

            if (http_request.readyState == 4) {
                var json = http_request.responseText;
                var jsonObj = JSON.parse(json);
                console.log(jsonObj);
                //console.log(json);


                var resultsArea = document.getElementById("resultsArea");
                resultsArea.innerHTML = "";

                // identify each card details uniquely
                // store price, name, set, and ID data in an element
                for(var i =0;i<jsonObj.length;i++){
                    for( var j = 0;j<jsonObj[i].editions.length;j++){
                        var cardDetails = document.createElement("div");
                        var img = document.createElement("img");
                        var priceArea = document.createElement("div");
                        var buttonBox = document.createElement("div");
                        var button1 = document.createElement("button");
                        var button2 = document.createElement("button");

                        cardDetails.className = "cardDetails";
                        if(img.src = jsonObj[i].editions[j].image_url == "https://image.deckbrew.com/mtg/multiverseid/0.jpg"){

                            img = document.createElement("div");
                            img.className = "missingImage";
                            img.innerHTML = jsonObj[i].name+" "+jsonObj[i].editions[j].set;

                        }else{
                            img.src = jsonObj[i].editions[j].image_url;
                            img.alt = jsonObj[i].name;

                        }

                        priceArea.className = "priceArea";
                        priceArea.innerHTML = "$1.25";// CHANGE THIS ONCE I HAVE ACCESS TO PRICE DATA

                        buttonBox.className = "buttonBox";

                        button1.className ="addButton";
                        button1.innerHTML = "Side 1";

                        button1.cardName = jsonObj[i].name;
                        button1.cardSet = jsonObj[i].editions[j].set_id;
                        button1.cardPrice = 1.25; //temporary placeholder number
                        button1.cardID = jsonObj[i].editions[j].multiverse_id;
                        button1.side = "left";

                        button1.addEventListener("click",addToSide);

                        button2.className="addButton";
                        button2.innerHTML = "Side 2";

                        button2.cardName = jsonObj[i].name;
                        button2.cardSet = jsonObj[i].editions[j].set_id;
                        button2.cardPrice = 1.25; //PLACEHOLDER
                        button2.cardID = jsonObj[i].editions[j].multiverse_id;
                        button2.side = "right";

                        button2.addEventListener("click",addToSide);

                        resultsArea.appendChild(cardDetails);
                        cardDetails.appendChild(img);
                        cardDetails.appendChild(priceArea);
                        cardDetails.appendChild(buttonBox);
                        buttonBox.appendChild(button1);
                        buttonBox.appendChild(button2);

                    }
                }

                /*
                 <div class="cardDetails">
                    <img src="Magic_Card_Back.png" alt="card Image here">
                    <div class="priceArea">Price : $$$$$</div>
                    <div class="buttonBox">
                        <button class="addButton">Side 1</button>
                        <button class="addButton">Side 2</button>
                    </div>
                 </div>
                 */

            }
        };

        http_request.open("GET", url, true);
        http_request.send();

        //take json returned from api and build card structures as such:
        //price data will have to be captured separately from tcgplayer.com this will best be done in the php as well
        //tcgplayer wants each price cached once a day,

    }
}


function addToSide(event){
    console.log(event.target)
    var button = event.target;
    console.log(button.cardName);
    console.log(button.cardPrice);

    var tradeArea;
    var totalArea;
    var differenceArea;
    var otherTotalArea;
    var otherDifferenceArea;
    if(button.side == "left"){
        tradeArea = document.getElementById("tradeTable1");
        totalArea = document.getElementById("leftTotal");
        differenceArea = document.getElementById("leftDifference");
        otherTotalArea = document.getElementById("rightTotal");
        otherDifferenceArea = document.getElementById("rightDifference");
    }else if(button.side == "right"){
        tradeArea = document.getElementById("tradeTable2");
        totalArea = document.getElementById("rightTotal");
        differenceArea = document.getElementById("rightDifference");
        otherTotalArea = document.getElementById("leftTotal");
        otherDifferenceArea = document.getElementById("leftDifference");
    }
    console.log(button.side)
    console.log(tradeArea);

    var newRow = document.createElement("div");
    newRow.className = "tableRow";

    var nameDiv = document.createElement("div");
    var priceDiv = document.createElement("div");
    var removeButton = document.createElement("button");

    nameDiv.innerHTML = button.cardName + " - "+ button.cardSet;
    priceDiv.innerHTML = "$"+button.cardPrice;
    removeButton.innerHTML = "Remove";

    newRow.appendChild(nameDiv);
    newRow.appendChild(priceDiv);
    newRow.appendChild(removeButton);

    tradeArea.appendChild(newRow);

    // <div class="tableRow">
    //      <div>Name here - Set</div>
    //      <div>$$.$$</div>
    //      <button>Remove</button>
    // </div>


    //update total and difference
    var total = Number(totalArea.innerHTML);
    total += button.cardPrice;
    totalArea.innerHTML = total;

    var otherTotal = Number(otherTotalArea.innerHTML);

    var difference = otherTotal - total;
    differenceArea.innerHTML = difference;

    var otherDifference = total - otherTotal;

    otherDifferenceArea.innerHTML = otherDifference;

}