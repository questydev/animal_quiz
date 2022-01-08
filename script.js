const mainContainer = document.getElementById("maincontainer");
const header = document.querySelector(".header");
const scoreboard = document.querySelector(".scoreboard");
let currentSound;
let questionTally = 0;

async function loadAnimals() {
  const response = await fetch("./animals.json");
  const animals = await response.json();
  let animalArray = animals.animals;
  let animalArraySel = [];
  let correctAnimal = "";

  //Creating Scoreboard
  scoreboard.innerHTML = `<span>${questionTally}</span><div>Correct</div>`;

  function animalQuestionNew() {
    //Pick 4 random animals
    for (let i = 0; i < 4; i++) {
      const random = Math.floor(Math.random() * animalArray.length);
      let tempAnimalRemoved = animalArray[random];
      animalArray.splice(animalArray.indexOf(tempAnimalRemoved), 1);
      animalArraySel.push(tempAnimalRemoved);

      //Create the current set of 4 animals to choose from
      const randomTwo = Math.floor(Math.random() * animalArraySel.length);
      correctAnimal = animalArraySel[randomTwo];

      //Update question text
      let firstCharacter = correctAnimal.name.charAt(0);

      if (
        firstCharacter === "a" ||
        firstCharacter === "e" ||
        firstCharacter === "i" ||
        firstCharacter === "o" ||
        firstCharacter === "u"
      ) {
        header.innerHTML = `Which animal is an ${correctAnimal.name
          .charAt(0)
          .toUpperCase()}${correctAnimal.name.slice(1)}?`;
      } else {
        header.innerHTML = `Which animal is a ${correctAnimal.name
          .charAt(0)
          .toUpperCase()}${correctAnimal.name.slice(1)}?`;
      }
    }

    animalArraySel.forEach((animal) => {
      //create main Div for the animal card
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("aniCard");

      //create the animal background div of the card
      const aniDiv = document.createElement("div");
      aniDiv.id = animal.name;
      aniDiv.classList.add("aniCardBG", "aniCardHover");
      aniDiv.style.backgroundImage = `url('${animal.path}')`;

      //Adding greensock animation
      gsap.fromTo(
        mainContainer,
        { x: 3000, opacity: 0, duration: 0.01 },
        { x: 0, opacity: 1, duration: 2, ease: "circ.out" }
      );

      //Add both divs as children to the main div
      cardDiv.appendChild(aniDiv);

      //Then append the main div element to the mainContainer
      mainContainer.appendChild(cardDiv);

      //Then add the Event listener to the main div
      aniDiv.addEventListener("click", checkAnswer);
    });

    //Checking to see if your answer is correct or incorrect
    function checkAnswer(event) {
      const currentCard = event.target;
      const allCards = document.querySelectorAll(".aniCardBG");

      if (currentCard.id === correctAnimal.name) {
        //Add one to the correct tally
        questionTally++;

        //Remove Click Functionality from all buttons
        for (let i = 0; i < allCards.length; i++) {
          allCards[i].removeEventListener("click", checkAnswer);
          allCards[i].classList.remove("aniCardHover");
          allCards[i].classList.add("aniCardDisabled");
          currentCard.classList.remove("aniCardDisabled");
          //console.log(allCards[i]);
        }

        //Play Correct Audio
        playCorrectAudio();

        //Create correct checkmark
        //Get the Parent Node for the current Clicked Card
        const currentCardParent = currentCard.parentNode;

        //Create the feedback portion of the card
        const feedbackDiv = document.createElement("div");
        feedbackDiv.id = "feedback";
        feedbackDiv.classList.add("feedback", "correct");
        feedbackDiv.innerHTML = `<i class="fas fa-check"></i>`;
        currentCardParent.appendChild(feedbackDiv);

        //Adding greensock animation for next set of animals to slide in
        gsap.to(mainContainer, {
          x: -3000,
          opacity: 0,
          duration: 1,
          ease: "power1.in",
        });

        setTimeout(
          function () {
            while (mainContainer.hasChildNodes()) {
              mainContainer.removeChild(mainContainer.firstChild);
            }

            animalArray = animalArray.concat(animalArraySel);
            animalArraySel = [];
            //console.log(animalArray, animalArraySel);

            //clearAudio();
            loadAnimals();
          }.bind(this),
          1000
        );
      } else {
        //When an answer is incorrect
        currentCard.removeEventListener("click", checkAnswer);
        currentCard.classList.remove("aniCardHover");
        currentCard.classList.add("aniCardDisabled");

        //Create incorrect checkmark
        //Get the Parent Node for the current Clicked Card
        const currentCardParent = currentCard.parentNode;

        //Create the feedback portion of the card
        const feedbackDiv = document.createElement("div");
        feedbackDiv.id = "feedback";
        feedbackDiv.classList.add("feedback", "incorrect");
        feedbackDiv.innerHTML = `<i class="fas fa-times"></i>`;
        currentCardParent.appendChild(feedbackDiv);

        //Play Incorrect Sound
        playIncorrectAudio();
      }
    }
  }
  animalQuestionNew();
}

function playCorrectAudio() {
  let currentSound = new Audio("sounds/correct.mp3");
  currentSound.play();
  //Below resets Audio variable for use on iOS
  currentSound = null;
}

function playIncorrectAudio() {
  let currentSound = new Audio("sounds/incorrect.mp3");
  currentSound.play();
  currentSound = null;
}

loadAnimals();
