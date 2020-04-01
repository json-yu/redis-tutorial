const helpButton = document.getElementById('help-button');

const callForHelp = id => {
  // upon initial fetch, there will be no id
  fetch(`/help/${id}`)
    .then(res => res.json())
    .then(hero => {
      if (hero.status === 400) {
        console.log('Error when calling for help. Please try again.');
        return;
      };

      // hide original button
      document.getElementById('help-button').style.display = "none";

      // create html elements using data retrieved
      document.getElementById('hero-name').innerHTML = hero.name;
      document.getElementById('hero-picture').src = hero.image;

      // create new button
      const callForHelpAgainButton = document.createElement('button');
      callForHelpAgainButton.id = 'help-again';
      callForHelpAgainButton.heroId = `${hero.id}`
      callForHelpAgainButton.innerHTML = 'Call for help again!';
      callForHelpAgainButton.addEventListener('click', callForHelpAgain);
      document.getElementById('section-one').appendChild(callForHelpAgainButton);
    })
    .catch(err => {
      console.log('Err in callForHelp: ', err);
    })
};

const callForHelpAgain = () => {
  // grab the heroId before removing the html element
  const heroId = document.getElementById('help-again').heroId;
  document.getElementById('help-again').remove();
  // clear the existing html details
  document.getElementById('hero-name').innerHTML = '';
  document.getElementById('hero-picture').src = '';
  callForHelp(heroId); 
};

helpButton.addEventListener('click', callForHelp);