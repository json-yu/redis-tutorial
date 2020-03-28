const helpButton = document.getElementById('help-button');
let hasBeenCalled = false;

const callForHelp = () => {
  fetch('/help')
    .then(res => res.json())
    .then(hero => {
      if (hero.status === 400) {
        console.log('Error when calling for help. Please try again.');
        return;
      };

      document.getElementById('hero-name').innerHTML = hero.name;
      document.getElementById('hero-picture').src = hero.image;

      if (!hasBeenCalled) {
          hasBeenCalled = true;
          const callForHelpAgainButton = document.createElement('button');
          callForHelpAgainButton.id = 'help-again';
          callForHelpAgainButton.heroId = `${hero.id}`
          callForHelpAgainButton.innerHTML = 'Call for help again!';
          callForHelpAgainButton.addEventListener('click', callForHelpAgain);
          document.getElementById('section-one').appendChild(callForHelpAgainButton);
      };
    })
    .catch(err => {
      console.log('Err in callForHelp: ', err);
    })
}

const callForHelpAgain = () => {
  hasBeenCalled = false;
  const heroId = document.getElementById('help-again').heroId; 
  document.getElementById('help-again').remove();
  document.getElementById('hero-name').innerHTML = '';
  document.getElementById('hero-picture').src = '';
  callForHelp();
}

helpButton.addEventListener('click', callForHelp);