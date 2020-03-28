const helpButton = document.getElementById('help-button');
let hasBeenCalled = false; // initial boolean to help control which buttons show

const callForHelp = id => {
  // upon initial fetch, there will be no id
  fetch(`/help/${id}`)
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
      }
    })
    .catch(err => {
      console.log('Err in callForHelp: ', err);
    })
};

const callForHelpAgain = () => {
  hasBeenCalled = false;
  // grab the heroId before removing the html element
  const heroId = document.getElementById('help-again').heroId;
  document.getElementById('help-again').remove();
  // clear the existing html details
  document.getElementById('hero-name').innerHTML = '';
  document.getElementById('hero-picture').src = '';
  callForHelp(heroId);
};

helpButton.addEventListener('click', callForHelp);