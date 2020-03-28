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
          const callForHelpAgain = document.createElement('button');
          callForHelpAgain.id = 'help-again'
          callForHelpAgain.innerHTML = 'Call for help again!';
          callForHelpAgain.addEventListener('click', callForHelpAgain);
          document.getElementById('section-one').appendChild(callForHelpAgain);
      };
    })
    .catch(err => {
      console.log('Err in callForHelp: ', err);
    })
}

const callForHelpAgain = () => {
    hasBeenCalled = false;
    document.getElementById('help-again').remove();
    document.getElementById('hero-name').innerHTML = '';
    document.getElementById('hero-picture').src = '';
    callForHelp();
}

helpButton.addEventListener('click', callForHelp);